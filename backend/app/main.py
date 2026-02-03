"""FastAPI main application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import get_settings
from .routes import auth, sos, dashboard, videos, collective
from .services.cache_service import is_cache_available

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"🚀 Starting {settings.app_name}")
    print(f"📦 Redis available: {is_cache_available()}")
    print(f"🔑 Gemini configured: {bool(settings.gemini_api_key)}")
    print(f"🎬 YouTube configured: {bool(settings.youtube_api_key)}")
    yield
    # Shutdown
    print(f"👋 Shutting down {settings.app_name}")


app = FastAPI(
    title="SAHAYAK AI API",
    description="Just-In-Time Classroom Coaching Engine for Indian Government School Teachers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(sos.router)
app.include_router(dashboard.router)
app.include_router(videos.router)
app.include_router(collective.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "SAHAYAK AI",
        "version": "1.0.0",
        "description": "Just-In-Time Classroom Coaching Engine",
        "status": "running",
        "features": {
            "redis_cache": is_cache_available(),
            "ai_enabled": bool(settings.gemini_api_key),
            "video_search": bool(settings.youtube_api_key)
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "redis": is_cache_available(),
        "gemini": bool(settings.gemini_api_key)
    }
