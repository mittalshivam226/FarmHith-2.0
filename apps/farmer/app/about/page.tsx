import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import { Leaf, Target, Heart, Zap, Users, Globe, ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — FarmHith',
  description: 'FarmHith is on a mission to bring precision agriculture to every Indian farmer.',
};

const TEAM = [
  { name: 'Shivam Mittal', role: 'Founder & CEO', avatar: 'SM', color: '#4edea3', bio: 'Building the future of Indian agriculture with technology that actually works in the field.' },
  { name: 'Agricultural AI Team', role: 'Data & Research', avatar: 'AI', color: '#ffb95f', bio: 'Developing soil models trained on millions of Indian soil samples across 22 crop zones.' },
  { name: 'Field Operations', role: 'Lab & Logistics', avatar: 'FO', color: '#c0c6db', bio: 'A network of 2,800+ soil-mitras and 600+ NABL-certified labs operating pan-India.' },
];

const VALUES = [
  { icon: <Target size={24} />, color: '#4edea3', title: 'Farmer First', desc: 'Every product decision starts with a single question: does this make a farmer\'s life better?' },
  { icon: <Heart size={24} />, color: '#ffb95f', title: 'Rooted in India', desc: 'Built for Indian soil, Indian languages, Indian farmers. Not a copy-paste of a Silicon Valley idea.' },
  { icon: <Zap size={24} />, color: '#c0c6db', title: 'Science Backed', desc: 'All recommendations are based on peer-reviewed agronomic research and verified lab data.' },
  { icon: <Globe size={24} />, color: '#4edea3', title: 'Sustainable Future', desc: 'Every ton of residue we divert from burning saves 2.4 kg of CO₂. We track it for you.' },
];

export default function AboutPage() {
  return (
    <div className="landing-root">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <WebsiteNav />

      {/* Mission Hero */}
      <section className="page-hero">
        <div className="section-label"><Sparkles size={12} /> Our Mission</div>
        <h1 className="page-hero-title">
          Farming is India&apos;s backbone.<br /><span className="text-emerald">We&apos;re here to strengthen it.</span>
        </h1>
        <p className="page-hero-sub">
          FarmHith was born from a simple frustration — India has world-class agricultural science,
          but most farmers have no access to it. We&apos;re changing that.
        </p>
      </section>

      {/* Story */}
      <section className="section">
        <div className="about-story-grid">
          <div className="about-story-text">
            <div className="section-label"><Leaf size={12} /> Our Story</div>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2rem' }}>
              Started with a <span className="text-emerald">soil test</span> that took 8 weeks.
            </h2>
            <p className="about-para">
              In 2023, our founder visited a village in Ludhiana where farmers were burning paddy straw
              not out of laziness — but because they had no other option. The nearest lab was 40 km away,
              required paper applications, and returned results in 6 weeks in a format no farmer could understand.
            </p>
            <p className="about-para">
              FarmHith was built to make that wait 5 days. The 40 km trip — zero. The report language — yours.
              The advice — expert and live. The stubble — income, not smoke.
            </p>
            <p className="about-para">
              Today, we&apos;re operational in 18 states, with 50,000+ registered farmers, 600+ lab partners,
              and ₹8 crore paid out to farmers for crop residue that would have otherwise burned.
            </p>
          </div>
          <div className="about-stats-col">
            {[
              { value: '50,000+', label: 'Registered Farmers' },
              { value: '18', label: 'States Covered' },
              { value: '600+', label: 'NABL Lab Partners' },
              { value: '₹8 Cr+', label: 'Paid to Farmers' },
            ].map(s => (
              <div key={s.label} className="about-stat-card">
                <p className="about-stat-value">{s.value}</p>
                <p className="about-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)', maxWidth: '100%', padding: '7rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-label"><Heart size={12} /> Our Values</div>
          <h2 className="section-title">What drives every decision <span className="text-gold">we make.</span></h2>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon" style={{ color: v.color, background: `${v.color}15` }}>{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="section-label"><Users size={12} /> The Team</div>
        <h2 className="section-title">People behind <span className="text-emerald">FarmHith.</span></h2>
        <div className="team-grid">
          {TEAM.map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar" style={{ background: `${m.color}20`, color: m.color }}>{m.avatar}</div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role" style={{ color: m.color }}>{m.role}</p>
              <p className="team-bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <h2 className="cta-title">Join us in <span className="text-emerald">building a better farm.</span></h2>
          <p className="cta-sub">Free to join. No hidden fees. 50,000 farmers already ahead of you.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">Create Free Account <ArrowRight size={17} /></Link>
            <Link href="/features" className="btn-outline-lg">Explore Features</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo"><div className="logo-icon"><Leaf size={18} /></div><span className="logo-text">FarmHith</span></div>
            <p className="footer-tagline">Empowering Indian farmers with technology, expertise, and fair markets.</p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-heading">Platform</p>
              <Link href="/features" className="footer-link">Features</Link>
              <Link href="/about" className="footer-link">About</Link>
            </div>
            <div>
              <p className="footer-heading">Account</p>
              <Link href="/register" className="footer-link">Register</Link>
              <Link href="/login" className="footer-link">Login</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd.</p></div>
      </footer>
    </div>
  );
}
