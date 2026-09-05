'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  FlaskConical, Users, ArrowRight,
  Leaf, Shield, TrendingUp, Star, ChevronRight,
  CheckCircle, Award, Sparkles, Building2, ExternalLink
} from 'lucide-react';
import WebsiteNav from './components/WebsiteNav';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === 'FARMER') router.replace('/dashboard');
  }, [user, isLoading, router]);

  if (isLoading || user?.role === 'FARMER') return null;

  const testimonials = [
    {
      name: 'Ramesh Kumar',
      location: 'Ludhiana, Punjab',
      crop: 'Wheat & Paddy',
      stars: 5,
      text: 'Maine paddy straw se ₹18,000 kamaye jo pehle main jala deta tha. FarmHith ne meri soch badal di.',
      avatar: 'RK',
    },
    {
      name: 'Sunita Devi',
      location: 'Nashik, Maharashtra',
      crop: 'Sugarcane',
      stars: 5,
      text: 'Soil-Mitra se baat ki, unhone exact fertiliser bataya. Is season yield 40% badh gayi. Bahut shukriya!',
      avatar: 'SD',
    },
    {
      name: 'Gurpreet Singh',
      location: 'Amritsar, Punjab',
      crop: 'Cotton',
      stars: 5,
      text: 'Soil test report se pata chala ki mere khet mein zinc ki kami hai. Lab report was so detailed and helpful.',
      avatar: 'GS',
    },
    {
      name: 'Vikram Patel',
      location: 'Surat, Gujarat',
      crop: 'Groundnut',
      stars: 5,
      text: 'FarmHith has completely digitized how I manage my soil. The Mitras are very knowledgeable.',
      avatar: 'VP',
    }
  ];

  const portals = [
    {
      role: 'Farmer Portal',
      desc: 'Book soil tests, get expert advice & sell crop residue directly.',
      link: '/register',
      cta: 'Register as Farmer',
      badge: 'Main Hub',
      icon: <Leaf size={24} className="text-primary-700" />,
    },
    {
      role: 'Soil-Mitra Agronomists',
      desc: 'Certified agriculture experts conducting 1-on-1 farmer consultations.',
      link: 'http://localhost:3002',
      cta: 'Mitra Portal',
      badge: 'Expert Hub',
      icon: <Users size={24} className="text-amber-700" />,
      external: true,
    },
    {
      role: 'Bio-Pellet Industry',
      desc: 'Industrial procurement of stubble & biomass directly from farmers.',
      link: 'http://localhost:3003',
      cta: 'Pellet Portal',
      badge: 'Buyer Hub',
      icon: <Building2 size={24} className="text-blue-700" />,
      external: true,
    },
    {
      role: 'Soil Testing Labs',
      desc: 'NABL accredited testing centers managing sample workflows.',
      link: 'http://localhost:3004',
      cta: 'Lab Portal',
      badge: 'NABL Network',
      icon: <FlaskConical size={24} className="text-emerald-700" />,
      external: true,
    },
  ];

  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      {/* ═══════════════ HERO SECTION ════════════════════════ */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>The Future of Indian Agriculture</span>
        </div>

        <h1 className="hero-title">
          Farming upgraded for the <br />
          <span className="text-emerald">digital age.</span>
        </h1>

        <p className="hero-sub">
          Transform your field into a high-yielding, sustainable farm. Book certified laboratory soil tests, consult with expert Soil-Mitras, and sell crop residue effortlessly.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="btn-primary-lg shadow-md hover:shadow-lg transition-all">
            Create Free Account <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn-outline-lg hover:border-slate-400 transition-all">
            Explore Platform
          </a>
        </div>

        {/* Hero Visual Showcase */}
        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop"
            alt="FarmHith Digital Agriculture Platform"
            className="w-full h-auto object-cover max-h-[520px]"
          />
          <div className="hero-image-overlay" />
        </div>
      </section>

      {/* ═══════════════ STATS STRIP ══════════════════════════ */}
      <div className="stats-strip">
        {[
          { value: '50,000+', label: 'Registered Farmers' },
          { value: '18', label: 'States Covered' },
          { value: '600+', label: 'NABL Partner Labs' },
          { value: '₹8 Cr+', label: 'Paid to Farmers' },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════ ECOSYSTEM PORTALS ═══════════════════ */}
      <section className="section pb-4">
        <div className="section-label">
          <Sparkles size={14} /> Unified Agricultural Ecosystem
        </div>
        <h2 className="section-title">One platform for every stakeholder.</h2>
        <p className="section-sub">
          FarmHith connects farmers, certified agronomists, bio-pellet buyers, and state-of-the-art testing laboratories in one synchronized network.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mt-8">
          {portals.map((p) => (
            <div
              key={p.role}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{p.role}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{p.desc}</p>
              </div>

              {p.external ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between text-sm font-bold text-primary-700 hover:text-primary-800 pt-3 border-t border-slate-100"
                >
                  <span>{p.cta}</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <Link
                  href={p.link}
                  className="inline-flex items-center justify-between text-sm font-bold text-primary-700 hover:text-primary-800 pt-3 border-t border-slate-100"
                >
                  <span>{p.cta}</span>
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CORE SERVICES ════════════════════════ */}
      <section id="features" className="section">
        <div className="section-label">
          <Leaf size={14} /> Core Services
        </div>
        <h2 className="section-title">Everything your farm needs,<br /><span className="text-emerald">all in one place.</span></h2>
        <p className="section-sub">From accurate soil diagnostics to expert video consultations and stubble monetization — we have you covered.</p>

        <div className="features-grid">
          {[
            {
              tag: 'Soil Testing',
              icon: <FlaskConical size={26} />,
              title: 'Book a Soil Test',
              desc: 'Get your soil tested by certified NABL partner laboratories. Receive detailed NPK, pH, and micronutrient reports with custom crop recommendations in 5 days.',
              bullets: ['Doorstep sample collection', '5-day digital report guarantee', 'Personalised fertiliser schedule'],
              cta: '/register',
              ctaText: 'Book a Soil Test',
            },
            {
              tag: 'Expert Consultation',
              icon: <Users size={26} />,
              title: 'Connect with a Soil-Mitra',
              desc: 'Book 1-on-1 video consultations with verified agricultural experts and agronomists. Get instant solutions for pest attacks, crop diseases, and yield optimization.',
              bullets: ['Verified agronomists', 'Live report sharing in video room', 'Available in your regional language'],
              cta: '/register',
              ctaText: 'Find an Expert',
            },
            {
              tag: 'Residue Marketplace',
              icon: <TrendingUp size={26} />,
              title: 'Sell Crop Residue',
              desc: 'Stop burning stubble. List your paddy straw, wheat straw, and crop residue on the marketplace and earn guaranteed revenue from bio-pellet plants.',
              bullets: ['FarmHith assured prices', 'Free pickup logistics coordination', 'Direct bank payout within 7 days'],
              cta: '/register',
              ctaText: 'List Your Residue',
            },
          ].map((f) => (
            <div key={f.title} className="feature-card hover:-translate-y-1 transition-transform">
              <div className="feature-icon-wrap">
                {f.icon}
              </div>
              <div className="feature-tag">{f.tag}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <ul className="feature-bullets">
                {f.bullets.map(b => (
                  <li key={b}><CheckCircle size={16} className="text-primary-600 shrink-0" /><span>{b}</span></li>
                ))}
              </ul>
              <Link href={f.cta} className="feature-cta">
                {f.ctaText} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Split Feature Section */}
        <div className="split-section">
          <div className="split-image">
            <img
              src="https://images.unsplash.com/photo-1595804368593-cc43ba2986f3?q=80&w=1000&auto=format&fit=crop"
              alt="Intelligent Agricultural Insights"
            />
          </div>
          <div className="split-content">
            <div className="section-label"><Award size={14} /> Proven Scientific Impact</div>
            <h2 className="section-title">Intelligent insights for maximum harvest yield.</h2>
            <p className="section-sub">
              We combine traditional agricultural wisdom with precision laboratory diagnostics to deliver actionable, transparent guidance for Indian farming conditions.
            </p>
            <ul className="feature-bullets" style={{ fontSize: '1.05rem', gap: '1rem' }}>
              <li><CheckCircle size={20} className="text-primary-600" /> Real-time tracking of sample pickups and digital test reports</li>
              <li><CheckCircle size={20} className="text-primary-600" /> Transparent residue pricing indexed against market demand</li>
              <li><CheckCircle size={20} className="text-primary-600" /> Certified network of verified Soil-Mitra agronomists</li>
            </ul>
            <div style={{ marginTop: '2.5rem' }}>
              <Link href="/features" className="btn-primary-sm" style={{ display: 'inline-flex', padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                Explore All Platform Features <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════════ */}
      <section id="how-it-works" className="section how-section">
        <div className="section-label"><Sparkles size={14} /> Simple Process</div>
        <h2 className="section-title">From field to results<br /><span className="text-gold">in 3 easy steps.</span></h2>

        <div className="steps-grid mt-8">
          {[
            { num: '01', title: 'Create Your Account', desc: 'Register in under 2 minutes — enter your name, village, state, and primary crop. No complex paperwork.', icon: <Shield size={32} /> },
            { num: '02', title: 'Choose Your Service', desc: 'Book a certified soil test, schedule a Mitra video session, or list your crop residue. All from one clean dashboard.', icon: <Leaf size={32} /> },
            { num: '03', title: 'Grow & Earn More', desc: 'Act on lab recommendations, get paid directly for your biomass, and watch your harvest thrive season after season.', icon: <TrendingUp size={32} /> },
          ].map((step) => (
            <div key={step.num} className="step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ════════════════════════ */}
      <section id="testimonials" className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="section-label"><Star size={14} /> Farmer Stories</div>
        <h2 className="section-title">Real farmers.<br /><span className="text-emerald">Real results.</span></h2>
        <p className="section-sub">Hear how farmers across Punjab, Maharashtra, Gujarat, and Haryana transformed their harvests.</p>

        <div className="testimonials-wrapper mt-6">
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-meta">{t.crop} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════════════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="section-label" style={{ background: '#ffffff', color: '#1b5e20', borderColor: '#cbd5c8' }}>
            Get Started Free
          </div>
          <h2 className="cta-title">
            The future of Indian farming<br />starts with <span className="text-emerald">one click.</span>
          </h2>
          <p className="cta-sub">
            Free registration. No hidden fees. Trusted by 50,000+ farmers across 18 states.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn-outline-lg">
              Already a member? Log in
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
            <p className="footer-tagline">
              Empowering Indian farmers with scientific precision, expert advisory, and sustainable biomass revenue.
            </p>
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
              <Link href="/blog" className="footer-link">Blog & Insights</Link>
              <Link href="/faq" className="footer-link">FAQs</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
            </div>
            <div>
              <p className="footer-heading">Account</p>
              <Link href="/register" className="footer-link">Create Account</Link>
              <Link href="/login" className="footer-link">Farmer Login</Link>
              <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="footer-link">Mitra Portal</a>
              <a href="http://localhost:3003" target="_blank" rel="noreferrer" className="footer-link">Bio-Pellet Portal</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved. Built for Indian Agriculture.</p>
        </div>
      </footer>
    </div>
  );
}
