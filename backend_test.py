#!/usr/bin/env python3
"""
YZR Yangın E-commerce Backend API Test Suite
Tests all backend endpoints for functionality and data integrity
"""

import requests
import json
import sys
from datetime import datetime

# Use the production URL from frontend/.env
BASE_URL = "https://yzr-store.preview.emergentagent.com/api"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_sample"] = response_data
        
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
    
    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "YZR Yangın API" in data["message"]:
                    self.log_test("API Root", True, f"Status: {response.status_code}, Message: {data['message']}")
                    return True
                else:
                    self.log_test("API Root", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("API Root", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Root", False, f"Connection error: {str(e)}")
            return False
    
    def test_products_api(self):
        """Test Products API endpoints"""
        print("\n=== Testing Products API ===")
        
        # Test 1: Get all products
        try:
            response = requests.get(f"{self.base_url}/products")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) > 0:
                    sample_product = products[0]
                    required_fields = ["id", "name", "slug", "price", "category"]
                    missing_fields = [field for field in required_fields if field not in sample_product]
                    
                    if not missing_fields:
                        self.log_test("GET /products", True, 
                                    f"Retrieved {len(products)} products", 
                                    {"sample_product": sample_product})
                    else:
                        self.log_test("GET /products", False, 
                                    f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("GET /products", False, "No products returned or invalid format")
            else:
                self.log_test("GET /products", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /products", False, f"Error: {str(e)}")
        
        # Test 2: Category filtering
        try:
            response = requests.get(f"{self.base_url}/products?category=1")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    self.log_test("GET /products?category=1", True, 
                                f"Retrieved {len(products)} products for category 1")
                else:
                    self.log_test("GET /products?category=1", False, "Invalid response format")
            else:
                self.log_test("GET /products?category=1", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /products?category=1", False, f"Error: {str(e)}")
        
        # Test 3: Search functionality
        try:
            response = requests.get(f"{self.base_url}/products?search=abc")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    self.log_test("GET /products?search=abc", True, 
                                f"Search returned {len(products)} products")
                else:
                    self.log_test("GET /products?search=abc", False, "Invalid response format")
            else:
                self.log_test("GET /products?search=abc", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /products?search=abc", False, f"Error: {str(e)}")
        
        # Test 4: Price sorting
        try:
            response = requests.get(f"{self.base_url}/products?sort=price-asc")
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) > 1:
                    # Check if sorted by price ascending
                    is_sorted = all(products[i]["price"] <= products[i+1]["price"] 
                                  for i in range(len(products)-1))
                    self.log_test("GET /products?sort=price-asc", is_sorted, 
                                f"Price sorting {'working' if is_sorted else 'not working'}")
                else:
                    self.log_test("GET /products?sort=price-asc", True, 
                                "Sorting endpoint accessible (insufficient data to verify order)")
            else:
                self.log_test("GET /products?sort=price-asc", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /products?sort=price-asc", False, f"Error: {str(e)}")
        
        # Test 5: Single product by slug
        try:
            response = requests.get(f"{self.base_url}/products/abc-kuru-kimyevi-6kg")
            if response.status_code == 200:
                product = response.json()
                if isinstance(product, dict) and "slug" in product:
                    self.log_test("GET /products/{slug}", True, 
                                f"Retrieved product: {product.get('name', 'Unknown')}")
                else:
                    self.log_test("GET /products/{slug}", False, "Invalid product format")
            elif response.status_code == 404:
                self.log_test("GET /products/{slug}", False, 
                            "Product not found - may need to check available slugs")
            else:
                self.log_test("GET /products/{slug}", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /products/{slug}", False, f"Error: {str(e)}")
    
    def test_categories_api(self):
        """Test Categories API"""
        print("\n=== Testing Categories API ===")
        
        try:
            response = requests.get(f"{self.base_url}/categories")
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list) and len(categories) > 0:
                    sample_category = categories[0]
                    required_fields = ["id", "name", "slug"]
                    missing_fields = [field for field in required_fields if field not in sample_category]
                    
                    if not missing_fields:
                        self.log_test("GET /categories", True, 
                                    f"Retrieved {len(categories)} categories", 
                                    {"sample_category": sample_category})
                    else:
                        self.log_test("GET /categories", False, 
                                    f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("GET /categories", False, "No categories returned or invalid format")
            else:
                self.log_test("GET /categories", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /categories", False, f"Error: {str(e)}")
    
    def test_blog_api(self):
        """Test Blog API"""
        print("\n=== Testing Blog API ===")
        
        # Test 1: Get all blog posts
        try:
            response = requests.get(f"{self.base_url}/blog")
            if response.status_code == 200:
                posts = response.json()
                if isinstance(posts, list) and len(posts) > 0:
                    sample_post = posts[0]
                    required_fields = ["id", "title", "slug", "content"]
                    missing_fields = [field for field in required_fields if field not in sample_post]
                    
                    if not missing_fields:
                        self.log_test("GET /blog", True, 
                                    f"Retrieved {len(posts)} blog posts", 
                                    {"sample_post_title": sample_post.get("title")})
                    else:
                        self.log_test("GET /blog", False, 
                                    f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("GET /blog", False, "No blog posts returned or invalid format")
            else:
                self.log_test("GET /blog", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /blog", False, f"Error: {str(e)}")
        
        # Test 2: Single blog post by slug
        try:
            response = requests.get(f"{self.base_url}/blog/yangin-sondurme-sistemleri-neden-gereklidir")
            if response.status_code == 200:
                post = response.json()
                if isinstance(post, dict) and "slug" in post:
                    self.log_test("GET /blog/{slug}", True, 
                                f"Retrieved blog post: {post.get('title', 'Unknown')}")
                else:
                    self.log_test("GET /blog/{slug}", False, "Invalid blog post format")
            elif response.status_code == 404:
                self.log_test("GET /blog/{slug}", False, 
                            "Blog post not found - may need to check available slugs")
            else:
                self.log_test("GET /blog/{slug}", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /blog/{slug}", False, f"Error: {str(e)}")
    
    def test_projects_api(self):
        """Test Projects API"""
        print("\n=== Testing Projects API ===")
        
        try:
            response = requests.get(f"{self.base_url}/projects")
            if response.status_code == 200:
                projects = response.json()
                if isinstance(projects, list) and len(projects) > 0:
                    sample_project = projects[0]
                    required_fields = ["id", "title", "client", "category"]
                    missing_fields = [field for field in required_fields if field not in sample_project]
                    
                    if not missing_fields:
                        self.log_test("GET /projects", True, 
                                    f"Retrieved {len(projects)} projects", 
                                    {"sample_project_title": sample_project.get("title")})
                    else:
                        self.log_test("GET /projects", False, 
                                    f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("GET /projects", False, "No projects returned or invalid format")
            else:
                self.log_test("GET /projects", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /projects", False, f"Error: {str(e)}")
    
    def test_orders_api(self):
        """Test Orders API"""
        print("\n=== Testing Orders API ===")
        
        # Test order creation
        order_data = {
            "first_name": "Ahmet",
            "last_name": "Yılmaz",
            "email": "ahmet.yilmaz@example.com",
            "phone": "05551234567",
            "address": "Atatürk Caddesi No:123",
            "city": "Istanbul",
            "zip_code": "34000",
            "payment_method": "credit-card",
            "items": [
                {
                    "product_id": "1",
                    "product_name": "ABC Söndürücü",
                    "quantity": 1,
                    "price": 850
                }
            ],
            "subtotal": 850,
            "tax": 170,
            "shipping": 50,
            "total": 1070
        }
        
        try:
            response = requests.post(f"{self.base_url}/orders", 
                                   json=order_data,
                                   headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                order = response.json()
                if isinstance(order, dict) and "id" in order:
                    self.log_test("POST /orders", True, 
                                f"Order created successfully with ID: {order['id']}")
                else:
                    self.log_test("POST /orders", False, "Invalid order response format")
            else:
                self.log_test("POST /orders", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /orders", False, f"Error: {str(e)}")
    
    def test_contact_api(self):
        """Test Contact API"""
        print("\n=== Testing Contact API ===")
        
        # Test contact form submission
        contact_data = {
            "name": "Mehmet Özkan",
            "email": "mehmet.ozkan@example.com",
            "phone": "05551234567",
            "subject": "product",
            "message": "Yangın söndürme sistemleri hakkında bilgi almak istiyorum."
        }
        
        try:
            response = requests.post(f"{self.base_url}/contact", 
                                   json=contact_data,
                                   headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                contact = response.json()
                if isinstance(contact, dict) and "id" in contact:
                    self.log_test("POST /contact", True, 
                                f"Contact message created successfully with ID: {contact['id']}")
                else:
                    self.log_test("POST /contact", False, "Invalid contact response format")
            else:
                self.log_test("POST /contact", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("POST /contact", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting YZR Yangın E-commerce Backend API Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API connectivity first
        if not self.test_api_root():
            print("❌ Cannot connect to API. Stopping tests.")
            return False
        
        # Run all endpoint tests
        self.test_products_api()
        self.test_categories_api()
        self.test_blog_api()
        self.test_projects_api()
        self.test_orders_api()
        self.test_contact_api()
        
        # Print summary
        self.print_summary()
        
        return len(self.failed_tests) == 0
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = total_tests - len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        print("\n✅ All tests completed!")

def main():
    """Main test execution"""
    tester = APITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()