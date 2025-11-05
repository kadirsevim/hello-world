import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">YZR Yangın</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              30 yılı aşkın tecrübemizle yangın güvenliği alanında profesyonel çözümler sunuyoruz.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-red-500 transition-colors duration-200">Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-red-500 transition-colors duration-200">Ürünler</Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-red-500 transition-colors duration-200">Hizmetler</Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm hover:text-red-500 transition-colors duration-200">Projeler</Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-red-500 transition-colors duration-200">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-red-500 transition-colors duration-200">İletişim</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ürün Kategorileri</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=1" className="text-sm hover:text-red-500 transition-colors duration-200">Yangın Söndürücüler</Link>
              </li>
              <li>
                <Link to="/products?category=2" className="text-sm hover:text-red-500 transition-colors duration-200">Sprinkler Sistemleri</Link>
              </li>
              <li>
                <Link to="/products?category=3" className="text-sm hover:text-red-500 transition-colors duration-200">Algılama Sistemleri</Link>
              </li>
              <li>
                <Link to="/products?category=4" className="text-sm hover:text-red-500 transition-colors duration-200">Köpük Sistemleri</Link>
              </li>
              <li>
                <Link to="/products?category=5" className="text-sm hover:text-red-500 transition-colors duration-200">Gazlı Söndürme</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim Bilgileri</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <a href="tel:+905551234567" className="text-sm hover:text-red-500 transition-colors duration-200">
                  +90 555 123 45 67
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <a href="mailto:info@yzryangin.com" className="text-sm hover:text-red-500 transition-colors duration-200">
                  info@yzryangin.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-2">7/24 Acil Destek</p>
              <a href="tel:+905009999999" className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm font-medium">
                Hemen Ara
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} YZR Yangın. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;