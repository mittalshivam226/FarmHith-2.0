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
    color: '#4edea3',
    shadow: 'rgba(78,222,163,0.2)',
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
    image: '🔬',
  },
  {
    tag: 'Soil-Mitra Consultations',
    icon: <Users size={28} />,
    color: '#ffb95f',
    shadow: 'rgba(255,185,95,0.2)',
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
    image: '👨‍🌾',
  },
  {
    tag: 'Residue Marketplace',
    icon: <ShoppingBasket size={28} />,
    color: '#c0c6db',
    shadow: 'rgba(192,198,219,0.15)',
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
    image: '♻️',
  },
];

export default function FeaturesPage() {
  return (
    <div className="landing-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <WebsiteNav />

      {/* Hero */}
      <section className="page-hero">
        <div className="section-label"><Sparkles size={12} /> Platform Features</div>
        <h1 className="page-hero-title">
          Built for the <span className="text-emerald">Modern Indian Farmer.</span>
        </h1>
        <p className="page-hero-sub">
          Three deeply integrated services — each solving a real problem, together transforming how India farms.
        </p>
      </section>

      {/* Feature Sections */}
      {FEATURE_SECTIONS.map((f, i) => (
        <section key={f.tag} className={`feature-section ${i % 2 === 1 ? 'feature-section-alt' : ''}`}>
          <div className="feature-section-inner">
            {/* Badge + headline */}
            <div className="feature-section-head">
              <div className="feature-section-tag" style={{ color: f.color, borderColor: `${f.color}30`, background: `${f.color}12` }}>
                {f.icon} {f.tag}
              </div>
              <h2 className="feature-section-title">{f.title}</h2>
              <p className="feature-section-sub">{f.sub}</p>
            </div>

            {/* Points grid */}
            <div className="feature-points-grid">
              {f.points.map(p => (
                <div key={p.title} className="feature-point-card">
                  <div className="feature-point-icon" style={{ color: f.color, background: `${f.color}15` }}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="feature-point-title">{p.title}</p>
                    <p className="feature-point-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={f.cta} className="btn-primary-lg" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              {f.ctaText} <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      ))}

      {/* Comparison strip */}
      <section className="comparison-section">
        <div className="section-label"><Zap size={12} /> Why FarmHith</div>
        <h2 className="section-title">The old way vs. <span className="text-emerald">the FarmHith way.</span></h2>
        <div className="comparison-grid">
          {[
            { old: 'Travel 30 km to a government lab', new: 'Book online, get sample collected at your field' },
            { old: 'Wait 6–8 weeks for test results', new: 'Digital report delivered in 5 days' },
            { old: 'Burn stubble and pay fines', new: 'Sell residue and earn money' },
            { old: 'Hope your neighbour knows the right crop advice', new: 'Video call a verified expert in your language' },
            { old: 'No record of your farm history', new: 'Full digital history on your dashboard' },
            { old: 'Payment delays for crop transactions', new: 'Bank transfer within 7 days' },
          ].map((c, i) => (
            <div key={i} className="comparison-row">
              <div className="comparison-old">❌ {c.old}</div>
              <div className="comparison-new"><CheckCircle size={16} style={{ color: '#4edea3', flexShrink: 0 }} /> {c.new}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <div className="section-label"><Leaf size={12} /> Get Started</div>
          <h2 className="cta-title">Ready to farm smarter?<br /><span className="text-emerald">It&apos;s free to join.</span></h2>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">Create Free Account <ArrowRight size={17} /></Link>
            <Link href="/login" className="btn-outline-lg">Already a member? Log in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo"><div className="logo-icon"><Leaf size={18} /></div><span className="logo-text">FarmHith</span></div>
            <p className="footer-tagline">Empowering Indian farmers with technology, expertise, and fair markets.</p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-heading">Services</p>
              <Link href="/features#soil-testing" className="footer-link">Soil Testing</Link>
              <Link href="/features#mitra" className="footer-link">Soil-Mitra</Link>
              <Link href="/features#marketplace" className="footer-link">Residue Market</Link>
            </div>
            <div>
              <p className="footer-heading">Company</p>
              <Link href="/about" className="footer-link">About Us</Link>
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
