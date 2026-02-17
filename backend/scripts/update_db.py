import asyncio
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.core.database import engine, Base
from app.models.user import User
from app.models.mentorship import MentorAssignment, MentorshipSession, MentorshipTask, TaskSubmission, CollaborativeSession
from app.models.payment import Transaction

from app.core.config import settings
async def update_db():
    print(f"Updating database schema using: {settings.DATABASE_URL}")
    async with engine.begin() as conn:
        # Create new tables
        print(f"Registered tables: {list(Base.metadata.tables.keys())}")
        print("Creating new tables...")
        await conn.run_sync(Base.metadata.create_all)
        
        # Add new columns to existing tables if they don't exist
        print("Checking for missing columns...")
        
        # MentorshipSession.classroom_link
        try:
            await conn.execute(text("ALTER TABLE mentorship_sessions ADD COLUMN classroom_link VARCHAR(500)"))
            print("Added classroom_link to mentorship_sessions")
        except Exception as e:
            if "already exists" in str(e):
                print("classroom_link already exists in mentorship_sessions")
            else:
                print(f"Error adding classroom_link: {e}")

    print("Database update complete.")

if __name__ == "__main__":
    asyncio.run(update_db())
