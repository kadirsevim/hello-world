import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { products, categories, addToCart } from '../mock';
import { toast } from '../hooks/use-toast';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === parseInt(selectedCategory));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name, 'tr');
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product);
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Sepete Eklendi!",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ürünlerimiz</h1>
          <p className="text-xl text-gray-600">
            Yangın güvenliği için ihtiyacınız olan tüm ürünler
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="name">İsme Göre (A-Z)</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">En Yüksek Puan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">{product.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-yellow-500 mr-2">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">• Stok: {product.stock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;