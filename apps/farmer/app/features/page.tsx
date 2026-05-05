import React from 'react';
import Link from 'next/link';
import WebsiteNav from '../components/WebsiteNav';
import {
  FlaskConical, Users, ShoppingBasket, CheckCircle,
  ArrowRight, Leaf, Shield, TrendingUp, Clock,
  MapPin, FileText, Star, Sparkles, Zap, Globe,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — FarmHith',
  description: 'Explore FarmHith\'s precision soil testing, expert Soil-Mitra consultations, and crop residue marketplace.',
};

const FEATURE_SECTIONS = [
  {
    tag: 'Soil Testing',
    icon: <FlaskConical size={28} />,
    color: '#059669',
    shadow: 'rgba(5,150,105,0.15)',
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
    image: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e48d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Soil-Mitra Consultations',
    icon: <Users size={28} />,
    color: '#eab308',
    shadow: 'rgba(234,179,8,0.15)',
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
    color: '#0284c7',
    shadow: 'rgba(2,132,199,0.15)',
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
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function FeaturesPage() {
  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <WebsiteNav />

      {/* Hero */}
      <section className="hero" style={{ paddingBottom: '4rem' }}>
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Platform Features</span>
        </div>
        <h1 className="hero-title">
          Built for the <br /><span className="text-emerald">Modern Indian Farmer.</span>
        </h1>
        <p className="hero-sub" style={{ maxWidth: '800px', margin: '1.5rem auto' }}>
          Three deeply integrated services — each solving a real problem, together transforming how India farms.
        </p>
      </section>

      {/* Feature Sections */}
      {FEATURE_SECTIONS.map((f, i) => (
        <section key={f.tag} className="section" style={{ background: i % 2 === 1 ? '#f8fafc' : 'transparent', borderTop: i % 2 === 1 ? '1px solid #f1f5f9' : 'none', borderBottom: i % 2 === 1 ? '1px solid #f1f5f9' : 'none' }}>
          <div className={`split-section ${i % 2 === 1 ? 'reverse' : ''}`} style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}>
            <div className="split-image">
                <img src={f.image} alt={f.tag} />
            </div>
            <div className="split-content">
                <div className="section-label" style={{ color: f.color, borderColor: `${f.color}40`, background: `${f.color}10` }}>
                    <span style={{ color: f.color }}>{f.icon}</span> {f.tag}
                </div>
                <h2 className="section-title">{f.title}</h2>
                <p className="section-sub">{f.sub}</p>
                <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                  {f.points.map(p => (
                    <div key={p.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: f.color, fontWeight: 600 }}>
                        {p.icon}
                        <span>{p.title}</span>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <Link href={f.cta} className="btn-primary-sm" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '1rem', background: f.color, borderColor: f.color }}>
                        {f.ctaText} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
          </div>
        </section>
      ))}

      {/* Comparison strip */}
      <section className="section" style={{ background: '#020617', color: '#ffffff', borderRadius: '2rem', margin: '4rem 1rem', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-label" style={{ background: 'transparent', borderColor: '#334155', color: '#94a3b8' }}><Zap size={14} /> Why FarmHith</div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>The old way vs. <span className="text-emerald">the FarmHith way.</span></h2>
            
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '3rem' }}>
            {[
                { old: 'Travel 30 km to a government lab', new: 'Book online, get sample collected at your field' },
                { old: 'Wait 6–8 weeks for test results', new: 'Digital report delivered in 5 days' },
                { old: 'Burn stubble and pay fines', new: 'Sell residue and earn money' },
                { old: 'Hope your neighbour knows the right crop advice', new: 'Video call a verified expert in your language' },
                { old: 'No record of your farm history', new: 'Full digital history on your dashboard' },
                { old: 'Payment delays for crop transactions', new: 'Bank transfer within 7 days' },
            ].map((c, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #1e293b', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: '#ef4444' }}>❌</span> 
                        <span style={{ textDecoration: 'line-through' }}>{c.old}</span>
                    </div>
                    <div style={{ flex: 1, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
                        <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} /> 
                        {c.new}
                    </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <div className="section-label" style={{ background: '#ffffff', color: '#059669', borderColor: '#d1fae5' }}><Leaf size={14} /> Get Started</div>
          <h2 className="cta-title">Ready to farm smarter?<br /><span className="text-emerald">It&apos;s free to join.</span></h2>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">Create Free Account <ArrowRight size={18} /></Link>
            <Link href="/login" className="btn-outline-lg">Already a member? Log in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo"><div className="logo-icon"><Leaf size={20} /></div><span className="logo-text">FarmHith</span></div>
            <p className="footer-tagline">Empowering Indian farmers with technology, expertise, and fair markets.</p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-heading">Services</p>
              <Link href="/dashboard/soil-test" className="footer-link">Soil Testing</Link>
              <Link href="/dashboard/mitra" className="footer-link">Soil-Mitra</Link>
              <Link href="/dashboard/marketplace" className="footer-link">Residue Market</Link>
            </div>
            <div>
              <p className="footer-heading">Company</p>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/features" className="footer-link">Features</Link>
              <a href="#testimonials" className="footer-link">Farmer Stories</a>
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
