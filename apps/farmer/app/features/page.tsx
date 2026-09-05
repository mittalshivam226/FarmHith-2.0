'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import {
  FlaskConical, Users, ShoppingBasket, CheckCircle2,
  ArrowRight, Leaf, Shield, TrendingUp, Clock,
  MapPin, FileText, Star, Sparkles, Globe, Award
} from 'lucide-react';

const TABS = [
  {
    id: 'soil-test',
    label: 'Soil Testing Network',
    icon: <FlaskConical size={18} />,
    title: 'Precision Laboratory Diagnostics in 5 Days.',
    sub: 'Stop applying random fertiliser amounts. Get empirical NPK and micronutrient diagnostics with geo-tagged sample collection and crop-specific dosing.',
    points: [
      { title: '600+ Partner NABL Labs', desc: 'ISO/IEC 17025 accredited district testing centers.' },
      { title: 'Full 14-Parameter Panel', desc: 'pH, EC, Organic Carbon, Nitrogen, Phosphorus, Potassium, Zinc, Iron, and Copper.' },
      { title: '5-Day Guaranteed SLA', desc: 'SMS alert and PDF report on your phone within 5 business days.' },
      { title: 'Multilingual Recommendations', desc: 'Easy-to-follow fertiliser prescriptions in Punjabi, Hindi, Marathi, and Telugu.' },
    ],
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
    cta: '/register',
    ctaText: 'Book a Soil Test',
  },
  {
    id: 'mitra',
    label: 'Soil-Mitra Advisory',
    icon: <Users size={18} />,
    title: '1-on-1 Tele-Agronomy with Certified Experts.',
    sub: 'Direct video consultations with university agronomists, crop scientists, and retired agriculture officers whenever pest infestations or disease strike.',
    points: [
      { title: 'Verified Degrees & Certifications', desc: 'All Mitras hold B.Sc, M.Sc, or Ph.D in Agricultural Sciences.' },
      { title: 'Live Report Sharing in Video Room', desc: 'Review historical soil test results live during the consultation call.' },
      { title: 'Regional Dialect Matching', desc: 'Consult in your native language with zero communication friction.' },
      { title: 'Follow-Up Dosage Prescriptions', desc: 'Download structured post-call treatment plans directly to your dashboard.' },
    ],
    image: 'https://images.unsplash.com/photo-1595804368593-cc43ba2986f3?q=80&w=1200&auto=format&fit=crop',
    cta: '/register',
    ctaText: 'Find an Expert',
  },
  {
    id: 'marketplace',
    label: 'Residue Marketplace',
    icon: <ShoppingBasket size={18} />,
    title: 'Guaranteed Stubble Buyback & Zero-Burning.',
    sub: 'Turn paddy straw, wheat straw, and sugarcane trash into seasonal revenue with assured floor prices, digital weight slips, and direct bank payouts.',
    points: [
      { title: 'Guaranteed Floor Index Price', desc: 'Transparent rate models indexed against industrial bio-pellet demand.' },
      { title: 'Free Doorstep Field Pickup', desc: 'Transport and baling logistics managed directly by verified buyers.' },
      { title: 'Direct NEFT / UPI Payouts', desc: 'Full settlement credited within 7 business days of pickup.' },
      { title: 'Verified Carbon Offset Credits', desc: 'Earn clean farming badges for diverting hazardous smoke and smog.' },
    ],
    image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop',
    cta: '/register',
    ctaText: 'List Crop Residue',
  },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState(0);

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
          <Sparkles size={14} /> Comprehensive Agri-Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Every tool you need to <br />
          <span className="text-gradient-emerald">maximize your farm&apos;s output.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          From empirical soil chemistry to real-time tele-agronomy and biomass monetization, FarmHith delivers an end-to-end digital infrastructure for modern Indian farmers.
        </p>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-12 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === idx
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════ ACTIVE TAB CONTENT ══════════════════ */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xl grid lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Award size={14} /> Service Overview
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {TABS[activeTab].title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {TABS[activeTab].sub}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {TABS[activeTab].points.map((p) => (
                <div key={p.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary-700 shrink-0" />
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href={TABS[activeTab].cta}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>{TABS[activeTab].ctaText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 max-h-[440px]">
              <img
                src={TABS[activeTab].image}
                alt={TABS[activeTab].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════════════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-emerald-900 to-primary-900 text-white rounded-3xl p-10 sm:p-14 shadow-2xl max-w-4xl mx-auto border border-emerald-500/30">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Start Upgrading Your Farm Today</h2>
          <p className="text-slate-200 text-base mb-8 max-w-2xl mx-auto">
            Join over 50,000 farmers maximizing their agricultural margins.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-950 font-black text-base shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} />
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
