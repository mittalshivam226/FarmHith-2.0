'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, User, ArrowRight, Sparkles, Tag, Search } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const POSTS = [
  {
    title: 'The Real Economics of Stubble: Stop Burning, Start Monetizing',
    excerpt: 'How selling paddy and wheat straw to bio-pellet plants through FarmHith adds tens of thousands to seasonal farm income while combating smog.',
    category: 'Stubble Monetization',
    readTime: '5 min read',
    author: 'FarmHith Agronomy Desk',
    date: 'May 12, 2024',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    title: 'Decoding Your Soil Test Report: A Farmer\'s Guide to NPK & pH',
    excerpt: 'Nitrogen, Phosphorus, Potassium, Organic Carbon, and Micronutrients explained with empirical guidance on eliminating fertilizer wastage.',
    category: 'Soil Science',
    readTime: '8 min read',
    author: 'Dr. Amit Sharma (Senior Agronomist)',
    date: 'April 28, 2024',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Tele-Agronomy in Action: How 1-on-1 Video Calls Save Harvests',
    excerpt: 'How certified agriculture officers use live video calls and historical diagnostic reports to stop pest outbreaks before they destroy harvest yields.',
    category: 'Expert Advisory',
    readTime: '4 min read',
    author: 'Neha Verma (Field Operations)',
    date: 'April 15, 2024',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Preparing Your Soil for Kharif Sowing: Micro-Nutrient Strategy',
    excerpt: 'Essential pre-sowing soil management guidelines to enhance water retention and maximize root nodule formation.',
    category: 'Seasonal Guides',
    readTime: '6 min read',
    author: 'Dr. Vikramaditya Sharma',
    date: 'March 30, 2024',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
];

const CATEGORIES = ['All Topics', 'Soil Science', 'Stubble Monetization', 'Expert Advisory', 'Seasonal Guides'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return POSTS.filter((post) => {
      const matchesCat = selectedCategory === 'All Topics' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="landing-root bg-[#fbfdfa] text-slate-900">
      <WebsiteNav />

      {/* Ambient background light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-100/35 blur-[140px]" />
      </div>

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative z-10 pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles size={14} /> Agricultural Research & Knowledge
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          FarmHith Agronomy & <br />
          <span className="text-gradient-emerald">Market Insights.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
          Practical farming guides, residue monetization strategies, and seasonal advice from certified crop doctors.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════ BLOG GRID ═══════════════════════════ */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary-800 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg border border-primary-200 shadow-sm flex items-center gap-1">
                  <Tag size={12} /> {post.category}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                    <User size={14} className="text-primary-600 shrink-0" />
                    <span className="truncate">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock size={14} className="text-primary-600" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-20 bg-gradient-to-r from-emerald-900 to-primary-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl max-w-4xl mx-auto border border-emerald-500/30">
          <h3 className="text-2xl sm:text-3xl font-black mb-3">Want agronomy alerts delivered to your phone?</h3>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Create your free farmer account to receive crop disease alerts, seasonal dosing guides, and live stubble market updates.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-emerald-950 font-extrabold text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-105"
          >
            <span>Register Free on FarmHith</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ══════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
