from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from database import close_db, db
from routes import products, categories, blog, projects, orders, contact, admin_auth, admin_dashboard, admin_products, admin_orders, admin_contacts, payment
import seed_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="YZR Yangın API", version="1.0.0")

# Include routers
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(blog.router)
app.include_router(projects.router)
app.include_router(orders.router)
app.include_router(contact.router)

# Admin routers
app.include_router(admin_auth.router)
app.include_router(admin_dashboard.router)
app.include_router(admin_products.router)
app.include_router(admin_orders.router)
app.include_router(admin_contacts.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database with seed data on startup"""
    logger.info("Starting application...")
    
    # Check if database is empty and seed if needed
    try:
        product_count = await db.products.count_documents({})
        
        if product_count == 0:
            logger.info("Database is empty. Seeding initial data...")
            
            # Seed categories
            await db.categories.insert_many(seed_data.categories)
            logger.info(f"Seeded {len(seed_data.categories)} categories")
            
            # Seed products
            await db.products.insert_many(seed_data.products)
            logger.info(f"Seeded {len(seed_data.products)} products")
            
            # Seed blog posts
            await db.blog.insert_many(seed_data.blog_posts)
            logger.info(f"Seeded {len(seed_data.blog_posts)} blog posts")
            
            # Seed projects
            await db.projects.insert_many(seed_data.projects)
            logger.info(f"Seeded {len(seed_data.projects)} projects")
            
            logger.info("Database seeding completed successfully!")
        else:
            logger.info(f"Database already has {product_count} products. Skipping seed.")
            
    except Exception as e:
        logger.error(f"Error during database seeding: {e}")

@app.get("/api")
async def root():
    return {
        "message": "YZR Yangın API",
        "version": "1.0.0",
        "status": "active"
    }

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    logger.info("Application shutdown complete")