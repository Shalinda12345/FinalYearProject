import os
import json
import logging
import pandas as pd
from app.models import Order

try:
    from prophet import Prophet
    from prophet.serialize import model_to_json
except ImportError:
    pass

def train_prophet_model():
    from app.api.deps import get_db
    try:
        db = next(get_db())
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'salesForecastingModel', 'sales_data.csv')
        hist_df = pd.read_csv(csv_path)
        hist_df['ds'] = pd.to_datetime(
            hist_df['Year'].astype(str) + '-' + hist_df['Month Name'] + '-' + hist_df['Date'].astype(str), 
            format='%Y-%B-%d'
        )
        hist_df['y'] = hist_df['Sales']
        hist_df = hist_df[['ds', 'y']]
        
        live_df = pd.DataFrame()
        orders = db.query(Order).order_by(Order.created_at).all()
        stats = {}
        for order in orders:
            if not order.created_at:
                continue
            day = order.created_at.date().isoformat()
            if day not in stats:
                stats[day] = {"date": day, "total": 0.0}
            stats[day]["total"] += float(order.total_amount or 0)
            
        if stats:
            live_df = pd.DataFrame([{"date": k, "total": v["total"]} for k, v in stats.items()])
            live_df['ds'] = pd.to_datetime(live_df['date'])
            live_df['y'] = live_df['total']
            live_df = live_df[['ds', 'y']]
    finally:
        db.close()
        
    try:
        if not live_df.empty:
            combined_df = pd.concat([hist_df, live_df]).sort_values('ds').drop_duplicates('ds', keep='last')
        else:
            combined_df = hist_df

        logger = logging.getLogger('cmdstanpy')
        logger.addHandler(logging.NullHandler())
        logger.propagate = False
        logger.setLevel(logging.CRITICAL)

        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )
        model.add_country_holidays(country_name='LK')
        
        model.fit(combined_df)
        
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'salesForecastingModel', 'sales_model.json')
        with open(model_path, 'w') as fout:
            json.dump(model_to_json(model), fout)
        
        print("Background Process: Successfully retrained and saved latest Prophet model!")
    except Exception as e:
        print(f"Error during background model training: {e}")
