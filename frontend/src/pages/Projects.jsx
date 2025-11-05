import React from 'react';
import { projects } from '../mock';
import { Calendar, Building2, CheckCircle } from 'lucide-react';

const Projects = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Projelerimiz</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Gerçekleştirdiğimiz başarılı yangın güvenliği projeleri
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '500+', label: 'Tamamlanan Proje' },
              { number: '1000+', label: 'Mutlu Müşteri' },
              { number: '30+', label: 'Yıllık Tecrübe' },
              { number: '100%', label: 'Başarı Oranı' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-red-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.year}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
                  {project.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">{project.client}</span>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Özellikler:</h4>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Siz de Projenizi Gerçekleştirelim
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            30 yıllık tecrübemizle projenize en uygun çözümü sunuyoruz.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg"
          >
            Projeniz İçin Teklif Alın
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;