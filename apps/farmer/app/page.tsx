'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  FlaskConical, Users, ShoppingBasket, ArrowRight,
  Leaf, Shield, TrendingUp, Star, Sparkles, ChevronRight,
  CheckCircle, Video, FileText, Award
} from 'lucide-react';
import WebsiteNav from './components/WebsiteNav';

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

  return (
    <div className="landing-root">
      {/* ── Ambient Backgrounds ─────────────────────────────────────── */}
      <div className="bg-pattern" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* ── Floating Graphics ───────────────────────────────────────── */}
      <div className="floating-graphic float-1"><Leaf size={64} /></div>
      <div className="floating-graphic float-2"><FlaskConical size={64} /></div>
      <div className="floating-graphic float-3"><Sparkles size={64} /></div>

      {/* ═══════════════ NAVBAR ══════════════════════════════ */}
      <WebsiteNav />

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
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

        {/* Triple Block Layout (Inspiration from Wix) */}
        <div className="w-full max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animation: 'heroFadeUp 1s 0.5s ease both' }}>
          
          {/* Block 1: Laboratory */}
          <div className="relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-8 shadow-2xl group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003333] via-transparent to-transparent opacity-90" />
            <div className="relative z-10 text-left">
              <h3 className="text-white text-2xl font-bold mb-2">About Our Laboratory</h3>
              <p className="text-gray-200 text-sm mb-4">NABL certified facilities ensuring maximum accuracy.</p>
              <Link href="/about" className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#D2B48C] transition-colors">
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Block 2: Soil Services (Tan Block) */}
          <div className="relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-center p-10 shadow-2xl bg-[#D2B48C] text-[#003333] group">
            <div className="relative z-10 text-center">
              <FlaskConical size={48} className="mx-auto mb-6 opacity-80" />
              <h3 className="text-3xl font-extrabold mb-4">Soil Testing Services</h3>
              <p className="text-[#004d40] text-base mb-8 font-medium">Dedicated to providing accurate soil testing to help you optimize yields and make informed decisions.</p>
              <Link href="/dashboard/soil-test" className="btn-primary-sm justify-center py-3 text-lg">
                Get Started
              </Link>
            </div>
          </div>

          {/* Block 3: Educational Resources */}
          <div className="relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-8 shadow-2xl group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003333] via-transparent to-transparent opacity-90" />
            <div className="relative z-10 text-left">
              <h3 className="text-white text-2xl font-bold mb-2">Educational Resources</h3>
              <p className="text-gray-200 text-sm mb-4">Enhance your understanding of soil management.</p>
              <Link href="/features" className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#D2B48C] transition-colors">
                Explore Resources <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
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
        <div className="section-label"><Sparkles size={14} /> Core Services</div>
        <h2 className="section-title">Everything your farm needs,<br /><span className="text-emerald">in one place.</span></h2>
        <p className="section-sub">Three powerful services designed to maximise your farm&apos;s potential.</p>

        <div className="features-grid">
          {[
            {
              icon: <FlaskConical size={32} />,
              tag: 'Soil Excellence',
              title: 'Precision Soil Testing',
              desc: 'Book certified lab tests for your fields. Get detailed NPK reports, pH analysis, and personalised crop recommendations — all in your language.',
              bullets: ['NABL-certified labs', 'Reports in 5 days', 'Multilingual results'],
              cta: '/dashboard/soil-test',
              ctaText: 'Book a Test',
            },
            {
              icon: <Video size={32} />,
              tag: 'Expert Guidance',
              title: 'Your Soil-Mitra Awaits',
              desc: 'Connect with verified agricultural experts for 1-on-1 video consultations. Solve crop diseases, soil problems, and yield challenges — live.',
              bullets: ['Video & voice calls', 'Share your soil reports', 'Rated & verified experts'],
              cta: '/dashboard/mitra',
              ctaText: 'Find a Mitra',
            },
            {
              icon: <ShoppingBasket size={32} />,
              tag: 'Waste to Wealth',
              title: 'Sell Crop Residue',
              desc: 'Stop burning stubble. List your paddy straw, wheat straw, and other crop residue on the marketplace and earn from bio-pellet plants.',
              bullets: ['FarmHith assured prices', 'Free pickup logistics', 'Same-week payment'],
              cta: '/dashboard/marketplace',
              ctaText: 'List Your Residue',
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon-wrap">
                {f.icon}
              </div>
              <div className="feature-tag">{f.tag}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <ul className="feature-bullets">
                {f.bullets.map(b => (
                  <li key={b}><CheckCircle size={16} />{b}</li>
                ))}
              </ul>
              <Link href={f.cta} className="feature-cta">
                {f.ctaText} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="split-section">
            <div className="split-image">
                <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" alt="Smart Farming" />
            </div>
            <div className="split-content">
                <div className="section-label"><Award size={14} /> Premium Quality</div>
                <h2 className="section-title">Farming upgraded for the digital age.</h2>
                <p className="section-sub">We combine traditional agricultural wisdom with modern technology to deliver the best results for your farm. Easy to use, fully transparent, and always focused on your growth.</p>
                <ul className="feature-bullets" style={{ fontSize: '1.1rem', gap: '1rem' }}>
                    <li><CheckCircle size={20} /> Real-time tracking of soil test reports</li>
                    <li><CheckCircle size={20} /> Transparent pricing for crop residue</li>
                    <li><CheckCircle size={20} /> Verified network of expert Soil-Mitras</li>
                </ul>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/features" className="btn-primary-sm" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                        Explore All Features <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>

      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════════ */}
      <section id="how-it-works" className="section how-section">
        <div className="section-label"><Sparkles size={14} /> Simple Process</div>
        <h2 className="section-title">From field to results<br /><span className="text-gold">in 3 easy steps.</span></h2>

        <div className="steps-grid">
          {[
            { num: '01', title: 'Create Your Account', desc: 'Register in under 2 minutes — just your name, village, and primary crop. No complex forms.', icon: <Shield size={32} /> },
            { num: '02', title: 'Choose Your Service', desc: 'Book a soil test, find a Mitra expert, or list your crop residue for sale. Everything in one dashboard.', icon: <Leaf size={32} /> },
            { num: '03', title: 'Grow & Earn More', desc: 'Act on expert recommendations, get paid for your residue, and watch your farm thrive season after season.', icon: <TrendingUp size={32} /> },
          ].map((step, i) => (
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
      <section id="testimonials" className="section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="section-label"><Star size={14} /> Farmer Stories</div>
        <h2 className="section-title">Real farmers.<br /><span className="text-emerald">Real results.</span></h2>

        <div className="testimonials-wrapper mt-10">
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
          <div className="cta-glow" />
          <div className="section-label" style={{ background: '#ffffff', color: '#00838F', borderColor: '#e6e0d4' }}><Sparkles size={14} /> Join Today</div>
          <h2 className="cta-title">The future of Indian farming<br />starts with <span className="text-emerald">one click.</span></h2>
          <p className="cta-sub">Free to join. No hidden fees. Trusted by farmers across 18 states.</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-outline-lg">Already a member? Log in</Link>
          </div>
        </div>
        <div className="cta-graphic">
            <Leaf size={400} color="#00838F" />
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
              <Link href="/blog" className="footer-link">Blog & Resources</Link>
              <Link href="/faq" className="footer-link">FAQs</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
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
