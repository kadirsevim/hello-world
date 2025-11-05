import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  FolderKanban, 
  ShoppingCart, 
  MessageSquare,
  Settings,
  CreditCard,
  Download,
  LogOut,
  Menu,
  X,
  Flame,
  ChevronDown
} from 'lucide-react';
import { adminLogout, verifyToken } from '../services/adminApi';
import { toast } from '../hooks/use-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await verifyToken();
      setLoading(false);
    } catch (error) {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Çıkış Başarılı",
      description: "Güvenli bir şekilde çıkış yaptınız.",
    });
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Ürün Yönetimi', path: '/admin/products', icon: Package },
    { name: 'Blog Yönetimi', path: '/admin/blog', icon: FileText },
    { name: 'Proje Yönetimi', path: '/admin/projects', icon: FolderKanban },
    { name: 'Siparişler', path: '/admin/orders', icon: ShoppingCart },
    { name: 'İletişim Mesajları', path: '/admin/contacts', icon: MessageSquare },
    { name: 'Sayfa Ayarları', path: '/admin/settings', icon: Settings },
    { name: 'Ödeme Ayarları', path: '/admin/payments', icon: CreditCard },
    { name: 'Ürün Çekme', path: '/admin/import', icon: Download },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">YZR Yangın</div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-red-50 text-red-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <span className="font-medium">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;