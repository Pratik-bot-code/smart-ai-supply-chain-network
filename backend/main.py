# ==============================================================================
# Smart AI Supply Chain Network - FastAPI Backend Application
# ==============================================================================

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import APP_NAME, CORS_ORIGINS, PORT
from database import init_db
from seed_data import seed_database
from routers import (
    dashboard_router,
    products_router,
    orders_router,
    suppliers_router,
    forecasting_router,
    risks_router,
    recommendations_router,
    agents_router,
    data_import_router,
    auth_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle hook: ensure database tables exist and are seeded on startup."""
    print(f"Initializing {APP_NAME} database...")
    init_db()
    seed_database(force=False)
    print("Database ready.")
    yield
    print("Shutting down application...")

app = FastAPI(
    title=APP_NAME,
    description="Autonomous AI-Based Supply Chain Management System with specialized multi-agent coordination.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
    )

# Mount all feature routers
app.include_router(dashboard_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(suppliers_router)
app.include_router(forecasting_router)
app.include_router(risks_router)
app.include_router(recommendations_router)
app.include_router(agents_router)
app.include_router(data_import_router)
app.include_router(auth_router)

# Root & Health Check Endpoints
@app.get("/", tags=["Health"])
def root():
    return {
        "system": APP_NAME,
        "status": "Online",
        "version": "1.0.0",
        "agents": 5,
        "apiDocs": "/docs"
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite_connected",
        "agentSwarm": "operational",
        "timestamp": os.getenv("APP_ENV", "development")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
