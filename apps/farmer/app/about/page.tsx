'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import { Leaf, Target, Heart, Zap, Users, Globe, ArrowRight, CheckCircle2, Award, Sparkles, Building2, Shield, TrendingUp } from 'lucide-react';

const TIMELINE = [
  {
    year: '2023',
    title: 'The Ludhiana Awakening',
    desc: 'Founder Shivam Mittal witnessed stubble fires raging across Punjab because farmers had zero local buyers and 8-week lab test delays.',
  },
  {
    year: '2024',
    title: 'NABL Lab Network Integration',
    desc: 'Built the unified lab dispatch protocol, onboarded 600+ ISO-accredited testing centers, and slashed turnaround from 8 weeks to 5 days.',
  },
  {
    year: '2025',
    title: 'Bio-Pellet Marketplace Scale',
    desc: 'Partnered with industrial biomass plants, facilitating ₹8.4 Cr+ in direct payouts to farmers for diverted paddy and wheat straw.',
  },
  {
    year: '2026',
    title: 'Tele-Agronomy AI Layer',
    desc: 'Launched live 1-on-1 video rooms with 2,800+ certified Soil-Mitras across 18 Indian states and 5 regional languages.',
  },
];

const VALUES = [
  {
    icon: <Target size={26} className="text-emerald-700" />,
    badge: 'Core Priority',
    title: 'Farmer Prosperity First',
    desc: 'Every algorithm, pricing model, and lab partnership is engineered to directly increase a farmer\'s net seasonal income and protect their family\'s future.',
  },
  {
    icon: <Heart size={26} className="text-amber-700" />,
    badge: 'Grassroots Design',
    title: 'Rooted in Indian Soil',
    desc: 'Custom-built for local soil types across 22 agro-climatic zones, smallholder land parcels, and regional languages like Punjabi, Marathi, and Hindi.',
  },
  {
    icon: <Zap size={26} className="text-blue-700" />,
    badge: 'Empirical Rigor',
    title: 'Data & Science Backed',
    desc: 'No vague tips. Every advice point is calibrated against certified laboratory chemistry, NPK ratios, and vetted agronomy research.',
  },
  {
    icon: <Globe size={26} className="text-teal-700" />,
    badge: 'Clean Skies',
    title: 'Zero-Burning Ecosystem',
    desc: 'Transforming smoke and smog into clean energy pellets, preventing thousands of tons of hazardous CO₂ and particulate matter emissions.',
  },
];

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(3);

  return (
    <div className="landing-root bg-[#fbfdfa] text-slate-900">
      <WebsiteNav />

      {/* Ambient background light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-100/35 blur-[140px]" />
      </div>

      {/* ═══════════════ MISSION HERO ════════════════════════ */}
      <section className="relative z-10 pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles size={14} /> Our Mission & Origins
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Strengthening the backbone of <br />
          <span className="text-gradient-emerald">Indian Agriculture.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          FarmHith was built to dismantle the friction between world-class agricultural science and Indian farmers. We turn slow lab processes into 5-day digital answers, and burning stubble into guaranteed seasonal income.
        </p>
      </section>

      {/* ═══════════════ INTERACTIVE TIMELINE ════════════════ */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            The Journey of FarmHith
          </h2>
          <p className="text-sm sm:text-base text-slate-600">From a single village in Punjab to a pan-India agricultural platform.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE.map((item, idx) => (
            <div
              key={item.year}
              onClick={() => setActiveTimeline(idx)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeTimeline === idx
                  ? 'bg-white border-primary-500 shadow-xl ring-2 ring-primary-500/20'
                  : 'bg-white/70 border-slate-200 hover:bg-white shadow-sm'
              }`}
            >
              <div>
                <span className="text-3xl font-black text-primary-700 tracking-tight block mb-2">{item.year}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={14} /> Milestone Verified
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CORE VALUES ═════════════════════════ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Heart size={14} className="text-red-500" /> Operational Principles
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              What Drives Every Decision We Make.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{v.badge}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════════════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-emerald-900 to-primary-900 text-white rounded-3xl p-10 sm:p-14 shadow-2xl max-w-4xl mx-auto border border-emerald-500/30">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Join 50,000+ Farmers Transforming Their Yields</h2>
          <p className="text-slate-200 text-base mb-8 max-w-2xl mx-auto">
            Free registration. Access certified lab diagnostics, live agronomist calls, and stubble selling.
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
