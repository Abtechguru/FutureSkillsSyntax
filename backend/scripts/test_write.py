import asyncio
from sqlalchemy import text
from app.core.database import engine

async def test_write():
    async with engine.begin() as conn:
        print("Creating table 'test_antigravity'...")
        await conn.execute(text("CREATE TABLE IF NOT EXISTS test_antigravity (id int, name text);"))
        await conn.execute(text("INSERT INTO test_antigravity VALUES (1, 'antigravity');"))
        print("Table created and row inserted.")

async def verify_write():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT * FROM test_antigravity;"))
        rows = res.all()
        print(f"Verified rows: {rows}")

if __name__ == "__main__":
    asyncio.run(test_write())
    asyncio.run(verify_write())
