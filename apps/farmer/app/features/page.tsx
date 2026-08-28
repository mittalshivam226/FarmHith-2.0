'use client';

import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import {
  FlaskConical, Users, ShoppingBasket, CheckCircle,
  ArrowRight, Leaf, Shield, TrendingUp, Clock,
  MapPin, FileText, Star, Zap, Globe,
} from 'lucide-react';
import { CursorGlow } from '../components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from '../components/Animations';
import { motion } from 'framer-motion';

const FEATURE_SECTIONS = [
  {
    tag: 'Soil Testing',
    icon: <FlaskConical size={28} />,
    color: 'text-success-400',
    bgColor: 'bg-success-500/10',
    borderColor: 'border-success-500/30',
    title: 'Precision Soil Testing — Decoded.',
    sub: 'No more guesswork. Get lab-certified, crop-specific soil analysis in days, not weeks.',
    points: [
      { icon: <MapPin size={18} />, title: 'Nearest NABL Lab', desc: 'We match you to the closest certified lab in your district — no travel needed.' },
      { icon: <FileText size={18} />, title: 'Detailed NPK Reports', desc: 'pH, Nitrogen, Phosphorus, Potassium, micronutrients — everything in one structured report.' },
      { icon: <Globe size={18} />, title: 'Multilingual Results', desc: 'Get your results in Hindi, Punjabi, Marathi, Telugu, or English. Your language, your way.' },
      { icon: <Clock size={18} />, title: 'Delivered in 5 Days', desc: 'From sample collection to digital report — 5 working days, guaranteed.' },
      { icon: <TrendingUp size={18} />, title: 'Crop Recommendations', desc: 'Every report includes a tailored fertiliser plan for your exact crop and soil profile.' },
      { icon: <Shield size={18} />, title: 'NABL Certified Labs', desc: "All partner labs are NABL-accredited and verified by FarmHith's quality team." },
    ],
    cta: '/register',
    ctaText: 'Book Your First Test',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1000&auto=format&fit=crop', // Dark lab test image
  },
  {
    tag: 'Soil-Mitra Consultations',
    icon: <Users size={28} />,
    color: 'text-warning-400',
    bgColor: 'bg-warning-500/10',
    borderColor: 'border-warning-500/30',
    title: 'Expert Guidance — On Demand.',
    sub: 'Talk to a verified agricultural expert whenever you need help. No waiting rooms. No travel.',
    points: [
      { icon: <Users size={18} />, title: '1-on-1 Video Calls', desc: 'Book private sessions with certified agronomists and agriculture officers.' },
      { icon: <FileText size={18} />, title: 'Share Soil Reports Live', desc: 'Send your lab report directly in the session — get instant, data-backed advice.' },
      { icon: <Star size={18} />, title: 'Verified & Rated Experts', desc: 'Every Mitra is background-checked, certified, and community-rated for quality.' },
      { icon: <Globe size={18} />, title: 'Multilingual Sessions', desc: 'Choose your Mitra based on language expertise — no language barrier ever.' },
      { icon: <Clock size={18} />, title: 'Flexible Scheduling', desc: 'Book morning, afternoon, or evening slots that fit your farm schedule.' },
      { icon: <Shield size={18} />, title: 'Admin-Verified Mitras', desc: 'Every Soil-Mitra is manually verified by FarmHith admins before going live.' },
    ],
    cta: '/register',
    ctaText: 'Find Your Mitra',
    image: 'https://images.unsplash.com/photo-1595804368593-cc43ba2986f3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Residue Marketplace',
    icon: <ShoppingBasket size={28} />,
    color: 'text-info-400',
    bgColor: 'bg-info-500/10',
    borderColor: 'border-info-500/30',
    title: 'Turn Stubble Into Income.',
    sub: 'Stop burning. Start earning. Connect with bio-pellet plants that want exactly what your field produces.',
    points: [
      { icon: <TrendingUp size={18} />, title: 'Best Market Prices', desc: 'FarmHith-assured pricing means you always get a fair, transparent rate for your residue.' },
      { icon: <MapPin size={18} />, title: 'Free Pickup Logistics', desc: 'We coordinate pickup directly from your field — no transport costs on your end.' },
      { icon: <Clock size={18} />, title: 'Same-Week Payment', desc: 'Funds transferred to your registered bank account within 7 days of pickup.' },
      { icon: <FileText size={18} />, title: 'All Residue Types', desc: 'Paddy straw, wheat straw, sugarcane bagasse, cotton stalks — all welcome.' },
      { icon: <Shield size={18} />, title: 'Secure Contracts', desc: 'Every transaction is backed by a platform agreement — no payment risk.' },
      { icon: <Globe size={18} />, title: 'Eco Contribution', desc: 'Track your CO₂ savings and contribute to cleaner air in your region.' },
    ],
    cta: '/register',
    ctaText: 'Start Selling',
    image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function FeaturesPage() {
  return (
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen">
      <CursorGlow />
      <WebsiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8">
              <Leaf size={14} />
              <span>Platform Features</span>
            </div>
          </FadeIn>
          <StaggerText 
            text="Built for the Modern Indian Farmer." 
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" 
            delay={0.1}
          />
          <FadeIn delay={0.4}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Three deeply integrated services — each solving a real problem, together transforming how India farms.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Feature Sections */}
      {FEATURE_SECTIONS.map((f, i) => (
        <section key={f.tag} className={`py-24 px-6 border-b border-slate-800 ${i % 2 === 1 ? 'bg-slate-900/50' : 'bg-slate-950'}`}>
          <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Image Side */}
            <div className="flex-1 w-full">
              <ZoomIn>
                <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square border border-slate-700 shadow-2xl group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url(${f.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className={`absolute inset-0 ${f.bgColor} mix-blend-overlay`} />
                </div>
              </ZoomIn>
            </div>

            {/* Content Side */}
            <div className="flex-1 space-y-8">
              <SlideIn direction={i % 2 === 1 ? 'right' : 'left'}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${f.borderColor} ${f.bgColor} ${f.color} text-sm font-semibold tracking-wider mb-2`}>
                  {f.icon} {f.tag}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">{f.title}</h2>
              </SlideIn>
              
              <SlideIn direction={i % 2 === 1 ? 'right' : 'left'} delay={0.2}>
                <p className="text-lg text-slate-400 leading-relaxed">{f.sub}</p>
              </SlideIn>

              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                {f.points.map((p, idx) => (
                  <FadeIn key={p.title} delay={0.3 + (idx * 0.1)}>
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center gap-2 font-bold ${f.color}`}>
                        {p.icon}
                        <span>{p.title}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <SlideIn direction={i % 2 === 1 ? 'right' : 'left'} delay={0.6}>
                <Link href={f.cta} className={`inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700 hover:border-slate-600 shadow-glow-sm`}>
                  {f.ctaText} <ArrowRight size={18} />
                </Link>
              </SlideIn>
            </div>

          </div>
        </section>
      ))}

      {/* Comparison strip */}
      <section className="py-24 px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-primary-500/5 mix-blend-screen pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Zap size={14} className="text-primary-400" /> Why FarmHith
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              The old way vs. <span className="text-primary-400">the FarmHith way.</span>
            </h2>
          </FadeIn>
          
          <div className="space-y-4">
            {[
                { old: 'Travel 30 km to a government lab', new: 'Book online, get sample collected at your field' },
                { old: 'Wait 6–8 weeks for test results', new: 'Digital report delivered in 5 days' },
                { old: 'Burn stubble and pay fines', new: 'Sell residue and earn money' },
                { old: 'Hope your neighbour knows the right crop advice', new: 'Video call a verified expert in your language' },
                { old: 'No record of your farm history', new: 'Full digital history on your dashboard' },
                { old: 'Payment delays for crop transactions', new: 'Bank transfer within 7 days' },
            ].map((c, i) => (
              <SlideIn key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className="flex flex-col sm:flex-row gap-4 bg-slate-950 p-6 rounded-xl border border-slate-800 items-center justify-between hud-element hover:border-primary-500/30 transition-colors">
                    <div className="flex-1 text-slate-500 flex items-center gap-3">
                        <span className="text-error-500">❌</span> 
                        <span className="line-through">{c.old}</span>
                    </div>
                    <div className="flex-1 text-slate-100 flex items-center gap-3 font-semibold">
                        <CheckCircle size={20} className="text-success-500 shrink-0" /> 
                        {c.new}
                    </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden text-center bg-slate-950">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Leaf size={14} className="text-primary-400" /> Get Started
            </div>
            <h2 className="text-5xl font-black text-white mb-8">
              Ready to farm smarter?<br /><span className="text-primary-400">It&apos;s free to join.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-400 transition-all shadow-glow-md">
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-700 transition-all">
                Already a member? Log in
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
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
