from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

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
    "http://localhost:5000",  # Frontend dev
    "https://*.replit.dev",   # Replit domains
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

# Basic API endpoints
@app.get("/api/v1/test")
async def test_endpoint():
    return {"message": "API is working", "status": "success"}