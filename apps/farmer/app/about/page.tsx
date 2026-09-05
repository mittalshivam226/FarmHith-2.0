'use client';

import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import { Leaf, Target, Heart, Zap, Users, Globe, ArrowRight, CheckCircle, Award, Sparkles } from 'lucide-react';

const TEAM = [
  {
    name: 'Shivam Mittal',
    role: 'Founder & CEO',
    avatar: 'SM',
    color: 'text-primary-800',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    bio: 'Building scalable agricultural technology that solves on-ground bottlenecks for Indian farming communities.'
  },
  {
    name: 'Agronomy & Research Team',
    role: 'Soil Science & ML',
    avatar: 'AR',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    bio: 'Developing specialized diagnostic models calibrated for Indian soil varieties across 22 agro-climatic zones.'
  },
  {
    name: 'Field Operations Network',
    role: 'Lab & Logistics',
    avatar: 'FO',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bio: 'Coordinating a verified network of 2,800+ Soil-Mitras and 600+ NABL-certified testing laboratories.'
  },
];

const VALUES = [
  {
    icon: <Target size={24} className="text-primary-700" />,
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    title: 'Farmer First',
    desc: 'Every feature and policy begins with one fundamental question: does this tangibly enhance farmer prosperity and yields?'
  },
  {
    icon: <Heart size={24} className="text-amber-700" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'Rooted in Indian Soil',
    desc: 'Purpose-built for regional languages, local crop varieties, and smallholder farming economics across Indian states.'
  },
  {
    icon: <Zap size={24} className="text-emerald-700" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'Data & Science Backed',
    desc: 'Every recommendation is backed by NABL accredited lab diagnostics and certified agronomy research.'
  },
  {
    icon: <Globe size={24} className="text-teal-700" />,
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    title: 'Environmental Sustainability',
    desc: 'Eliminating hazardous crop residue burning by converting biomass into valuable bio-pellet feedstock and clean energy.'
  },
];

export default function AboutPage() {
  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      {/* ═══════════════ MISSION HERO ════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="section-label mb-6">
            <Sparkles size={14} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Farming is India&apos;s backbone.<br />
            <span className="text-emerald">We&apos;re here to strengthen it.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FarmHith bridges the gap between world-class agricultural science and Indian farmers. We turn slow lab processes into 5-day digital answers, and burning stubble into guaranteed farm income.
          </p>
        </div>
      </section>

      {/* ═══════════════ OUR STORY ════════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-4">
              <Leaf size={14} /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
              Started with a soil test that took <span className="text-emerald">8 weeks.</span>
            </h2>
            <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>
                In 2023, while visiting farming communities across Punjab and Haryana, we saw farmers burning paddy straw not out of choice, but due to severe market and logistics barriers. The nearest testing lab was over 40 km away, required paper applications, and returned incomprehensible results weeks after sowing season.
              </p>
              <p>
                FarmHith was created to solve this end-to-end: doorstep sample pickup, a 5-day SLA guarantee, clear multilingual reports, live expert video advisory, and direct bio-pellet marketplace monetization.
              </p>
              <p className="font-semibold text-slate-800">
                Today, FarmHith supports over 50,000 farmers across 18 states, partnering with 600+ accredited labs and distributing crores in stubble procurement revenue.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '50,000+', label: 'Registered Farmers' },
              { value: '18', label: 'Indian States' },
              { value: '600+', label: 'NABL Accredited Labs' },
              { value: '₹8 Cr+', label: 'Stubble Payouts' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl font-black text-primary-700 mb-2">{s.value}</div>
                <div className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES ══════════════════════════════ */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="section-label mb-4">
              <Heart size={14} /> Core Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Principles guiding <span className="text-emerald">everything we do.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 p-7 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className={`w-12 h-12 rounded-xl ${v.bg} ${v.border} border flex items-center justify-center mb-6`}>
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ════════════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-label mb-4">
            <Users size={14} /> Leadership & Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Passionate minds behind <span className="text-emerald">FarmHith.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map((m) => (
            <div key={m.name} className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
              <div className={`w-16 h-16 mx-auto rounded-full ${m.bg} ${m.border} border flex items-center justify-center mb-5 font-black text-xl ${m.color}`}>
                {m.avatar}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{m.name}</h3>
              <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${m.color}`}>{m.role}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA ═════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Join us in building a better farm.</h2>
          <p className="cta-sub">Free registration. Instant access to certified soil labs and verified agronomists.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link href="/features" className="btn-outline-lg">
              Explore All Features
            </Link>
          </div>
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
            <p className="footer-tagline">Empowering Indian farmers with technology, expertise, and fair markets.</p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-heading">Services</p>
              <Link href="/register" className="footer-link">Soil Testing</Link>
              <Link href="/register" className="footer-link">Soil-Mitra</Link>
              <Link href="/register" className="footer-link">Residue Market</Link>
            </div>
            <div>
              <p className="footer-heading">Company</p>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/features" className="footer-link">Features</Link>
              <Link href="/blog" className="footer-link">Blog</Link>
              <Link href="/faq" className="footer-link">FAQ</Link>
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
