"""
Add this code to your backend/app/main.py file to initialize MongoDB.

Add these imports at the top:
"""

from app.core.mongodb import connect_to_mongodb, close_mongodb_connection

"""
Then add these event handlers (usually after creating the FastAPI app):
"""

@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup."""
    # Connect to MongoDB for Goals system
    await connect_to_mongodb()
    logger.info("MongoDB connected - Goals system ready")
    logger.info("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Close connections on shutdown."""
    # Close MongoDB connection
    await close_mongodb_connection()
    logger.info("Application shutdown complete")

"""
That's it! MongoDB will now connect automatically when your app starts.
"""
