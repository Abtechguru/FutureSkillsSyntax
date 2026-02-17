"""MongoDB database connection and utilities."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# MongoDB client instance
mongodb_client: Optional[AsyncIOMotorClient] = None
mongodb_database: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongodb():
    """Connect to MongoDB."""
    global mongodb_client, mongodb_database
    
    try:
        # MongoDB connection string
        # Format: mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
        mongodb_uri = settings.MONGODB_URI
        
        logger.info("Connecting to MongoDB...")
        mongodb_client = AsyncIOMotorClient(
            mongodb_uri,
            maxPoolSize=10,
            minPoolSize=1,
            serverSelectionTimeoutMS=5000,
        )
        
        # Get database name from settings or use default
        db_name = settings.MONGODB_DB_NAME or "futureskills"
        mongodb_database = mongodb_client[db_name]
        
        # Test connection
        await mongodb_client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB database: {db_name}")
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongodb_connection():
    """Close MongoDB connection."""
    global mongodb_client
    
    if mongodb_client:
        logger.info("Closing MongoDB connection...")
        mongodb_client.close()
        logger.info("MongoDB connection closed")


def get_mongodb() -> AsyncIOMotorDatabase:
    """Get MongoDB database instance."""
    if mongodb_database is None:
        raise RuntimeError("MongoDB is not connected. Call connect_to_mongodb() first.")
    return mongodb_database


# Collection names
class Collections:
    """MongoDB collection names."""
    GOALS = "goals"
    MILESTONES = "milestones"
    HABITS = "habits"
    HABIT_COMPLETIONS = "habit_completions"
    CHECK_INS = "check_ins"
    METRICS = "metrics"
    METRIC_ENTRIES = "metric_entries"
    GOAL_SUPPORT = "goal_support"
