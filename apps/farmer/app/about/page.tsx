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
  { name: 'Shivam Mittal', role: 'Founder & CEO', avatar: 'SM', color: '#059669', bio: 'Building the future of Indian agriculture with technology that actually works in the field.' },
  { name: 'Agricultural AI Team', role: 'Data & Research', avatar: 'AI', color: '#eab308', bio: 'Developing soil models trained on millions of Indian soil samples across 22 crop zones.' },
  { name: 'Field Operations', role: 'Lab & Logistics', avatar: 'FO', color: '#0ea5e9', bio: 'A network of 2,800+ soil-mitras and 600+ NABL-certified labs operating pan-India.' },
];

const VALUES = [
  { icon: <Target size={24} />, color: '#059669', title: 'Farmer First', desc: 'Every product decision starts with a single question: does this make a farmer\'s life better?' },
  { icon: <Heart size={24} />, color: '#eab308', title: 'Rooted in India', desc: 'Built for Indian soil, Indian languages, Indian farmers. Not a copy-paste of a Silicon Valley idea.' },
  { icon: <Zap size={24} />, color: '#0ea5e9', title: 'Science Backed', desc: 'All recommendations are based on peer-reviewed agronomic research and verified lab data.' },
  { icon: <Globe size={24} />, color: '#8b5cf6', title: 'Sustainable Future', desc: 'Every ton of residue we divert from burning saves 2.4 kg of CO₂. We track it for you.' },
];

export default function AboutPage() {
  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <WebsiteNav />

      {/* Mission Hero */}
      <section className="hero" style={{ paddingBottom: '4rem' }}>
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Our Mission</span>
        </div>
        <h1 className="hero-title">
          Farming is India&apos;s backbone.<br /><span className="text-emerald">We&apos;re here to strengthen it.</span>
        </h1>
        <p className="hero-sub" style={{ maxWidth: '800px', margin: '1.5rem auto' }}>
          FarmHith was born from a simple frustration — India has world-class agricultural science,
          but most farmers have no access to it. We&apos;re changing that.
        </p>
      </section>

      {/* Story */}
      <section className="section">
        <div className="about-story-grid">
          <div className="about-story-text">
            <div className="section-label"><Leaf size={14} /> Our Story</div>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem' }}>
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
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', maxWidth: '100%', padding: '6rem 1rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-label" style={{ background: '#ffffff' }}><Heart size={14} /> Our Values</div>
          <h2 className="section-title">What drives every decision <span className="text-gold">we make.</span></h2>
          <div className="values-grid" style={{ marginTop: '3rem' }}>
            {VALUES.map(v => (
              <div key={v.title} className="value-card" style={{ background: '#ffffff', borderColor: '#f1f5f9' }}>
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
        <div className="section-label"><Users size={14} /> The Team</div>
        <h2 className="section-title">People behind <span className="text-emerald">FarmHith.</span></h2>
        <div className="team-grid">
          {TEAM.map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar" style={{ background: `${m.color}15`, color: m.color }}>{m.avatar}</div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role" style={{ color: m.color, fontWeight: 500 }}>{m.role}</p>
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
            <Link href="/register" className="btn-primary-lg">Create Free Account <ArrowRight size={18} /></Link>
            <Link href="/features" className="btn-outline-lg">Explore Features</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo"><div className="logo-icon"><Leaf size={20} /></div><span className="logo-text">FarmHith</span></div>
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
