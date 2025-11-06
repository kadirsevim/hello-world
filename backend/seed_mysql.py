"""
Direct MySQL Seeding Script (No MongoDB required)
Run this to populate MySQL database with initial data
"""
import asyncio
import json
from database import get_db_pool, init_database
import seed_data

async def seed_categories():
    """Seed categories"""
    print("Seeding categories...")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for cat in seed_data.categories:
                await cursor.execute("""
                    INSERT INTO categories (id, name, slug, icon)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        slug = VALUES(slug),
                        icon = VALUES(icon)
                """, (cat['id'], cat['name'], cat['slug'], cat['icon']))
    
    print(f"✓ Seeded {len(seed_data.categories)} categories")

async def seed_products():
    """Seed products"""
    print("Seeding products...")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for product in seed_data.products:
                features_json = json.dumps(product['features'])
                
                await cursor.execute("""
                    INSERT INTO products 
                    (id, name, slug, category, category_id, price, image, description, features, stock, rating)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        category = VALUES(category),
                        price = VALUES(price),
                        stock = VALUES(stock)
                """, (
                    product['id'],
                    product['name'],
                    product['slug'],
                    product['category'],
                    product['category_id'],
                    product['price'],
                    product['image'],
                    product['description'],
                    features_json,
                    product['stock'],
                    product['rating']
                ))
    
    print(f"✓ Seeded {len(seed_data.products)} products")

async def seed_blog():
    """Seed blog posts"""
    print("Seeding blog posts...")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for post in seed_data.blog_posts:
                await cursor.execute("""
                    INSERT INTO blog 
                    (id, title, slug, excerpt, content, image, author, category, read_time)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        title = VALUES(title),
                        content = VALUES(content)
                """, (
                    post['id'],
                    post['title'],
                    post['slug'],
                    post['excerpt'],
                    post['content'],
                    post['image'],
                    post['author'],
                    post['category'],
                    post['read_time']
                ))
    
    print(f"✓ Seeded {len(seed_data.blog_posts)} blog posts")

async def seed_projects():
    """Seed projects"""
    print("Seeding projects...")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for project in seed_data.projects:
                features_json = json.dumps(project['features'])
                
                await cursor.execute("""
                    INSERT INTO projects 
                    (id, title, client, category, description, image, year, features)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        title = VALUES(title),
                        description = VALUES(description)
                """, (
                    project['id'],
                    project['title'],
                    project['client'],
                    project['category'],
                    project['description'],
                    project['image'],
                    project['year'],
                    features_json
                ))
    
    print(f"✓ Seeded {len(seed_data.projects)} projects")

async def main():
    """Main seeding function"""
    print("=" * 60)
    print("MySQL Database Seeding Script")
    print("=" * 60)
    
    try:
        # Initialize MySQL tables
        print("\n1. Initializing MySQL database...")
        await init_database()
        print("✓ Database tables created")
        
        # Run seeding
        print("\n2. Seeding data...\n")
        await seed_categories()
        await seed_products()
        await seed_blog()
        await seed_projects()
        
        print("\n" + "=" * 60)
        print("✅ Seeding completed successfully!")
        print("=" * 60)
        print("\nYou can now start the server:")
        print("  uvicorn server:app --host 0.0.0.0 --port 8001")
        
    except Exception as e:
        print(f"\n❌ Seeding failed: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        from database import close_db_pool
        await close_db_pool()

if __name__ == "__main__":
    asyncio.run(main())
