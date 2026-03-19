# main.py
from typing import Optional
from datetime import datetime, timedelta
from calendar import monthrange
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from passlib.context import CryptContext
import models, database, schemas # Import schemas here

# 1. Create the database tables automatically if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# UPDATE THIS SECTION
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # OR use ["*"] to allow everything for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. Use Pydantic Schema (schemas.UserCreate) instead of dict
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # ORM Query: Check if user exists
    user_exists = db.query(models.User).filter(models.User.email == user.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = pwd_context.hash(user.password)
    
    # ORM Add: Create new user instance
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # Refreshes the instance with new data (like ID)
    
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # ORM Query
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful", "id": db_user.id, "username": db_user.username, "email": db_user.email}


@app.post("/admin/login")
def admin_login(admin: schemas.AdminLogin, db: Session = Depends(get_db)):
    # Look in the AdminUser table, NOT the User table
    db_admin = db.query(models.AdminUsers).filter(models.AdminUsers.username == admin.username).first()

    # Verify password
    if not db_admin or not pwd_context.verify(admin.password, db_admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Admin Credentials")
    
    return {"message": "Admin Login successful", "admin_user": db_admin.username}


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).all()
    return [schemas.ProductResponse.model_validate(p) for p in products]


@app.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Products(
        name=product.name,
        description=product.description,
        price=product.price,
        image_url=product.image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created successfully", "product": new_product}


@app.put("/products/{product_id}")
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update fields
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.image_url = product.image_url

    db.commit()
    db.refresh(db_product)

    return {"message": "Product updated successfully", "product": schemas.ProductResponse.model_validate(db_product)}

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

# Fallback in-memory cart used when DB is unavailable (useful for local dev)
cart_fallback = []


@app.post("/cart")
def add_to_cart(cart_item: schemas.CartItems, db: Session = Depends(get_db)):
    try:
        # Check if the product already exists in the cart for the same user; if so, increment its quantity
        existing = db.query(models.CartItems).filter(
            models.CartItems.product_id == cart_item.product_id,
            models.CartItems.user_id == cart_item.user_id,
        ).first()
        if existing:
            # increment by 1 when adding the same item again
            existing.quantity = (existing.quantity or 0) + 1
            db.commit()
            db.refresh(existing)
            return {"message": "Item quantity updated", "cart_item": {"product_id": existing.product_id, "quantity": existing.quantity, "id": existing.id}}

        # Otherwise create a new cart item
        new_item = models.CartItems(
            user_id=cart_item.user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        # Return the created DB row (as plain dict)
        return {"message": "Item added to cart", "cart_item": {"product_id": new_item.product_id, "quantity": new_item.quantity, "id": new_item.id}}
    except Exception:
        # If DB insert fails, fall back to an in-memory cart so frontend still works
        # Make fallback store user-scoped items
        for item in cart_fallback:
            if item.get("product_id") == cart_item.product_id and item.get("user_id") == cart_item.user_id:
                item["quantity"] = (item.get("quantity", 0)) + 1
                return {"message": "Item quantity updated in fallback cart", "cart_item": item}

        cart_fallback.append({"user_id": cart_item.user_id, "product_id": cart_item.product_id, "quantity": cart_item.quantity})
        return {"message": "Item added to fallback cart", "cart_item": cart_fallback[-1]}

@app.get("/cart")
def get_cart(user_id: int | None = None, db: Session = Depends(get_db)):
    """Return cart items. If `user_id` is provided, return only that user's items.
    If DB is unavailable, return fallback items (optionally filtered by user_id)."""
    try:
        if user_id is not None:
            cart_items = db.query(models.CartItems).filter(models.CartItems.user_id == user_id).all()
        else:
            cart_items = db.query(models.CartItems).all()

        return [{"user": item.user_id, "product_id": item.product_id, "quantity": item.quantity, "id": item.id} for item in cart_items]
    except Exception:
        if user_id is None:
            return cart_fallback
        return [item for item in cart_fallback if item.get("user_id") == user_id]

@app.delete("/cart/remove/{product_id}")
def remove_from_cart(product_id: int, user_id: int | None = None, db: Session = Depends(get_db)):
    """Remove a product from a user's cart. If `user_id` provided, only remove for that user."""
    try:
        query = db.query(models.CartItems).filter(models.CartItems.product_id == product_id)
        if user_id is not None:
            query = query.filter(models.CartItems.user_id == user_id)

        deleted = query.delete()
        db.commit()
        return {"message": "Item removed from cart", "deleted": deleted}
    except Exception:
        global cart_fallback
        if user_id is None:
            cart_fallback = [item for item in cart_fallback if item["product_id"] != product_id]
        else:
            cart_fallback = [item for item in cart_fallback if not (item["product_id"] == product_id and item.get("user_id") == user_id)]
        return {"message": "Item removed from fallback cart"}


@app.put("/cart/{item_id}")
def update_cart_quantity(item_id: int, cart_item: schemas.CartItems, db: Session = Depends(get_db)):
    try:
        db_item = db.query(models.CartItems).filter(models.CartItems.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        # Ensure the operation is performed by the owner of the cart item
        if db_item.user_id != cart_item.user_id:
            raise HTTPException(status_code=403, detail="Cannot modify another user's cart item")
        
        db_item.quantity = cart_item.quantity
        db.commit()
        db.refresh(db_item)
        return {"message": "Quantity updated", "cart_item": {"product_id": db_item.product_id, "quantity": db_item.quantity, "id": db_item.id}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


@app.post("/orders")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    calculated_total = sum(item.price * item.quantity for item in order.items)

    # 2. Create the Order Header
    new_order = models.Order(
        user_id=order.user_id,
        total_amount=calculated_total
    )
    
    # 3. Add items to the order object (SQLAlchemy handles the keys automatically)
    for item in order.items:
        new_item = models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        new_order.items.append(new_item)

    # 4. Save everything in ONE transaction
    try:
        db.add(new_order)
        db.commit()      # This pushes the Order AND all OrderItems to DB
        db.refresh(new_order)

        # Clear cart for the user after successful order placement
        db.query(models.CartItems).filter(models.CartItems.user_id == order.user_id).delete()
        db.commit()

        return {"status": "success", "order_id": new_order.id, "total": calculated_total}
    except Exception as e:
        db.rollback()    # If anything fails, undo everything
        raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/orders")
# def get_orders(db: Session = Depends(get_db)):
#     orders = db.query(models.Order).all()
#     return [schemas.OrderItem.model_validate(o) for o in orders]

# @app.get("/api/activities")
# async def get_activities():
#     # Simulate fetching a different dataset
#     return [
#         {"id": 1, "action": "New client 'Acme Corp' added", "timestamp": "2023-10-24 10:30"},
#         {"id": 2, "action": "Project 'Beta' marked complete", "timestamp": "2023-10-23 14:15"},
#         {"id": 3, "action": "Invoice #402 paid", "timestamp": "2023-10-22 09:00"},
#     ]


@app.get("/orders")
async def get_orders(user_id: int | None = None, db: Session = Depends(get_db)):
    # orders = db.query(models.Order).all()
    try:
        if user_id is not None:
            orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
        else:
            orders = db.query(models.Order).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": float(order.total_amount),
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": float(item.price)
                } for item in order.items
            ]
        } for order in orders
    ]

@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()
        return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            } for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _get_daily_stats(db: Session):
    orders = db.query(models.Order).order_by(models.Order.created_at).all()
    stats = {}
    for order in orders:
        if not order.created_at:
            continue
        day = order.created_at.date().isoformat()
        if day not in stats:
            stats[day] = {"date": day, "total": 0.0, "orders": 0}
        stats[day]["total"] += float(order.total_amount or 0)
        stats[day]["orders"] += 1
    return [stats[k] for k in sorted(stats.keys())]


def _get_monthly_totals(daily_stats):
    monthly = {}
    for item in daily_stats:
        month_key = item["date"][:7]  # YYYY-MM
        if month_key not in monthly:
            monthly[month_key] = {"month": month_key, "amount": 0.0}
        monthly[month_key]["amount"] += float(item["total"])
    result = [monthly[k] for k in sorted(monthly.keys())]
    # Add readable labels for frontend charts
    for item in result:
        year, month = item["month"].split("-")
        label = datetime(int(year), int(month), 1).strftime("%b %Y")
        item["label"] = label
    return result


def _linear_forecast(daily_stats, days):
    if not daily_stats or days <= 0:
        return {"history": daily_stats or [], "forecast": []}

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
        if denom == 0:
            slope = 0.0
        else:
            slope = sum((i - mean_x) * (values[i] - mean_y) for i in range(n)) / denom
        intercept = mean_y - slope * mean_x
        residuals = [values[i] - (intercept + slope * i) for i in range(n)]
        residual_std = (sum(r ** 2 for r in residuals) / max(n, 1)) ** 0.5

    last_date = datetime.fromisoformat(daily_stats[-1]["date"]).date()
    forecast = []
    for i in range(days):
        idx = n + i
        predicted = max(0.0, intercept + slope * idx)
        # Use residual spread or 10 percent of prediction as a safety band
        spread = max(residual_std * 1.96, predicted * 0.1)
        lower = max(0.0, predicted - spread)
        upper = max(0.0, predicted + spread)
        forecast_date = (last_date + timedelta(days=i + 1)).isoformat()
        forecast.append(
            {
                "date": forecast_date,
                "predicted": round(predicted, 2),
                "lower": round(lower, 2),
                "upper": round(upper, 2),
            }
        )
    return {"history": daily_stats, "forecast": forecast}


def _monthly_forecast(daily_stats, months):
    if not daily_stats or months <= 0:
        return []

    monthly_actuals = _get_monthly_totals(daily_stats)
    if not monthly_actuals:
        return []

    last_month_key = monthly_actuals[-1]["month"]
    last_year, last_month = map(int, last_month_key.split("-"))

    recent = monthly_actuals[-6:]
    daily_values = [float(item["total"]) for item in daily_stats]

    def _advance_month(year, month):
        month += 1
        if month > 12:
            month = 1
            year += 1
        return year, month

    def _weighted_baseline(values):
        if not values:
            return 0.0
        if len(values) == 1:
            return values[0]
        if len(values) == 2:
            return values[0] * 0.4 + values[1] * 0.6
        return values[-3] * 0.2 + values[-2] * 0.3 + values[-1] * 0.5

    # If history is too short, fall back to average daily sales.
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
            result.append(
                {
                    "month": f"{year:04d}-{month:02d}",
                    "label": label,
                    "amount": round(amount, 2),
                }
            )
        return result

    baseline = _weighted_baseline([m["amount"] for m in recent])
    trend = (recent[-1]["amount"] - recent[0]["amount"]) / max(len(recent) - 1, 1)

    # Cap month-over-month growth to keep forecasts realistic.
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
        # Damp spikes by blending back toward baseline.
        projected = projected * 0.7 + baseline * 0.3
        projected = max(0.0, projected)
        label = datetime(year, month, 1).strftime("%b %Y")
        result.append(
            {
                "month": f"{year:04d}-{month:02d}",
                "label": label,
                "amount": round(projected, 2),
            }
        )
    return result


@app.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    total_products = db.query(models.Products).count()
    total_orders = db.query(models.Order).count()
    total_users = db.query(models.User).count()
    total_revenue = db.query(func.sum(models.Order.total_amount)).scalar() or 0
    total_revenue = float(total_revenue)
    avg_order_value = float(total_revenue / total_orders) if total_orders else 0.0
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_revenue": round(total_revenue, 2),
        "avg_order_value": round(avg_order_value, 2),
    }


@app.get("/analytics/monthly-revenue")
def analytics_monthly_revenue(db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _get_monthly_totals(daily_stats)


@app.get("/analytics/daily-sales")
def analytics_daily_sales(days: Optional[int] = None, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    if days is not None and days > 0:
        daily_stats = daily_stats[-days:]
    return daily_stats


@app.get("/analytics/top-products")
def analytics_top_products(limit: int = 5, db: Session = Depends(get_db)):
    query = (
        db.query(
            models.OrderItem.product_id,
            models.Products.name.label("name"),
            func.sum(models.OrderItem.quantity).label("quantity"),
            func.sum(models.OrderItem.price * models.OrderItem.quantity).label("revenue"),
        )
        .join(models.Products, models.Products.id == models.OrderItem.product_id)
        .group_by(models.OrderItem.product_id, models.Products.name)
        .order_by(desc("revenue"))
        .limit(limit)
    )

    results = []
    for row in query.all():
        results.append(
            {
                "product_id": row.product_id,
                "name": row.name,
                "quantity": int(row.quantity or 0),
                "revenue": float(row.revenue or 0),
            }
        )
    return results


@app.get("/analytics/forecast")
def analytics_forecast(days: int = 30, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _linear_forecast(daily_stats, days)


@app.get("/analytics/forecast-monthly")
def analytics_forecast_monthly(months: int = 6, db: Session = Depends(get_db)):
    daily_stats = _get_daily_stats(db)
    return _monthly_forecast(daily_stats, months)
