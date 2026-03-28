import os
import io
import csv
import json
from datetime import datetime, timedelta
from calendar import monthrange
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app import models
from app.api.deps import get_db
from app.services.forecasting import train_prophet_model

try:
    from prophet.serialize import model_from_json
except ImportError:
    pass

router = APIRouter()

def _get_daily_stats(db: Session):
    orders = db.query(models.Order).order_by(models.Order.created_at).all()
    stats = {}
    for order in orders:
        if not order.created_at:
            continue
        day = order.created_at.date().isoformat()
        if day not in stats:
            stats[day] = {"date": day, "total": 0.0, "profit": 0.0, "orders": 0}
        stats[day]["total"] += float(order.total_amount or 0)
        
        order_cost = sum(float(item.cost_price or 0) * item.quantity for item in order.items)
        stats[day]["profit"] += float(order.total_amount or 0) - order_cost
        
        stats[day]["orders"] += 1

    return [stats[k] for k in sorted(stats.keys())]

def _get_monthly_totals(daily_stats):
    monthly = {}
    for item in daily_stats:
        month_key = item["date"][:7]
        if month_key not in monthly:
            monthly[month_key] = {"month": month_key, "amount": 0.0, "profit": 0.0}
        monthly[month_key]["amount"] += float(item["total"])
        monthly[month_key]["profit"] += float(item.get("profit", 0.0))
    result = [monthly[k] for k in sorted(monthly.keys())]
    for item in result:
        year, month = item["month"].split("-")
        label = datetime(int(year), int(month), 1).strftime("%b %Y")
        item["label"] = label
    return result

def _load_prophet_model():
    try:
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'salesForecastingModel', 'sales_model.json')
        if not os.path.exists(model_path):
            return None
        with open(model_path, 'r') as fin:
            model = model_from_json(json.load(fin))
        return model
    except Exception as e:
        print(f"Failed to load pre-trained generic model: {e}")
        return None

def _linear_forecast(daily_stats, days):
    if not daily_stats or days <= 0:
        return {"history": daily_stats or [], "forecast": []}

    try:
        model = _load_prophet_model()
        if model:
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            forecast_results = []
            recent_forecast = forecast.tail(days)
            last_date = datetime.fromisoformat(daily_stats[-1]["date"]).date()
            
            for i, (_, row) in enumerate(recent_forecast.iterrows()):
                predicted = max(0.0, float(row['yhat']))
                lower = max(0.0, float(row['yhat_lower']))
                upper = max(0.0, float(row['yhat_upper']))
                forecast_date = (last_date + timedelta(days=i + 1)).isoformat()
                forecast_results.append({
                    "date": forecast_date,
                    "predicted": round(predicted, 2),
                    "lower": round(lower, 2),
                    "upper": round(upper, 2),
                })
            return {"history": daily_stats, "forecast": forecast_results}
    except Exception as e:
        print(f"Prophet linear inference failed: {e}")

    # Fallback arithmetic average
    values = [float(item["total"]) for item in daily_stats]
    n = len(values)
    if n == 1:
        slope = 0.0
        intercept = values[0]
        residual_std = 0.0
    else:
        mean_x = (n - 1) / 2
        mean_y = sum(values) / n
        denom = sum((i - mean_x) ** 2 for i in range(n))
        slope = sum((i - mean_x) * (values[i] - mean_y) for i in range(n)) / denom if denom else 0.0
        intercept = mean_y - slope * mean_x
        residuals = [values[i] - (intercept + slope * i) for i in range(n)]
        residual_std = (sum(r ** 2 for r in residuals) / max(n, 1)) ** 0.5

    last_date = datetime.fromisoformat(daily_stats[-1]["date"]).date()
    forecast = []
    for i in range(days):
        idx = n + i
        predicted = max(0.0, intercept + slope * idx)
        spread = max(residual_std * 1.96, predicted * 0.1)
        lower = max(0.0, predicted - spread)
        upper = max(0.0, predicted + spread)
        forecast_date = (last_date + timedelta(days=i + 1)).isoformat()
        forecast.append({
            "date": forecast_date,
            "predicted": round(predicted, 2),
            "lower": round(lower, 2),
            "upper": round(upper, 2),
        })
    return {"history": daily_stats, "forecast": forecast}

def _monthly_forecast(daily_stats, months):
    if not daily_stats or months <= 0:
        return []
    monthly_actuals = _get_monthly_totals(daily_stats)
    if not monthly_actuals:
        return []
    last_month_key = monthly_actuals[-1]["month"]
    last_year, last_month = map(int, last_month_key.split("-"))

    def _advance_month(year, month):
        month += 1
        if month > 12:
            month = 1
            year += 1
        return year, month

    try:
        model = _load_prophet_model()
        if model:
            days_to_predict = months * 31
            future = model.make_future_dataframe(periods=days_to_predict)
            forecast = model.predict(future)
            result = []
            year, month = last_year, last_month
            for _ in range(months):
                year, month = _advance_month(year, month)
                month_str = f"{year:04d}-{month:02d}"
                mask = (forecast['ds'].dt.year == year) & (forecast['ds'].dt.month == month)
                month_data = forecast.loc[mask]
                amount = max(0.0, float(month_data['yhat'].sum()))
                label = datetime(year, month, 1).strftime("%b %Y")
                result.append({"month": month_str, "label": label, "amount": round(amount, 2)})
            return result
    except Exception as e:
        print(f"Prophet monthly inference failed: {e}")

    recent = monthly_actuals[-6:]
    daily_values = [float(item["total"]) for item in daily_stats]

    def _weighted_baseline(values):
        if not values: return 0.0
        if len(values) == 1: return values[0]
        if len(values) == 2: return values[0] * 0.4 + values[1] * 0.6
        return values[-3] * 0.2 + values[-2] * 0.3 + values[-1] * 0.5

    if len(recent) < 2:
        window = daily_values[-30:] if daily_values else [0.0]
        avg_daily = sum(window) / max(len(window), 1)
        result = []
        year, month = last_year, last_month
        for _ in range(months):
            year, month = _advance_month(year, month)
            days_in_month = monthrange(year, month)[1]
            amount = max(0.0, avg_daily * days_in_month)
            label = datetime(year, month, 1).strftime("%b %Y")
            result.append({"month": f"{year:04d}-{month:02d}", "label": label, "amount": round(amount, 2)})
        return result

    baseline = _weighted_baseline([m["amount"] for m in recent])
    trend = (recent[-1]["amount"] - recent[0]["amount"]) / max(len(recent) - 1, 1)
    max_step = baseline * 0.15 if baseline > 0 else 0.0
    if max_step > 0:
        trend = max(-max_step, min(max_step, trend))
    else:
        trend = 0.0

    result = []
    year, month = last_year, last_month
    for i in range(1, months + 1):
        year, month = _advance_month(year, month)
        projected = baseline + trend * i
        projected = projected * 0.7 + baseline * 0.3
        projected = max(0.0, projected)
        label = datetime(year, month, 1).strftime("%b %Y")
        result.append({"month": f"{year:04d}-{month:02d}", "label": label, "amount": round(projected, 2)})
    return result

@router.post("/analytics/train-model")
async def trigger_model_training(background_tasks: BackgroundTasks):
    """Triggers the advanced FB Prophet forecasting training asynchronously."""
    background_tasks.add_task(train_prophet_model)
    return {"message": "Background model training started. This process takes a few moments."}

@router.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    total_products = db.query(models.Products).count()
    total_orders = db.query(models.Order).count()
    total_users = db.query(models.User).count()
    total_revenue = db.query(func.sum(models.Order.total_amount)).scalar() or 0
    total_revenue = float(total_revenue)
    
    total_cost = db.query(func.sum(models.OrderItem.cost_price * models.OrderItem.quantity)).scalar() or 0
    total_profit = total_revenue - float(total_cost)

    avg_order_value = float(total_revenue / total_orders) if total_orders else 0.0
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_revenue": round(total_revenue, 2),
        "total_profit": round(total_profit, 2),
        "avg_order_value": round(avg_order_value, 2),
    }

@router.get("/analytics/monthly-revenue")
def analytics_monthly_revenue(db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _get_monthly_totals(daily_stats)

@router.get("/analytics/daily-sales")
def analytics_daily_sales(days: Optional[int] = None, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    if days is not None and days > 0:
        daily_stats = daily_stats[-days:]
    return daily_stats

@router.get("/analytics/top-products")
def analytics_top_products(limit: int = 5, db: Session = Depends(get_db)):
    query = (
        db.query(
            models.OrderItem.product_id,
            models.Products.name.label("name"),
            func.sum(models.OrderItem.quantity).label("quantity"),
            func.sum(models.OrderItem.price * models.OrderItem.quantity).label("revenue"),
            func.sum((models.OrderItem.price - models.OrderItem.cost_price) * models.OrderItem.quantity).label("profit")
        )
        .join(models.Products, models.Products.id == models.OrderItem.product_id)
        .group_by(models.OrderItem.product_id, models.Products.name)
        .order_by(desc("revenue"))
        .limit(limit)
    )
    results = []
    for row in query.all():
        results.append({
            "product_id": row.product_id,
            "name": row.name,
            "quantity": int(row.quantity or 0),
            "revenue": float(row.revenue or 0),
            "profit": float(row.profit or 0),
        })
    return results

@router.get("/analytics/forecast")
def analytics_forecast(days: int = 30, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _linear_forecast(daily_stats, days)

@router.get("/analytics/forecast-monthly")
def analytics_forecast_monthly(months: int = 6, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _monthly_forecast(daily_stats, months)

@router.get("/analytics/export-csv")
def export_sales_csv(db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Total Revenue (LKR)", "Number of Orders"])
    for stat in daily_stats:
        writer.writerow([stat["date"], stat["total"], stat["orders"]])
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sales_report.csv"}
    )
