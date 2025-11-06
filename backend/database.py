import aiomysql
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# MySQL Configuration
MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
MYSQL_DB = os.environ.get('MYSQL_DB', 'yzr_yangin')

# Global connection pool
pool = None

async def get_db_pool():
    """Get or create MySQL connection pool"""
    global pool
    if pool is None:
        pool = await aiomysql.create_pool(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            db=MYSQL_DB,
            autocommit=True,
            minsize=1,
            maxsize=10,
            charset='utf8mb4'
        )
        logger.info(f"MySQL connection pool created: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}")
    return pool

async def close_db_pool():
    """Close MySQL connection pool"""
    global pool
    if pool:
        pool.close()
        await pool.wait_closed()
        logger.info("MySQL connection pool closed")

async def init_database():
    """Initialize database tables"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Categories table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS categories (
                    id INT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    icon VARCHAR(100)
                )
            """)
            
            # Products table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    category VARCHAR(255) NOT NULL,
                    category_id INT NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    image TEXT,
                    description TEXT,
                    features JSON,
                    stock INT DEFAULT 0,
                    rating DECIMAL(3, 2) DEFAULT 4.5,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id)
                )
            """)
            
            # Blog table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS blog (
                    id VARCHAR(36) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    excerpt TEXT,
                    content TEXT,
                    image TEXT,
                    author VARCHAR(255),
                    category VARCHAR(100),
                    read_time VARCHAR(50),
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Projects table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id VARCHAR(36) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    client VARCHAR(255),
                    category VARCHAR(100),
                    description TEXT,
                    image TEXT,
                    year INT,
                    features JSON,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Orders table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id VARCHAR(36) PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    address TEXT,
                    city VARCHAR(100),
                    zip_code VARCHAR(20),
                    payment_method VARCHAR(50),
                    items JSON,
                    subtotal DECIMAL(10, 2),
                    tax DECIMAL(10, 2),
                    shipping DECIMAL(10, 2),
                    total DECIMAL(10, 2),
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Contacts table
            await cursor.execute("""
                CREATE TABLE IF NOT EXISTS contacts (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    subject VARCHAR(255),
                    message TEXT,
                    status VARCHAR(50) DEFAULT 'new',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            logger.info("Database tables initialized")
