import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, MessageSquare, FileText, TrendingUp, Clock } from 'lucide-react';
import { getDashboardStats, getRecentOrders, getRecentContacts } from '../../services/adminApi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, ordersData, contactsData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(),
        getRecentContacts()
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
      setRecentContacts(contactsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Toplam Ürün', value: stats?.total_products || 0, icon: Package, color: 'bg-blue-500' },
    { name: 'Toplam Sipariş', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Toplam Mesaj', value: stats?.total_contacts || 0, icon: MessageSquare, color: 'bg-purple-500' },
    { name: 'Toplam Blog', value: stats?.total_blog_posts || 0, icon: FileText, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Hoş geldiniz! İşletmenizin genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 mb-1">Toplam Gelir</p>
            <p className="text-4xl font-bold">₺{(stats?.total_revenue || 0).toLocaleString('tr-TR')}</p>
          </div>
          <TrendingUp className="h-12 w-12 text-red-200" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son Siparişler</h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{order.first_name} {order.last_name}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₺{order.total.toLocaleString('tr-TR')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status === 'pending' ? 'Bekliyor' :
                       order.status === 'processing' ? 'İşleniyor' :
                       order.status === 'completed' ? 'Tamamlandı' : 'iptal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz sipariş yok</p>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son Mesajlar</h2>
          {recentContacts.length > 0 ? (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      contact.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {contact.status === 'new' ? 'Yeni' : 'Cevaplandı'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz mesaj yok</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;