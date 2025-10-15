from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import Base, engine
from backend.routers import tasks, preferences, chat, settings as settings_router, activity

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Personal AI Assistant Backend with multi-model support",
    version="1.0.0"
)

# Configure CORS - allow all origins for Replit environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router)
app.include_router(preferences.router)
app.include_router(chat.router)
app.include_router(settings_router.router)
app.include_router(activity.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Assistant API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
