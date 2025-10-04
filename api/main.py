# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_app import router as data_router
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

app.include_router(data_router, prefix="/api/data")
app.include_router(forecast_router, prefix="/api/forecast")