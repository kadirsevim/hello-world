import React, { useState, useEffect } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '../../services/adminApi';
import { toast } from '../../hooks/use-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Siparişler yüklenirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi.",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Siparişler</h1>
        <p className="text-gray-600 mt-1">{orders.length} sipariş bulundu</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sipariş ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Müşteri</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tutar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durum</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tarih</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-600">
                      {order.id.substring(0, 8)}...
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {order.first_name} {order.last_name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.email}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ₺{order.total.toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-red-500 ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="pending">Bekliyor</option>
                      <option value="processing">İşleniyor</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Sipariş Detayları</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Müşteri</p>
                  <p className="font-semibold">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-posta</p>
                  <p className="font-semibold">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durum</p>
                  <p className="font-semibold">{selectedOrder.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Teslimat Adresi</p>
                <p className="font-semibold">{selectedOrder.address}</p>
                <p className="text-gray-700">{selectedOrder.city}, {selectedOrder.zip_code}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Ürünler</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span className="font-semibold">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span>₺{selectedOrder.subtotal.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>KDV</span>
                  <span>₺{selectedOrder.tax.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kargo</span>
                  <span>₺{selectedOrder.shipping.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Toplam</span>
                  <span>₺{selectedOrder.total.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;