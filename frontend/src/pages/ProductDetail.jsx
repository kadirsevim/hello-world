import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, CheckCircle, ArrowLeft, Plus, Minus } from 'lucide-react';
import { products, addToCart } from '../mock';
import { toast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.slug === slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link to="/products" className="text-red-600 hover:text-red-700">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Sepete Eklendi!",
      description: `${quantity} adet ${product.name} sepetinize eklendi.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-red-600 transition-colors duration-200">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-red-600 transition-colors duration-200">Ürünler</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Geri Dön
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-medium mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-500 mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-700 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-600">Stok: <span className="font-semibold text-gray-900">{product.stock} adet</span></span>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₺{product.price.toLocaleString('tr-TR')}
              </div>
              <p className="text-sm text-gray-600">KDV Dahil</p>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Adet</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Sepete Ekle
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                Hemen Al
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">{relatedProduct.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₺{relatedProduct.price.toLocaleString('tr-TR')}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;