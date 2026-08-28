'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  FlaskConical, Users, ArrowRight,
  Leaf, Shield, TrendingUp, Star, ChevronRight,
  CheckCircle, Award
} from 'lucide-react';
import WebsiteNav from './components/WebsiteNav';
import { CursorGlow } from './components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from './components/Animations';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === 'FARMER') router.replace('/dashboard');
  }, [user, isLoading, router]);

  if (isLoading || user?.role === 'FARMER') return null;

  const testimonials = [
    {
      name: 'Ramesh Kumar', location: 'Ludhiana, Punjab', crop: 'Wheat & Paddy', stars: 5,
      text: 'Maine paddy straw se ₹18,000 kamaye jo pehle main jala deta tha. FarmHith ne meri soch badal di.',
      avatar: 'RK',
    },
    {
      name: 'Sunita Devi', location: 'Nashik, Maharashtra', crop: 'Sugarcane', stars: 5,
      text: 'Soil-Mitra se baat ki, unhone exact fertiliser bataya. Is season yield 40% badh gayi. Bahut shukriya!',
      avatar: 'SD',
    },
    {
      name: 'Gurpreet Singh', location: 'Amritsar, Punjab', crop: 'Cotton', stars: 5,
      text: 'Soil test report se pata chala ki mere khet mein zinc ki kami hai. Lab report was so detailed and helpful.',
      avatar: 'GS',
    },
    {
      name: 'Vikram Patel', location: 'Surat, Gujarat', crop: 'Groundnut', stars: 5,
      text: 'FarmHith has completely digitized how I manage my soil. The Mitras are very knowledgeable.',
      avatar: 'VP',
    }
  ];

  return (
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen selection:bg-primary-500/30 selection:text-primary-100 relative">
      <CursorGlow />
      <WebsiteNav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        {/* Cinematic Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="cyber-grid opacity-30" />
        </motion.div>

        <div className="relative z-10 max-w-6xl w-full mx-auto text-center flex flex-col items-center">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8 backdrop-blur-md">
              <Leaf size={16} />
              <span>The Future of Indian Agriculture</span>
            </div>
          </FadeIn>

          <StaggerText 
            text="Farming upgraded for the digital age." 
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-tight max-w-5xl" 
            delay={0.1}
          />

          <FadeIn delay={0.6}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your field into a living data interface. Book certified soil tests, consult with expert Soil-Mitras, and sell crop residue effortlessly.
            </p>
          </FadeIn>

          <FadeIn delay={0.8} className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-400 transition-all shadow-glow-md hover:shadow-glow-lg group">
              Enter Platform <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-700 hover:border-slate-600 transition-all">
              Discover Features
            </a>
          </FadeIn>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-10 border-y border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800">
          {[
            { value: '50K+', label: 'Active Farmers' },
            { value: '120+', label: 'NABL Certified Labs' },
            { value: '₹4.2Cr', label: 'Residue Traded' },
            { value: '98%', label: 'Success Rate' },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1} className="p-8 text-center hud-element">
              <div className="text-4xl md:text-5xl font-black text-primary-400 mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Precision Workflow</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Data-driven agriculture made simple in three seamless steps.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Connect', desc: 'Create your digital profile in under 2 minutes.', icon: <Shield size={32} /> },
              { num: '02', title: 'Analyze', desc: 'Book a soil test or find an expert for precise insights.', icon: <FlaskConical size={32} /> },
              { num: '03', title: 'Optimize', desc: 'Act on data to increase yield and monetize crop residue.', icon: <TrendingUp size={32} /> },
            ].map((step, i) => (
              <SlideIn key={step.num} delay={i * 0.2} direction="left" className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-primary-500/30 transition-all duration-300 hud-element h-full">
                  <div className="text-primary-500/20 font-black text-6xl absolute top-4 right-6 group-hover:text-primary-500/40 transition-colors">
                    {step.num}
                  </div>
                  <div className="text-primary-400 mb-6 bg-primary-500/10 w-16 h-16 rounded-xl flex items-center justify-center border border-primary-500/20 shadow-glow-sm">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ZoomIn>
              <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px] border border-slate-700 shadow-2xl group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-glow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center border border-success-500/30">
                        <CheckCircle className="text-success-400" size={24} />
                      </div>
                      <div>
                        <div className="text-white font-bold">Soil Analysis Complete</div>
                        <div className="text-slate-400 text-sm">Nitrogen levels optimal</div>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-primary-500 shadow-glow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ZoomIn>
            
            <div className="space-y-8">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">
                  <Award size={14} className="text-primary-400" /> Premium Quality
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Intelligent insights for <br/><span className="text-primary-400">maximum yield.</span>
                </h2>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-lg text-slate-400 leading-relaxed">
                  We combine traditional agricultural wisdom with modern technology to deliver the best results for your farm. Easy to use, fully transparent, and always focused on your growth.
                </p>
              </FadeIn>

              <div className="space-y-4">
                {[
                  'Real-time tracking of soil test reports',
                  'Transparent pricing for crop residue',
                  'Verified network of expert Soil-Mitras'
                ].map((item, i) => (
                  <SlideIn key={i} delay={0.3 + (i * 0.1)} direction="right" className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                      <CheckCircle size={16} className="text-primary-400" />
                    </div>
                    <span className="text-white font-medium">{item}</span>
                  </SlideIn>
                ))}
              </div>

              <FadeIn delay={0.6}>
                <Link href="/features" className="inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700 hover:border-slate-600">
                  Explore All Features <ArrowRight size={18} />
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 border-y border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Farmer Stories</h2>
            <p className="text-lg text-slate-400">Real results from across the nation.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <ZoomIn key={idx} delay={idx * 0.15}>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col hover:border-primary-500/30 hover:shadow-glow-sm transition-all duration-300">
                  <div className="flex gap-1 mb-4 text-secondary-400">
                    {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-300 italic mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400 font-bold border border-slate-700">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-slate-500 text-xs">{t.crop} &bull; {t.location}</div>
                    </div>
                  </div>
                </div>
              </ZoomIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5" />
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Initialize Your Digital Farm</h2>
            <p className="text-xl text-slate-400 mb-10">Join thousands of farmers maximizing their yield with data-driven insights.</p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-400 transition-all shadow-glow-md">
              Create Free Account <ArrowRight size={20} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Leaf className="text-primary-400" /> FarmHith
            </div>
            <p className="text-slate-500 text-sm">Empowering Indian farmers with technology, expertise, and fair markets.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <div className="space-y-2 flex flex-col text-sm">
              <Link href="/dashboard/soil-test" className="text-slate-400 hover:text-primary-400 transition-colors">Soil Testing</Link>
              <Link href="/dashboard/mitra" className="text-slate-400 hover:text-primary-400 transition-colors">Soil-Mitra</Link>
              <Link href="/dashboard/marketplace" className="text-slate-400 hover:text-primary-400 transition-colors">Residue Market</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 flex flex-col text-sm">
              <Link href="/about" className="text-slate-400 hover:text-primary-400 transition-colors">About Us</Link>
              <Link href="/features" className="text-slate-400 hover:text-primary-400 transition-colors">Features</Link>
              <Link href="/blog" className="text-slate-400 hover:text-primary-400 transition-colors">Blog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <div className="space-y-2 flex flex-col text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-primary-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
