'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

export default function BlogPage() {
  const posts = [
    {
      title: 'The Real Value of Crop Residue: Stop Burning, Start Earning',
      excerpt: 'Discover how selling your paddy straw to Bio-Pellet plants through FarmHith can increase your seasonal earnings and protect the environment.',
      category: 'Marketplace',
      readTime: '5 min read',
      author: 'FarmHith Team',
      date: 'May 12, 2024',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Understanding Your Soil Test Report: A Beginner\'s Guide',
      excerpt: 'NPK? pH? Organic Carbon? We break down exactly what your laboratory soil test means and how to apply the recommended fertilisers.',
      category: 'Soil Testing',
      readTime: '8 min read',
      author: 'Dr. Amit Sharma',
      date: 'April 28, 2024',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Meet the Soil-Mitras: Revolutionizing Digital Agriculture',
      excerpt: 'Learn how verified agricultural experts are using video consultations to solve real-time farm crises across India.',
      category: 'Expert Advice',
      readTime: '4 min read',
      author: 'Neha Verma',
      date: 'April 15, 2024',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      <section className="section" style={{ paddingTop: '12rem', paddingBottom: '4rem' }}>
        <div className="section-label"><BookOpen size={14} /> Educational Resources</div>
        <h1 className="section-title">FarmHith <span className="text-emerald">Insights</span></h1>
        <p className="section-sub">Expert advice, farming tips, and platform updates to help you grow better.</p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-10">
          {posts.map((post, i) => (
            <div key={i} className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col group cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-[#f2f0eb] text-[#006064] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[#D2B48C]">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#00838F] transition-colors">{post.title}</h3>
                <p className="text-gray-600 font-medium mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={14} /> {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {post.readTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button onClick={() => alert('More articles are currently being written. Check back soon!')} className="btn-outline-lg inline-flex justify-center text-lg">
            Load More Articles
          </button>
        </div>
      </section>
    </div>
  );
}
