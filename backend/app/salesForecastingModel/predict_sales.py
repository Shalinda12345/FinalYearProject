import pandas as pd
from prophet.serialize import model_from_json
import json
import matplotlib.pyplot as plt

def generate_forecast(days_to_predict=30):
    # --- 1. LOAD MODEL ---
    print("Loading saved model...")
    try:
        with open('sales_model.json', 'r') as fin:
            model = model_from_json(json.load(fin))
    except FileNotFoundError:
        print("Error: Model file not found. Run 'train_model.py' first.")
        return

    # --- 2. FORECAST ---
    print(f"Generating forecast for the next {days_to_predict} days...")
    future = model.make_future_dataframe(periods=days_to_predict)
    forecast = model.predict(future)

    # --- 3. DISPLAY RESULTS ---
    print("\nForecast Snapshot (Next 5 Days):")
    # yhat = predicted value, yhat_lower/upper = uncertainty interval
    print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30))

    # --- 4. VISUALIZE ---
    model.plot(forecast)
    plt.title(f"Sales Forecast ({days_to_predict} Days Ahead)")
    plt.xlabel("Date")
    plt.ylabel("Predicted Sales")
    plt.show()

if __name__ == "__main__":
    # You can change 30 to however many days you need
    generate_forecast(days_to_predict=30)