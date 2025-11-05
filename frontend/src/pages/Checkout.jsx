import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { getCartFromStorage, getCartTotal, clearCart } from '../mock';
import { createOrder } from '../services/api';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit-card'
  });
  
  const [cardData, setCardData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });
  
  const [processing, setProcessing] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = getCartFromStorage();
    if (cartData.length === 0) {
      navigate('/products');
      return;
    }
    setCart(cartData);
  }, [navigate]);

  const subtotal = getCartTotal(cart);
  const tax = subtotal * 0.20;
  const shipping = 50;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      // Validate card data
      if (!cardData.cardNumber || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvc) {
        toast({
          title: "Eksik Bilgi",
          description: "Lütfen tüm kart bilgilerini doldurun.",
        });
        setProcessing(false);
        return;
      }

      // Create order first
      const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        payment_method: 'credit-card',
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total
      };

      const orderResponse = await createOrder(orderData);
      
      // Process payment
      const paymentData = {
        order_id: orderResponse.id,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        customer_zip_code: formData.zipCode,
        card_holder_name: cardData.cardHolderName,
        card_number: cardData.cardNumber.replace(/\s/g, ''),
        expiry_month: cardData.expiryMonth,
        expiry_year: cardData.expiryYear,
        cvc: cardData.cvc,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: total
      };

      const paymentResponse = await axios.post(
        `${BACKEND_URL}/api/payment/process`,
        paymentData
      );

      if (paymentResponse.data.status === 'success') {
        toast({
          title: "Ödeme Başarılı!",
          description: "Siparişiniz başarıyla oluşturuldu. Teşekkür ederiz!",
        });

        // Clear cart and redirect
        clearCart();
        window.dispatchEvent(new Event('cartUpdated'));
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast({
          title: "Ödeme Başarısız",
          description: paymentResponse.data.message || "Ödeme işlemi başarısız oldu.",
        });
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Hata",
        description: "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCardInputChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Limit expiry month to 2 digits
    if (name === 'expiryMonth') {
      value = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    }
    
    // Limit expiry year to 4 digits
    if (name === 'expiryYear') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    // Limit CVC to 3 digits
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardData({
      ...cardData,
      [name]: value
    });
  };
  
  const useTestCard = (type) => {
    if (type === 'success') {
      setCardData({
        cardHolderName: 'TEST USER',
        cardNumber: '5528 7900 0000 0008',
        expiryMonth: '12',
        expiryYear: '2030',
        cvc: '123'
      });
    } else {
      setCardData({
        cardHolderName: 'TEST USER',
        cardNumber: '4111 1111 1111 1129',
        expiryMonth: '12',
        expiryYear: '2030',
        cvc: '123'
      });
    }
    setShowTestCards(false);
    toast({
      title: "Test Kartı Seçildi",
      description: type === 'success' ? "Başarılı test kartı yüklendi" : "Başarısız test kartı yüklendi",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Ödeme</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Truck className="h-6 w-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Teslimat Bilgileri</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ad</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Soyad</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Posta Kodu</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Kredi Kartı Bilgileri</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTestCards(!showTestCards)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Test Kartları
                  </button>
                </div>
                
                {showTestCards && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">Test Kartlarını Kullan:</p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => useTestCard('success')}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-green-50 border border-green-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-700">✓ Başarılı Ödeme</p>
                            <p className="text-sm text-gray-600">5528 7900 0000 0008</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => useTestCard('failure')}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-red-50 border border-red-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-red-700">✗ Başarısız Ödeme</p>
                            <p className="text-sm text-gray-600">4111 1111 1111 1129</p>
                          </div>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={cardData.cardHolderName}
                      onChange={handleCardInputChange}
                      required
                      placeholder="AD SOYAD"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Numarası</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      required
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ay</label>
                      <input
                        type="text"
                        name="expiryMonth"
                        value={cardData.expiryMonth}
                        onChange={handleCardInputChange}
                        required
                        placeholder="MM"
                        maxLength="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Yıl</label>
                      <input
                        type="text"
                        name="expiryYear"
                        value={cardData.expiryYear}
                        onChange={handleCardInputChange}
                        required
                        placeholder="YYYY"
                        maxLength="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardData.cvc}
                        onChange={handleCardInputChange}
                        required
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50 flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Siparişi Tamamla
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{item.quantity} adet</span>
                        <span className="font-semibold text-gray-900">
                          ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-6">
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;