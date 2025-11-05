import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '../mock';

const Blog = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Yangın güvenliği hakkında bilgilendirici yazılar ve güncel haberler
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Featured Post */}
        <div className="mb-16">
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="aspect-video md:aspect-auto overflow-hidden bg-gray-100">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-medium mb-4 w-fit">
                {featuredPost.category}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-200">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(featuredPost.date).toLocaleDateString('tr-TR')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {featuredPost.readTime}
                </div>
              </div>
              <div className="inline-flex items-center text-red-600 font-semibold group-hover:text-red-700">
                Devamını Oku
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        </div>

        {/* Other Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <div className="inline-flex items-center text-red-600 font-semibold group-hover:text-red-700">
                  Devamını Oku
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;