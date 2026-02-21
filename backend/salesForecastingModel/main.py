# import pandas as pd
# from prophet import Prophet
# import matplotlib.pyplot as plt

# def run_sales_forecast():
#     # --- 1. LOAD THE DATA ---
#     print("Loading data from sales_data.csv...")
#     try:
#         df = pd.read_csv('sales_data.csv')
#     except FileNotFoundError:
#         print("Error: 'sales_data.csv' not found. Please create the file first.")
#         return

#     # --- 2. PREPROCESS DATA ---
#     # Prophet needs a column called 'ds' (Date) and 'y' (Value)
    
#     # Create a string representation of the date (e.g., "2024-January-1")
#     # We combine columns: Year + Month Name + Date
#     df['date_str'] = (
#         df['Year'].astype(str) + '-' + 
#         df['Month Name'] + '-' + 
#         df['Date'].astype(str)
#     )
    
#     # Convert that string into a proper datetime object
#     df['ds'] = pd.to_datetime(df['date_str'], format='%Y-%B-%d')
    
#     # Rename your 'Sales' column to 'y' for     Prophet
#     df['y'] = df['Sales']
    
#     # Select only the columns Prophet needs
#     clean_df = df[['ds', 'y']]

#     print("Data loaded successfully. First 5 rows:")
#     print(clean_df.head())

#     # --- 3. TRAIN THE MODEL ---
#     print("Training the Prophet model...")
#     # We disable daily_seasonality because we don't have hourly data
#     model = Prophet(daily_seasonality=False)
    
#     # Add Sri Lanka holidays (Great for your specific project context)
#     model.add_country_holidays(country_name='LK')
    
#     model.fit(clean_df)

#     # --- 4. FORECAST ---
#     print("Forecasting future sales...")
#     # Create a dataframe for the next 30 days
#     future = model.make_future_dataframe(periods=30)
    
#     # Predict
#     forecast = model.predict(future)

#     # Display the prediction for the next 5 days
#     print("\nForecast for next 5 days:")
#     print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

#     # --- 5. VISUALIZE ---
#     # Plot the main forecast
#     plt.figure(figsize=(10, 6))
#     model.plot(forecast)
#     plt.title("Sales Forecast based on CSV Data")
#     plt.xlabel("Date")
#     plt.ylabel("Sales")
#     plt.show()

#     # Plot the components (Trend, Weekly patterns)
#     model.plot_components(forecast)
#     plt.show()

# if __name__ == "__main__":
#     run_sales_forecast()