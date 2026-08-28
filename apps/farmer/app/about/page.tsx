'use client';

import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import { Leaf, Target, Heart, Zap, Users, Globe, ArrowRight } from 'lucide-react';
import { CursorGlow } from '../components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from '../components/Animations';

const TEAM = [
  { name: 'Shivam Mittal', role: 'Founder & CEO', avatar: 'SM', color: 'text-success-400', bg: 'bg-success-500/10', border: 'border-success-500/30', bio: 'Building the future of Indian agriculture with technology that actually works in the field.' },
  { name: 'Agricultural AI Team', role: 'Data & Research', avatar: 'AI', color: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30', bio: 'Developing soil models trained on millions of Indian soil samples across 22 crop zones.' },
  { name: 'Field Operations', role: 'Lab & Logistics', avatar: 'FO', color: 'text-info-400', bg: 'bg-info-500/10', border: 'border-info-500/30', bio: 'A network of 2,800+ soil-mitras and 600+ NABL-certified labs operating pan-India.' },
];

const VALUES = [
  { icon: <Target size={24} />, color: 'text-success-400', bg: 'bg-success-500/10', border: 'border-success-500/30', title: 'Farmer First', desc: 'Every product decision starts with a single question: does this make a farmer\'s life better?' },
  { icon: <Heart size={24} />, color: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30', title: 'Rooted in India', desc: 'Built for Indian soil, Indian languages, Indian farmers. Not a copy-paste of a Silicon Valley idea.' },
  { icon: <Zap size={24} />, color: 'text-info-400', bg: 'bg-info-500/10', border: 'border-info-500/30', title: 'Science Backed', desc: 'All recommendations are based on peer-reviewed agronomic research and verified lab data.' },
  { icon: <Globe size={24} />, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/30', title: 'Sustainable Future', desc: 'Every ton of residue we divert from burning saves 2.4 kg of CO₂. We track it for you.' },
];

export default function AboutPage() {
  return (
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen">
      <CursorGlow />
      <WebsiteNav />

      {/* Mission Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8">
              <Leaf size={14} />
              <span>Our Mission</span>
            </div>
          </FadeIn>
          <StaggerText 
            text="Farming is India's backbone. We're here to strengthen it." 
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" 
            delay={0.1}
          />
          <FadeIn delay={0.4}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              FarmHith was born from a simple frustration — India has world-class agricultural science,
              but most farmers have no access to it. We&apos;re changing that.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SlideIn direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2 border border-slate-700">
                <Leaf size={14} className="text-primary-400" /> Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Started with a <span className="text-primary-400">soil test</span> that took 8 weeks.
              </h2>
            </SlideIn>
            
            <FadeIn delay={0.2} className="space-y-4 text-slate-400 text-lg leading-relaxed">
              <p>
                In 2023, our founder visited a village in Ludhiana where farmers were burning paddy straw
                not out of laziness — but because they had no other option. The nearest lab was 40 km away,
                required paper applications, and returned results in 6 weeks in a format no farmer could understand.
              </p>
              <p>
                FarmHith was built to make that wait 5 days. The 40 km trip — zero. The report language — yours.
                The advice — expert and live. The stubble — income, not smoke.
              </p>
              <p>
                Today, we&apos;re operational in 18 states, with 50,000+ registered farmers, 600+ lab partners,
                and ₹8 crore paid out to farmers for crop residue that would have otherwise burned.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '50,000+', label: 'Registered Farmers' },
              { value: '18', label: 'States Covered' },
              { value: '600+', label: 'NABL Lab Partners' },
              { value: '₹8 Cr+', label: 'Paid to Farmers' },
            ].map((s, i) => (
              <ZoomIn key={s.label} delay={i * 0.1}>
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center hud-element hover:border-primary-500/30 hover:shadow-glow-sm transition-all duration-300">
                  <div className="text-4xl font-black text-primary-400 mb-2">{s.value}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</div>
                </div>
              </ZoomIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary-500/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Heart size={14} className="text-primary-400" /> Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What drives every decision <span className="text-primary-400">we make.</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <SlideIn key={v.title} delay={i * 0.1} direction="left" className="group">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl h-full hud-element hover:border-slate-700 transition-colors">
                  <div className={`w-14 h-14 rounded-xl ${v.bg} ${v.border} border flex items-center justify-center mb-6 shadow-glow-sm group-hover:scale-110 transition-transform`}>
                    <div className={v.color}>{v.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4 border border-slate-700">
              <Users size={14} className="text-primary-400" /> The Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              People behind <span className="text-primary-400">FarmHith.</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((m, i) => (
              <ZoomIn key={m.name} delay={i * 0.15}>
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center hud-element hover:border-slate-700 transition-colors">
                  <div className={`w-20 h-20 mx-auto rounded-full ${m.bg} ${m.border} border flex items-center justify-center mb-6 shadow-glow-sm`}>
                    <span className={`font-black text-2xl ${m.color}`}>{m.avatar}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{m.name}</h3>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${m.color}`}>{m.role}</p>
                  <p className="text-slate-400 leading-relaxed">{m.bio}</p>
                </div>
              </ZoomIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden text-center bg-slate-950">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-5xl font-black text-white mb-8">
              Join us in <br/><span className="text-primary-400">building a better farm.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">Free to join. No hidden fees. 50,000 farmers already ahead of you.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-400 transition-all shadow-glow-md">
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link href="/features" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-700 transition-all">
                Explore Features
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
