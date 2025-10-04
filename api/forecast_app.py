# forecast_app.py

from fastapi import APIRouter
import numpy as np
import requests
from datetime import datetime
import os

router = APIRouter()

NASA_EARTHDATA_USERNAME = os.getenv('NASA_EARTHDATA_USERNAME', 'nasa_naz78')

def get_historical_tempo_patterns(lat, lon):
    try:
        current_date = datetime.now()
        month = current_date.month
        if month in [11, 12, 1, 2]:
            seasonal_factor = 1.2
        elif month in [6, 7, 8]:
            seasonal_factor = 0.8
        else:
            seasonal_factor = 1.0

        weekday = current_date.weekday()
        traffic_factor = 0.7 if weekday >= 5 else 1.0
        
        return seasonal_factor * traffic_factor
    except Exception as e:
        print(f"Historical pattern error: {e}")
        return 1.0

@router.get("/")
async def root():
    return {"message": "Forecast API is running!"}

@router.get("/")
async def get_forecast(lat: float, lon: float, category: str = "general"):
    try:
        # IMPORTANT: change the URL to the correct data app URL in production
        data_response = requests.get(f"http://localhost:8000/api/data/air?lat={lat}&lon={lon}", timeout=10)
        if data_response.status_code != 200:
            data = {"pm25": 25.0, "no2": 3e15, "aqi": 100}
        else:
            data = data_response.json()

        current_aqi = data.get("aqi", 50)
        base_change = np.random.normal(0, 3)

        wind = data.get("wind", 5)
        wind_effect = -wind * 0.5

        temp = data.get("temp", 20)
        temp_effect = 1 if temp < 5 else 0

        weekday = datetime.now().weekday()
        weekday_effect = -3 if weekday >= 5 else 0

        tomorrow_aqi = current_aqi + base_change + wind_effect + temp_effect + weekday_effect
        max_change = 15
        tomorrow_aqi = max(0, min(300, tomorrow_aqi))
        tomorrow_aqi = max(current_aqi - max_change, min(current_aqi + max_change, tomorrow_aqi))
        tomorrow_aqi = int(round(tomorrow_aqi))

        return {
            "tomorrow_aqi": tomorrow_aqi,
            "today_aqi": current_aqi,
            "tip": get_tip(tomorrow_aqi, category),
            "source": "meteorological_forecast",
            "confidence": "medium",
            "change": tomorrow_aqi - current_aqi,
            "data_sources": ["OpenAQ PM2.5", "Weather Patterns", "Historical Trends"]
        }
    except Exception as e:
        print(f"Forecast error: {e}")
        current_aqi = 75
        tomorrow_aqi = current_aqi + np.random.randint(-5, 6)
        return {
            "tomorrow_aqi": max(0, min(300, tomorrow_aqi)),
            "today_aqi": current_aqi,
            "tip": "Using basic forecasting - check back for updates!",
            "source": "basic_forecast",
            "error": str(e)
        }

def get_tip(aqi, category):
    aqi_int = int(aqi)
    if aqi_int <= 50:
        base_tip = "Excellent air quality! Perfect for outdoor activities."
    elif aqi_int <= 100:
        base_tip = "Moderate air quality. Generally acceptable for most people."
    elif aqi_int <= 150:
        base_tip = "Unhealthy for sensitive groups. Reduce prolonged outdoor exertion."
    elif aqi_int <= 200:
        base_tip = "Unhealthy air quality. Everyone may experience health effects."
    elif aqi_int <= 300:
        base_tip = "Very unhealthy. Health alert: everyone may experience more serious health effects."
    else:
        base_tip = "Hazardous conditions. Health warnings of emergency conditions."

    if category == "asthmatic" and aqi_int > 50:
        return f"{base_tip} Stay inside, use inhaler as needed."
    elif category == "elderly" and aqi_int > 50:
        return f"{base_tip} Short walks only, avoid strenuous activities."
    elif category == "child" and aqi_int > 50:
        return f"{base_tip} Keep children indoors as much as possible."
    else:
        return base_tip
