'use client';
import React from 'react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { CursorGlow } from '../components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from '../components/Animations';

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
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen">
      <CursorGlow />
      <WebsiteNav />

      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8">
              <BookOpen size={14} />
              <span>Educational Resources</span>
            </div>
          </FadeIn>
          <StaggerText 
            text="FarmHith Insights" 
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" 
            delay={0.1}
          />
          <FadeIn delay={0.4}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Expert advice, farming tips, and platform updates to help you grow better.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <ZoomIn key={i} delay={i * 0.15}>
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-glow-sm hover:border-primary-500/30 transition-all flex flex-col group cursor-pointer h-full hud-element">
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-primary-400 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-primary-500/30 shadow-glow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-primary-400 transition-colors">{post.title}</h3>
                  <p className="text-slate-400 font-medium mb-8 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary-400" /> {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary-400" /> {post.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </ZoomIn>
          ))}
        </div>

        <FadeIn delay={0.6} className="mt-20 text-center">
          <button onClick={() => alert('More articles are currently being written. Check back soon!')} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-700 transition-all shadow-glow-sm">
            Load More Articles <ArrowRight size={18} />
          </button>
        </FadeIn>
      </section>
    </div>
  );
}
