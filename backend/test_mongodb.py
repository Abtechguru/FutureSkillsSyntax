"""Test MongoDB connection and setup."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.mongodb import connect_to_mongodb, close_mongodb_connection, get_mongodb
from app.core.config import settings


async def test_connection():
    """Test MongoDB connection."""
    print("🧪 Testing MongoDB Connection...")
    print("=" * 50)
    
    try:
        # Test connection
        print("\n1️⃣ Connecting to MongoDB...")
        await connect_to_mongodb()
        print("✅ Successfully connected to MongoDB!")
        
        # Get database instance
        print("\n2️⃣ Getting database instance...")
        db = get_mongodb()
        print(f"✅ Database: {db.name}")
        
        # List collections
        print("\n3️⃣ Listing collections...")
        collections = await db.list_collection_names()
        if collections:
            print(f"✅ Found {len(collections)} collections:")
            for col in collections:
                print(f"   - {col}")
        else:
            print("ℹ️  No collections yet (this is normal for a new database)")
        
        # Test ping
        print("\n4️⃣ Testing database ping...")
        result = await db.command("ping")
        print(f"✅ Ping successful: {result}")
        
        print("\n" + "=" * 50)
        print("🎉 All tests passed! MongoDB is ready to use!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check your MongoDB password in .env file")
        print("2. Verify network access in MongoDB Atlas")
        print("3. Ensure your IP is whitelisted (or use 0.0.0.0/0 for testing)")
        print("4. Check your internet connection")
        return False
    
    finally:
        # Close connection
        print("\n5️⃣ Closing connection...")
        await close_mongodb_connection()
        print("✅ Connection closed")
    
    return True


if __name__ == "__main__":
    print(f"\n📊 MongoDB Configuration:")
    print(f"   Database: {settings.MONGODB_DB_NAME}")
    print(f"   URI: {settings.MONGODB_URI[:50]}..." if len(settings.MONGODB_URI) > 50 else settings.MONGODB_URI)
    
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
