# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_app import app as data_app
from forecast_app import router as forecast_router

app = FastAPI(title="F-Air Combined API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://f-air-air-quality-app-ctfq.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the /api/data app
app.mount("/api/data", data_app)

# Include the forecast router under /api/forecast
app.include_router(forecast_router, prefix="/api/forecast")
