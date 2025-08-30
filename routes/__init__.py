"""Unified API router with basic routes for MyTrial migration."""

from fastapi import APIRouter

api_router = APIRouter()

# Basic health endpoint included in main.py
# Other routes temporarily disabled during migration

@api_router.get("/api/v1/status")
async def api_status():
    """Basic API status endpoint"""
    return {"status": "API is running", "message": "MakrCave Backend API - MyTrial Migration"}

@api_router.get("/api/v1/health")
async def detailed_health():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "service": "makrcave-backend",
        "version": "1.0.0",
        "environment": "development"
    }