'use client';

import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import {
  FlaskConical, Users, ShoppingBasket, CheckCircle,
  ArrowRight, Leaf, Shield, TrendingUp, Clock,
  MapPin, FileText, Star, Sparkles, Globe
} from 'lucide-react';

const FEATURE_SECTIONS = [
  {
    tag: 'Soil Testing',
    icon: <FlaskConical size={26} className="text-primary-700" />,
    badgeBg: 'bg-primary-50 text-primary-800 border-primary-200',
    title: 'Precision Soil Testing — Decoded.',
    sub: 'Stop guessing fertiliser amounts. Get certified laboratory soil diagnostics delivered to your phone in 5 days.',
    points: [
      { icon: <MapPin size={18} className="text-primary-600" />, title: 'Nearest NABL Partner Lab', desc: 'Matched automatically to certified district testing facilities with sample pickup.' },
      { icon: <FileText size={18} className="text-primary-600" />, title: 'Detailed NPK & pH Metrics', desc: 'Accurate Nitrogen, Phosphorus, Potassium, Organic Carbon, and Micronutrient levels.' },
      { icon: <Globe size={18} className="text-primary-600" />, title: 'Multilingual Digital Reports', desc: 'Read your diagnostic report in Hindi, Punjabi, Marathi, Telugu, or English.' },
      { icon: <Clock size={18} className="text-primary-600" />, title: 'Guaranteed 5-Day SLA', desc: 'From sample collection to digital dashboard notification in 5 business days.' },
      { icon: <TrendingUp size={18} className="text-primary-600" />, title: 'Crop-Specific Dosing', desc: 'Tailored fertiliser schedule to optimize root absorption and prevent soil toxicity.' },
      { icon: <Shield size={18} className="text-primary-600" />, title: 'Accredited Quality Standard', desc: 'Standardized protocols ensuring reliable accuracy for every tested acre.' },
    ],
    ctaText: 'Book a Soil Test',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Agricultural Soil Laboratory Testing',
    reverse: false,
  },
  {
    tag: 'Soil-Mitra Advisory',
    icon: <Users size={26} className="text-amber-700" />,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Expert Agronomist Guidance — On Demand.',
    sub: 'Connect with verified agricultural officers and crop scientists whenever you face disease, pests, or nutrient deficiency.',
    points: [
      { icon: <Users size={18} className="text-amber-600" />, title: '1-on-1 Video Consultations', desc: 'Private video sessions directly from your field with verified crop doctors.' },
      { icon: <FileText size={18} className="text-amber-600" />, title: 'Live Report Sharing', desc: 'Share your soil test history inside the call for instant data-driven advice.' },
      { icon: <Star size={18} className="text-amber-600" />, title: 'Verified & Rated Experts', desc: 'Browse credentials, specializations, degrees, and community ratings.' },
      { icon: <Globe size={18} className="text-amber-600" />, title: 'Regional Dialects', desc: 'Speak to agronomists who understand your local soil and climate nuances.' },
      { icon: <Clock size={18} className="text-amber-600" />, title: 'Flexible Scheduling', desc: 'Book morning, afternoon, or evening slots fitting your farming routine.' },
      { icon: <Shield size={18} className="text-amber-600" />, title: 'Follow-Up Treatment Plans', desc: 'Receive structured treatment summaries after each completed consultation.' },
    ],
    ctaText: 'Consult an Expert',
    image: 'https://images.unsplash.com/photo-1595804368593-cc43ba2986f3?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Expert Farmer Video Consultation',
    reverse: true,
  },
  {
    tag: 'Residue Marketplace',
    icon: <ShoppingBasket size={26} className="text-emerald-700" />,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Turn Stubble Into Guaranteed Income.',
    sub: 'Stop burning crop residue. Sell paddy straw, wheat straw, and sugarcane bagasse to certified bio-pellet plants.',
    points: [
      { icon: <TrendingUp size={18} className="text-emerald-600" />, title: 'Fair Market Index Pricing', desc: 'Transparent rate models guarantee competitive returns for every metric ton.' },
      { icon: <MapPin size={18} className="text-emerald-600" />, title: 'Doorstep Pickup Logistics', desc: 'Industrial buyers coordinate transport directly from your farm perimeter.' },
      { icon: <Clock size={18} className="text-emerald-600" />, title: 'Direct Bank Settlement', desc: 'Secure payouts credited directly to your bank account within 7 days of pickup.' },
      { icon: <FileText size={18} className="text-emerald-600" />, title: 'All Biomass Types Supported', desc: 'Paddy straw, wheat straw, mustard husk, sugarcane trash, and cotton stalk.' },
      { icon: <Shield size={18} className="text-emerald-600" />, title: 'Digital Procurement Slips', desc: 'Every transaction is digitally authenticated with weight slips and receipts.' },
      { icon: <Globe size={18} className="text-emerald-600" />, title: 'Clean Air & Carbon Savings', desc: 'Prevent air pollution and receive verified certificates for clean farm practices.' },
    ],
    ctaText: 'List Residue For Sale',
    image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Biomass and Crop Residue Management',
    reverse: false,
  },
];

export default function FeaturesPage() {
  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="section-label mb-6">
            <Sparkles size={14} />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Built for the Modern <br />
            <span className="text-emerald">Indian Farmer.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every feature on FarmHith is designed to eliminate uncertainty, protect your soil health, and maximize seasonal agricultural profitability.
          </p>
        </div>
      </section>

      {/* ═══════════════ FEATURE BREAKDOWN ════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {FEATURE_SECTIONS.map((sec) => (
          <section
            key={sec.tag}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${sec.reverse ? 'lg:grid-flow-dense' : ''}`}
          >
            {/* Image Column */}
            <div className={`relative ${sec.reverse ? 'lg:col-start-2' : ''}`}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <img
                  src={sec.image}
                  alt={sec.imageAlt}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className={`space-y-6 ${sec.reverse ? 'lg:col-start-1' : ''}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-700">
                {sec.icon}
                <span>{sec.tag}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {sec.title}
              </h2>

              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {sec.sub}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {sec.points.map((p) => (
                  <div key={p.title} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                      {p.icon}
                      <span>{p.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="btn-primary-sm"
                  style={{ display: 'inline-flex', padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
                >
                  {sec.ctaText} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ═══════════════ FINAL CTA ═══════════════════════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to modernize your farm?</h2>
          <p className="cta-sub">Create your free account today and access all certified agricultural services.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn-outline-lg">
              Already Registered? Log in
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
