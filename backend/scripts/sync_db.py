import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base
from app.models.user import User
from app.models.mentorship import MentorAssignment, MentorshipSession, MentorshipTask, TaskSubmission, CollaborativeSession
from app.models.payment import Transaction

async def main():
    async with engine.begin() as conn:
        print(f"Current tables in metadata: {Base.metadata.tables.keys()}")
        print("Running create_all...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done create_all.")
        
    async with engine.connect() as conn:
        from sqlalchemy import inspect
        def get_tables(connection):
            return inspect(connection).get_table_names()
        
        tables = await conn.run_sync(get_tables)
        print(f"Tables actually in DB: {tables}")

if __name__ == "__main__":
    asyncio.run(main())
