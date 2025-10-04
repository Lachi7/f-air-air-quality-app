from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_app import app as data_app
from forecast_app import app as forecast_router

app = FastAPI(title="F-Air Combined API")

# Add CORS middleware once
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://f-air-air-quality-app-ctfq.vercel.app"],  # your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount data_app under /api/data
app.mount("/api/data", data_app)

# Include forecast router under /api/forecast
app.include_router(forecast_router, prefix="/api/forecast")
