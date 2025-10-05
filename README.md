# F-Air 🌤️ Air Quality Forecasting App

**NASA Space Apps Challenge 2025** - Predicting Cleaner, Safer Skies

## 🚀 Overview

F-Air is a web application that forecasts air quality by integrating NASA TEMPO satellite data with ground-based measurements and weather data. The app helps people limit exposure to unhealthy air pollution levels by providing local air quality predictions and timely alerts.

## 🌟 Features

- **Real-time Air Quality Data**: Integration with NASA TEMPO and OpenAQ
- **5-Day Air Quality Forecast**: Machine learning predictions
- **Health-Focused Recommendations**: Personalized advice for different user profiles
- **Global Coverage**: TEMPO data for North America, global patterns elsewhere
- **Beautiful Visualizations**: Interactive maps and clear data displays

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Leaflet Maps
- Vite

**Backend:**
- FastAPI (Python)
- NASA TEMPO Data
- OpenAQ API
- Machine Learning Forecasting

## 🚀 Quick Start

### Backend
```bash
cd api
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Test the app locally
uvicorn data_app:app --host 0.0.0.0 --port 8000 --reload
uvicorn forecast_app:app --host 0.0.0.0 --port 8001 --reload
```
### Frontend
```bash
cd frontend
npm install
npm start
```
### 🌍 Data Sources
NASA TEMPO: Nitrogen dioxide (NO₂) satellite data

OpenAQ: Ground-based PM2.5 measurements

Meteomatics: Weather data integration

### 📱 Deployment
Backend: Deployed on Railway

Frontend: Deployed on Vercel

### 👥 Team
Created for NASA Space Apps Challenge 2024

### 📄 License
MIT License

