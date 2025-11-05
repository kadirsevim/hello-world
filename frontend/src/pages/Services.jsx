import React from 'react';
import { Wrench, Settings, GraduationCap, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../mock';

const iconMap = {
  'wrench': Wrench,
  'settings': Settings,
  'graduation-cap': GraduationCap,
  'refresh-cw': RefreshCw
};

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Hizmetlerimiz</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Yangın güvenliği konusunda ihtiyaç duyduğunuz tüm hizmetleri
            <br />profesyonel ekibimizle sunuyoruz
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-red-600 to-red-700 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{service.description}</p>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
                >
                  Bilgi Al
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Hizmetlerimizi Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              30 yılı aşkın tecrübemizle yangın güvenliği alanında sınıfında lider hizmet kalitesi sunuyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Uzman Ekip',
                description: 'Sertifikalı, eğitimli ve deneyimli teknik kadro ile hizmet veriyoruz.',
                stat: '50+',
                statLabel: 'Uzman Personel'
              },
              {
                title: 'Hızlı Müdahale',
                description: '7/24 ulaşılabilir acil destek hattımız ile anında çözüm sunuyoruz.',
                stat: '24/7',
                statLabel: 'Destek Hizmeti'
              },
              {
                title: 'Kalite Garantisi',
                description: 'Tüm hizmetlerimizde uluslararası standartlara uygunluk garantisi veriyoruz.',
                stat: '100%',
                statLabel: 'Müşteri Memnuniyeti'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">{item.stat}</div>
                <div className="text-sm text-gray-600 mb-4">{item.statLabel}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Projeniı İçin Ücretsiz Teklif Al
            </h2>
            <p className="text-xl mb-8 text-red-100">
              Uzman ekibimiz size özel çözüm sunmak için hazır.
              Hemen iletişime geçin!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
            >
              İletişime Geç
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;