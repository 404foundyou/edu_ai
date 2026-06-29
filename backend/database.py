# database.py
# Handles MongoDB connection using Motor (async MongoDB driver)
# Motor allows FastAPI to talk to MongoDB without blocking

from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DB_NAME

# Global database client
client: AsyncIOMotorClient = None
db = None

async def connect_db():
    """Connect to MongoDB Atlas"""
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    print(f"✅ Connected to MongoDB — database: {DB_NAME}")

async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    """Return database instance"""
    return db