"""Unified API router with basic routes for Replit migration."""

from fastapi import APIRouter

api_router = APIRouter()

# Basic health endpoint included in main.py
# Other routes commented out temporarily for migration compatibility

# TODO: Re-enable routes after fixing import issues
# from .analytics import router as analytics_router
# from .announcements import router as announcements_router
# ... other imports

@api_router.get("/api/v1/status")
async def api_status():
    """Basic API status endpoint"""
    return {"status": "API is running", "message": "MakrCave Backend API"}