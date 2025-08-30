from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import sys

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import api_router

# Create FastAPI application
app = FastAPI(
    title="MakrCave Backend API",
    description="Backend API for MakrCave Inventory Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration - Secure origins only
allowed_origins = [
    "https://makrx.org",
    "https://makrcave.com",
    "https://makrx.store",
]

# Add environment-specific origins
if os.getenv("ENVIRONMENT") == "development":
    allowed_origins.extend([
        "http://localhost:5173",  # Gateway (development)
        "http://localhost:5174",  # MakrCave (development)
        "http://localhost:5175",  # Store (development)
        "http://gateway-frontend:5173",
        "http://makrcave-frontend:5174",
        "http://makrx-store-frontend:5175",
        "*",  # Allow all origins in development for Replit compatibility
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRF-Token"
    ],
)

# Security middleware and error handling temporarily disabled for initial setup

# Global exception handler (fallback)
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "server_error"}
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "makrcave-backend"}

# Include routers
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "MakrCave Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )
