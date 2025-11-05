from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
products_collection = db.products
categories_collection = db.categories
blog_collection = db.blog
projects_collection = db.projects
orders_collection = db.orders
contacts_collection = db.contacts

async def close_db():
    client.close()