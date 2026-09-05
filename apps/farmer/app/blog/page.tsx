'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, User, ArrowRight, Sparkles, Leaf, Tag } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

export default function BlogPage() {
  const posts = [
    {
      title: 'The Real Value of Crop Residue: Stop Burning, Start Earning',
      excerpt: 'Discover how selling your paddy and wheat straw to bio-pellet plants through FarmHith can add tens of thousands to seasonal farm income while combating smog.',
      category: 'Marketplace',
      readTime: '5 min read',
      author: 'FarmHith Agronomy Desk',
      date: 'May 12, 2024',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Understanding Your Soil Test Report: A Farmer\'s Guide to NPK & pH',
      excerpt: 'Nitrogen, Phosphorus, Potassium, Organic Carbon, and Micronutrients explained in simple terms with precise guidance on avoiding fertilizer wastage.',
      category: 'Soil Testing',
      readTime: '8 min read',
      author: 'Dr. Amit Sharma (Senior Agronomist)',
      date: 'April 28, 2024',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Meet the Soil-Mitras: How Tele-Agronomy Solves Crop Crises',
      excerpt: 'How certified agriculture officers use live video calls and historical diagnostic reports to stop pest outbreaks before they destroy harvest yields.',
      category: 'Expert Advisory',
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

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="section-label mb-6">
            <Sparkles size={14} />
            <span>Educational Resources</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            FarmHith Agronomy & <br />
            <span className="text-emerald">Market Insights.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Practical agricultural guides, residue monetization strategies, and seasonal advice from certified crop doctors.
          </p>
        </div>
      </section>

      {/* ═══════════════ BLOG GRID ═══════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary-800 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md border border-primary-200 shadow-sm flex items-center gap-1">
                  <Tag size={12} /> {post.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
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

        {/* Newsletter / Registration Prompt */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center shadow-sm max-w-3xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 mb-5">
            <BookOpen size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Want new farming guides sent to your phone?</h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Register your farmer account today to receive seasonal pest alerts, crop advisories, and updated residue market prices.
          </p>
          <Link href="/register" className="btn-primary-sm" style={{ display: 'inline-flex', padding: '0.75rem 1.75rem' }}>
            Join FarmHith Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ══════════════════════════════ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon"><Leaf size={20} /></div>
              <span className="logo-text">FarmHith</span>
            </div>
            <p className="footer-tagline">Empowering Indian farmers with scientific precision, expert advisory, and sustainable biomass revenue.</p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-heading">Services</p>
              <Link href="/register" className="footer-link">Soil Testing</Link>
              <Link href="/register" className="footer-link">Soil-Mitra Advisory</Link>
              <Link href="/register" className="footer-link">Residue Marketplace</Link>
            </div>
            <div>
              <p className="footer-heading">Company</p>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/features" className="footer-link">Features</Link>
              <Link href="/blog" className="footer-link">Blog</Link>
              <Link href="/faq" className="footer-link">FAQs</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
            <div>
              <p className="footer-heading">Account</p>
              <Link href="/register" className="footer-link">Register</Link>
              <Link href="/login" className="footer-link">Login</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
