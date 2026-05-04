'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  FlaskConical, Users, ShoppingBasket, ArrowRight,
  Leaf, Shield, TrendingUp, Star, Sparkles, ChevronRight,
  CheckCircle, Menu, X,
} from 'lucide-react';

/* ─── Animated counter ─────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = Math.ceil(target / 60);
      const id = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(id); }
        else setCount(start);
      }, 20);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role === 'FARMER') router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLoading || user?.role === 'FARMER') return null;

  return (
    <div className="landing-root">
      {/* ── Ambient orbs ─────────────────────────────────────── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ═══════════════ NAVBAR ══════════════════════════════ */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-icon"><Leaf size={20} /></div>
            <span className="logo-text">FarmHith</span>
            <span className="logo-badge">Farmer</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#testimonials" className="nav-link">Stories</a>
          </div>

          {/* CTA */}
          <div className="nav-cta">
            <Link href="/login" className="btn-ghost">Log in</Link>
            <Link href="/register" className="btn-primary-sm">Get Started <ArrowRight size={14} /></Link>
          </div>

          {/* Mobile toggle */}
          <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="mobile-drawer">
            <a href="#features" onClick={() => setMenuOpen(false)} className="mobile-link">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="mobile-link">How it works</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)} className="mobile-link">Farmer Stories</a>
            <Link href="/login" className="mobile-link">Log in</Link>
            <Link href="/register" className="btn-primary-full">Create Free Account</Link>
          </div>
        )}
      </nav>

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={13} />
          <span>Trusted by 50,000+ Indian Farmers</span>
        </div>

        <h1 className="hero-title">
          Your Farm.<br />
          <span className="text-emerald">Your Future.</span><br />
          Your Way.
        </h1>

        <p className="hero-sub">
          Book precision soil tests, consult expert Soil-Mitras, and sell your
          crop residue — all from one powerful platform built for the modern Indian farmer.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="btn-primary-lg">
            Start for Free <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-outline-lg">
            See how it works
          </a>
        </div>

        {/* Hero card preview */}
        <div className="hero-card-grid">
          {[
            { icon: <FlaskConical size={20} />, label: 'Soil Tests Completed', value: '1,24,000+', color: '#4edea3' },
            { icon: <Users size={20} />, label: 'Expert Mitras Available', value: '2,800+', color: '#ffb95f' },
            { icon: <TrendingUp size={20} />, label: 'Avg. Farmer Earnings', value: '₹32,000', color: '#c0c6db' },
          ].map((card) => (
            <div key={card.label} className="hero-stat-card">
              <div className="hero-stat-icon" style={{ color: card.color }}>{card.icon}</div>
              <p className="hero-stat-value" style={{ color: card.color }}>{card.value}</p>
              <p className="hero-stat-label">{card.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ STATS STRIP ════════════════════════ */}
      <section className="stats-strip">
        {[
          { label: 'Farmers Registered', value: 50000, suffix: '+' },
          { label: 'Soil Tests Done', value: 124000, suffix: '+' },
          { label: 'Crop Residue Sold (Tons)', value: 84000, suffix: '+' },
          { label: 'States Covered', value: 18, suffix: '' },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <p className="stat-value">
              <Counter target={s.value} suffix={s.suffix} />
            </p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ═══════════════ FEATURES ════════════════════════════ */}
      <section id="features" className="section">
        <div className="section-label"><Sparkles size={12} /> Core Services</div>
        <h2 className="section-title">Everything your farm needs,<br /><span className="text-emerald">in one place.</span></h2>
        <p className="section-sub">Three powerful services designed to maximise your farm&apos;s potential.</p>

        <div className="features-grid">
          {[
            {
              icon: <FlaskConical size={32} />,
              color: '#4edea3',
              shadow: 'rgba(78,222,163,0.25)',
              tag: 'Soil Excellence',
              title: 'Precision Soil Testing',
              desc: 'Book certified lab tests for your fields. Get detailed NPK reports, pH analysis, and personalised crop recommendations — all in your language.',
              bullets: ['NABL-certified labs', 'Reports in 5 days', 'Multilingual results'],
              cta: '/dashboard/soil-test',
              ctaText: 'Book a Test',
            },
            {
              icon: <Users size={32} />,
              color: '#ffb95f',
              shadow: 'rgba(255,185,95,0.25)',
              tag: 'Expert Guidance',
              title: 'Your Soil-Mitra Awaits',
              desc: 'Connect with verified agricultural experts for 1-on-1 video consultations. Solve crop diseases, soil problems, and yield challenges — live.',
              bullets: ['Video & voice calls', 'Share your soil reports', 'Rated & verified experts'],
              cta: '/dashboard/mitra',
              ctaText: 'Find a Mitra',
            },
            {
              icon: <ShoppingBasket size={32} />,
              color: '#c0c6db',
              shadow: 'rgba(192,198,219,0.2)',
              tag: 'Waste to Wealth',
              title: 'Sell Crop Residue',
              desc: 'Stop burning stubble. List your paddy straw, wheat straw, and other crop residue on the marketplace and earn from bio-pellet plants.',
              bullets: ['FarmHith assured prices', 'Free pickup logistics', 'Same-week payment'],
              cta: '/dashboard/marketplace',
              ctaText: 'List Your Residue',
            },
          ].map((f) => (
            <div key={f.title} className="feature-card" style={{ '--glow': f.shadow } as React.CSSProperties}>
              <div className="feature-icon-wrap" style={{ color: f.color, borderColor: `${f.color}33`, background: `${f.color}15` }}>
                {f.icon}
              </div>
              <div className="feature-tag" style={{ color: f.color }}>{f.tag}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <ul className="feature-bullets">
                {f.bullets.map(b => (
                  <li key={b}><CheckCircle size={14} style={{ color: f.color }} />{b}</li>
                ))}
              </ul>
              <Link href={f.cta} className="feature-cta" style={{ color: f.color, borderColor: `${f.color}40` }}>
                {f.ctaText} <ChevronRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════════ */}
      <section id="how-it-works" className="section how-section">
        <div className="section-label"><Sparkles size={12} /> Simple Process</div>
        <h2 className="section-title">From field to results<br /><span className="text-gold">in 3 easy steps.</span></h2>

        <div className="steps-grid">
          {[
            { num: '01', title: 'Create Your Account', desc: 'Register in under 2 minutes — just your name, village, and primary crop. No complex forms.', icon: <Shield size={24} /> },
            { num: '02', title: 'Choose Your Service', desc: 'Book a soil test, find a Mitra expert, or list your crop residue for sale. Everything in one dashboard.', icon: <Leaf size={24} /> },
            { num: '03', title: 'Grow & Earn More', desc: 'Act on expert recommendations, get paid for your residue, and watch your farm thrive season after season.', icon: <TrendingUp size={24} /> },
          ].map((step, i) => (
            <div key={step.num} className="step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {i < 2 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ════════════════════════ */}
      <section id="testimonials" className="section">
        <div className="section-label"><Sparkles size={12} /> Farmer Stories</div>
        <h2 className="section-title">Real farmers.<br /><span className="text-emerald">Real results.</span></h2>

        <div className="testimonials-grid">
          {[
            {
              name: 'Ramesh Kumar',
              location: 'Ludhiana, Punjab',
              crop: 'Wheat & Paddy',
              stars: 5,
              text: 'Maine paddy straw se ₹18,000 kamaye jo pehle main jala deta tha. FarmHith ne meri soch badal di.',
              avatar: 'RK',
              color: '#4edea3',
            },
            {
              name: 'Sunita Devi',
              location: 'Nashik, Maharashtra',
              crop: 'Sugarcane',
              stars: 5,
              text: 'Soil-Mitra se baat ki, unhone exact fertiliser bataya. Is season yield 40% badh gayi. Bahut shukriya!',
              avatar: 'SD',
              color: '#ffb95f',
            },
            {
              name: 'Gurpreet Singh',
              location: 'Amritsar, Punjab',
              crop: 'Cotton',
              stars: 5,
              text: 'Soil test report se pata chala ki mere khet mein zinc ki kami hai. Lab report was so detailed and helpful.',
              avatar: 'GS',
              color: '#c0c6db',
            },
          ].map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} fill="#ffb95f" color="#ffb95f" />)}
              </div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: `${t.color}30`, color: t.color }}>{t.avatar}</div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-meta">{t.crop} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════════════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <div className="section-label"><Sparkles size={12} /> Join Today</div>
          <h2 className="cta-title">The future of Indian farming<br />starts with <span className="text-emerald">one click.</span></h2>
          <p className="cta-sub">Free to join. No hidden fees. Trusted by farmers across 18 states.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-outline-lg">Already a member? Log in</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ══════════════════════════════ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon"><Leaf size={18} /></div>
              <span className="logo-text">FarmHith</span>
            </div>
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
