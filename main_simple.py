from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Create FastAPI application
app = FastAPI(
    title="MakrCave Backend API",
    description="Backend API for MakrCave Inventory Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
allowed_origins = [
    "http://localhost:3001",
    "http://localhost:5000",
    "https://makrcave.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "makrcave-backend"}

@app.get("/api/stats")
async def get_stats():
    return {
        "locations": 15,
        "countries": 8,
        "makers": 1200,
        "activeProjects": 89
    }

@app.get("/api/locations/featured")
async def get_featured_locations():
    return [
        {
            "name": "TechLab Berlin",
            "description": "Modern fabrication facility with advanced 3D printing and laser cutting equipment",
            "location": "Berlin, Germany",
            "image": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400",
            "equipment": ["3D Printers", "Laser Cutter", "CNC Mill"],
            "rating": 4.8
        },
        {
            "name": "MakerSpace Tokyo",
            "description": "Community-driven workspace with traditional and digital fabrication tools",
            "location": "Tokyo, Japan", 
            "image": "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400",
            "equipment": ["Woodworking", "Electronics Lab", "Pottery Wheel"],
            "rating": 4.9
        }
    ]

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)