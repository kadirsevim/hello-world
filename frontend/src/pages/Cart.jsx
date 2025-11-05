import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getCartFromStorage, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from '../mock';
import { toast } from '../hooks/use-toast';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = updateCartQuantity(productId, newQuantity);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId, productName) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Ürün Silindi",
      description: `${productName} sepetinizden çıkarıldı.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    setCart([]);
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Sepet Temizlendi",
      description: "Tüm ürünler sepetinizden çıkarıldı.",
    });
  };

  const subtotal = getCartTotal(cart);
  const tax = subtotal * 0.20; // KDV %20
  const shipping = cart.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">Ürün eklemek için alışverişe başlayın</p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Alışveriş Sepetim</h1>
            <p className="text-gray-600">{cart.length} ürün</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Alışverişe Devam
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex gap-6">
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/products/${item.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors duration-200">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-4">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₺{item.price.toLocaleString('tr-TR')} / adet
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="w-full py-3 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Sepeti Temizle
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span className="font-semibold">₺{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>KDV (%20)</span>
                  <span className="font-semibold">₺{tax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kargo</span>
                  <span className="font-semibold">₺{shipping.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">(KDV Dahil)</p>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-center font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 mb-4"
              >
                Siparişi Tamamla
              </Link>
              <Link
                to="/products"
                className="block w-full py-4 bg-gray-100 text-gray-900 text-center font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;