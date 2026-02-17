import asyncio
from sqlalchemy import text
from app.core.database import engine

async def check_db():
    async with engine.connect() as conn:
        db_name = await conn.execute(text("SELECT current_database()"))
        print(f"Current Database: {db_name.scalar()}")
        
        tables = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        print(f"Tables: {[row[0] for row in tables]}")

if __name__ == "__main__":
    asyncio.run(check_db())
