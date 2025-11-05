"""
MongoDB to MySQL Migration Script
Run this once to migrate all data from MongoDB to MySQL
"""
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from database_mysql import get_db_pool, init_database
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
mongo_db = mongo_client[os.environ['DB_NAME']]

async def migrate_categories():
    """Migrate categories from MongoDB to MySQL"""
    print("Migrating categories...")
    
    # Get data from MongoDB
    categories = await mongo_db.categories.find().to_list(1000)
    
    if not categories:
        print("No categories found in MongoDB")
        return
    
    # Insert into MySQL
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for cat in categories:
                await cursor.execute("""
                    INSERT INTO categories (id, name, slug, icon)
                    VALUES (%s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        slug = VALUES(slug),
                        icon = VALUES(icon)
                """, (cat['id'], cat['name'], cat['slug'], cat['icon']))
    
    print(f"✓ Migrated {len(categories)} categories")

async def migrate_products():
    """Migrate products from MongoDB to MySQL"""
    print("Migrating products...")
    
    products = await mongo_db.products.find().to_list(1000)
    
    if not products:
        print("No products found in MongoDB")
        return
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for product in products:
                features_json = json.dumps(product.get('features', []))
                
                await cursor.execute("""
                    INSERT INTO products 
                    (id, name, slug, category, category_id, price, image, description, features, stock, rating, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        slug = VALUES(slug),
                        category = VALUES(category),
                        category_id = VALUES(category_id),
                        price = VALUES(price),
                        image = VALUES(image),
                        description = VALUES(description),
                        features = VALUES(features),
                        stock = VALUES(stock),
                        rating = VALUES(rating)
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
    
    print(f"✓ Migrated {len(products)} products")

async def migrate_blog():
    """Migrate blog posts from MongoDB to MySQL"""
    print("Migrating blog posts...")
    
    posts = await mongo_db.blog.find().to_list(1000)
    
    if not posts:
        print("No blog posts found in MongoDB")
        return
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for post in posts:
                await cursor.execute("""
                    INSERT INTO blog 
                    (id, title, slug, excerpt, content, image, author, category, read_time, date, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE
                        title = VALUES(title),
                        slug = VALUES(slug),
                        excerpt = VALUES(excerpt),
                        content = VALUES(content),
                        image = VALUES(image),
                        author = VALUES(author),
                        category = VALUES(category),
                        read_time = VALUES(read_time)
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
    
    print(f"✓ Migrated {len(posts)} blog posts")

async def migrate_projects():
    """Migrate projects from MongoDB to MySQL"""
    print("Migrating projects...")
    
    projects = await mongo_db.projects.find().to_list(1000)
    
    if not projects:
        print("No projects found in MongoDB")
        return
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for project in projects:
                features_json = json.dumps(project.get('features', []))
                
                await cursor.execute("""
                    INSERT INTO projects 
                    (id, title, client, category, description, image, year, features, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE
                        title = VALUES(title),
                        client = VALUES(client),
                        category = VALUES(category),
                        description = VALUES(description),
                        image = VALUES(image),
                        year = VALUES(year),
                        features = VALUES(features)
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
    
    print(f"✓ Migrated {len(projects)} projects")

async def migrate_orders():
    """Migrate orders from MongoDB to MySQL"""
    print("Migrating orders...")
    
    orders = await mongo_db.orders.find().to_list(1000)
    
    if not orders:
        print("No orders found in MongoDB")
        return
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for order in orders:
                items_json = json.dumps(order.get('items', []))
                
                await cursor.execute("""
                    INSERT INTO orders 
                    (id, first_name, last_name, email, phone, address, city, zip_code, 
                     payment_method, items, subtotal, tax, shipping, total, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE
                        first_name = VALUES(first_name),
                        last_name = VALUES(last_name),
                        email = VALUES(email),
                        phone = VALUES(phone),
                        address = VALUES(address),
                        city = VALUES(city),
                        zip_code = VALUES(zip_code),
                        payment_method = VALUES(payment_method),
                        items = VALUES(items),
                        subtotal = VALUES(subtotal),
                        tax = VALUES(tax),
                        shipping = VALUES(shipping),
                        total = VALUES(total),
                        status = VALUES(status)
                """, (
                    order['id'],
                    order['first_name'],
                    order['last_name'],
                    order['email'],
                    order['phone'],
                    order['address'],
                    order['city'],
                    order['zip_code'],
                    order['payment_method'],
                    items_json,
                    order['subtotal'],
                    order['tax'],
                    order['shipping'],
                    order['total'],
                    order['status']
                ))
    
    print(f"✓ Migrated {len(orders)} orders")

async def migrate_contacts():
    """Migrate contacts from MongoDB to MySQL"""
    print("Migrating contacts...")
    
    contacts = await mongo_db.contacts.find().to_list(1000)
    
    if not contacts:
        print("No contacts found in MongoDB")
        return
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            for contact in contacts:
                await cursor.execute("""
                    INSERT INTO contacts 
                    (id, name, email, phone, subject, message, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        email = VALUES(email),
                        phone = VALUES(phone),
                        subject = VALUES(subject),
                        message = VALUES(message),
                        status = VALUES(status)
                """, (
                    contact['id'],
                    contact['name'],
                    contact['email'],
                    contact['phone'],
                    contact['subject'],
                    contact['message'],
                    contact['status']
                ))
    
    print(f"✓ Migrated {len(contacts)} contacts")

async def main():
    """Main migration function"""
    print("=" * 60)
    print("MongoDB to MySQL Migration Script")
    print("=" * 60)
    
    try:
        # Initialize MySQL tables
        print("\n1. Initializing MySQL database...")
        await init_database()
        print("✓ Database tables created")
        
        # Run migrations
        print("\n2. Starting data migration...\n")
        await migrate_categories()
        await migrate_products()
        await migrate_blog()
        await migrate_projects()
        await migrate_orders()
        await migrate_contacts()
        
        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close connections
        from database_mysql import close_db_pool
        await close_db_pool()
        mongo_client.close()

if __name__ == "__main__":
    asyncio.run(main())
