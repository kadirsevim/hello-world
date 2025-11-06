from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from database import close_db_pool, init_database
from routes import products, categories, blog, projects, orders, contact, admin_auth, admin_dashboard, admin_products, admin_orders, admin_contacts, payment

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
app.include_router(payment.router)

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
    """Initialize MySQL database on startup"""
    logger.info("Starting application...")
    
    try:
        # Initialize MySQL tables
        await init_database()
        logger.info("MySQL database tables initialized")
        
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")

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