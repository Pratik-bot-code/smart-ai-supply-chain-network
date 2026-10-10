import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present in backend directory
ENV_FILE = Path(__file__).parent / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    # Also check parent directory
    load_dotenv(Path(__file__).parent.parent / ".env")

APP_NAME = os.getenv("APP_NAME", "Smart AI Supply Chain Network")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

CORS_ORIGINS_RAW = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:8000,http://127.0.0.1:8000"
)
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite")
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "supply_chain.db")

MIN_HISTORICAL_DAYS_FOR_FORECAST = int(os.getenv("MIN_HISTORICAL_DAYS_FOR_FORECAST", 14))
DEMO_DATA_TAG = "DEMO DATA (Simulated for Evaluation)"
