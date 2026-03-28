import pandas as pd
from prophet import Prophet
from prophet.serialize import model_to_json
import json

def train_and_save():
    # --- 1. LOAD & PREPROCESS ---
    print("Step 1: Loading data...")
    try:
        df = pd.read_csv('sales_data.csv')
    except FileNotFoundError:
        print("Error: 'sales_data.csv' not found.")
        return

    # Combine columns into a date string and convert to datetime
    df['ds'] = pd.to_datetime(
        df['Year'].astype(str) + '-' + 
        df['Month Name'] + '-' + 
        df['Date'].astype(str), 
        format='%Y-%B-%d'
    )
    df['y'] = df['Sales']
    
    # --- 2. TRAIN ---
    print("Step 2: Training the model (this may take a moment)...")
    model = Prophet(daily_seasonality=False)
    model.add_country_holidays(country_name='LK') # Sri Lanka holidays
    model.fit(df)

    # --- 3. SAVE THE MODEL ---
    print("Step 3: Saving the model to 'sales_model.json'...")
    with open('sales_model.json', 'w') as fout:
        # Save the model structure and weights to a JSON file
        json.dump(model_to_json(model), fout)
    
    print("Success! Model trained and saved.")

if __name__ == "__main__":
    train_and_save()