# API Contracts - YZR Yangın E-commerce

## Mock Data Location
- `/app/frontend/src/mock.js` - Tüm mock data burada

## Backend Implementation Plan

### 1. Database Models

#### Product Model
```python
- id: str (UUID)
- name: str
- slug: str (unique)
- category: str
- category_id: int
- price: float
- image: str (URL)
- description: str
- features: List[str]
- stock: int
- rating: float
- created_at: datetime
```

#### Category Model
```python
- id: int
- name: str
- slug: str
- icon: str
```

#### Blog Model
```python
- id: str (UUID)
- title: str
- slug: str (unique)
- excerpt: str
- content: str
- image: str (URL)
- author: str
- date: datetime
- category: str
- read_time: str
- created_at: datetime
```

#### Project Model
```python
- id: str (UUID)
- title: str
- client: str
- category: str
- description: str
- image: str (URL)
- year: int
- features: List[str]
- created_at: datetime
```

#### Order Model
```python
- id: str (UUID)
- first_name: str
- last_name: str
- email: str
- phone: str
- address: str
- city: str
- zip_code: str
- payment_method: str
- items: List[dict] (product_id, quantity, price)
- subtotal: float
- tax: float
- shipping: float
- total: float
- status: str (pending, processing, completed, cancelled)
- created_at: datetime
```

#### Contact Model
```python
- id: str (UUID)
- name: str
- email: str
- phone: str
- subject: str
- message: str
- status: str (new, replied)
- created_at: datetime
```

### 2. API Endpoints

#### Products
- GET `/api/products` - Tüm ürünleri getir (query params: category, search, sort)
- GET `/api/products/:slug` - Tek ürün detayı
- POST `/api/admin/products` - Yeni ürün ekle (Admin)
- PUT `/api/admin/products/:id` - Ürün güncelle (Admin)
- DELETE `/api/admin/products/:id` - Ürün sil (Admin)

#### Categories
- GET `/api/categories` - Tüm kategorileri getir

#### Blog
- GET `/api/blog` - Tüm blog yazıları
- GET `/api/blog/:slug` - Tek blog yazısı
- POST `/api/admin/blog` - Yeni yazı ekle (Admin)
- PUT `/api/admin/blog/:id` - Yazı güncelle (Admin)
- DELETE `/api/admin/blog/:id` - Yazı sil (Admin)

#### Projects
- GET `/api/projects` - Tüm projeleri getir
- POST `/api/admin/projects` - Yeni proje ekle (Admin)
- PUT `/api/admin/projects/:id` - Proje güncelle (Admin)
- DELETE `/api/admin/projects/:id` - Proje sil (Admin)

#### Orders
- POST `/api/orders` - Yeni sipariş oluştur
- GET `/api/admin/orders` - Tüm siparişleri getir (Admin)
- GET `/api/admin/orders/:id` - Sipariş detayı (Admin)
- PUT `/api/admin/orders/:id/status` - Sipariş durumu güncelle (Admin)

#### Contact
- POST `/api/contact` - İletişim formu gönder
- GET `/api/admin/contacts` - Tüm mesajları getir (Admin)
- PUT `/api/admin/contacts/:id/status` - Mesaj durumu güncelle (Admin)

### 3. Frontend Integration Changes

#### Remove Mock Data Usage
- Products.jsx: API'den veri çek
- ProductDetail.jsx: API'den veri çek
- Blog.jsx: API'den veri çek
- BlogDetail.jsx: API'den veri çek
- Projects.jsx: API'den veri çek
- Cart.jsx: localStorage yerine state management
- Checkout.jsx: POST /api/orders
- Contact.jsx: POST /api/contact

#### Add Admin Pages
- /admin/login - Admin girişi
- /admin/dashboard - Dashboard (istatistikler)
- /admin/products - Ürün listesi ve yönetimi
- /admin/products/new - Yeni ürün ekle
- /admin/products/edit/:id - Ürün düzenle
- /admin/blog - Blog listesi ve yönetimi
- /admin/blog/new - Yeni blog yazısı
- /admin/blog/edit/:id - Blog düzenle
- /admin/projects - Proje listesi ve yönetimi
- /admin/projects/new - Yeni proje ekle
- /admin/projects/edit/:id - Proje düzenle
- /admin/orders - Sipariş listesi
- /admin/orders/:id - Sipariş detayı
- /admin/contacts - İletişim mesajları

### 4. Initial Data Seeding
Backend ilk çalıştırıldığında mock.js'deki verileri MongoDB'ye aktarılacak.

### 5. Admin Authentication
Basit username/password authentication (admin/admin123)

### 6. CORS Configuration
Backend'de frontend URL'sine CORS izni verilecek.
