from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Product Models
class ProductBase(BaseModel):
    name: str
    slug: str
    category: str
    category_id: int
    price: float
    image: str
    description: str
    features: List[str]
    stock: int
    rating: float = 4.5

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Category Models
class Category(BaseModel):
    id: int
    name: str
    slug: str
    icon: str

# Blog Models
class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image: str
    author: str
    category: str
    read_time: str

class BlogCreate(BlogBase):
    pass

class Blog(BlogBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Project Models
class ProjectBase(BaseModel):
    title: str
    client: str
    category: str
    description: str
    image: str
    year: int
    features: List[str]

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    zip_code: str
    payment_method: str
    items: List[OrderItem]
    subtotal: float
    tax: float
    shipping: float
    total: float

class Order(OrderCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Contact Models
class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str

class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Service Model (static, no database)
class Service(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    features: List[str]

# Testimonial Model (static, no database)
class Testimonial(BaseModel):
    id: int
    name: str
    company: str
    position: str
    content: str
    rating: int
    image: str