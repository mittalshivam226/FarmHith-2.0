'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle, Phone, Leaf } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does a laboratory soil test take?',
      a: 'Once your soil sample is picked up from your farm, our partner NABL-accredited laboratory processes it immediately. You will receive an SMS notification and access to your comprehensive digital report on your FarmHith dashboard within 5 working days.'
    },
    {
      q: 'How do I sell my crop residue on the marketplace?',
      a: 'After logging into your farmer dashboard, navigate to "Residue Market" and click "List Residue". Specify your crop type (e.g., Paddy Straw, Wheat Straw), estimated metric tonnage, and farm location. Verified bio-pellet plants will submit procurement orders at FarmHith-assured floor prices, and we coordinate pickup directly from your field.'
    },
    {
      q: 'Who are the Soil-Mitras and what are their qualifications?',
      a: 'Soil-Mitras are certified agricultural officers, agronomists, and crop health specialists holding degrees in Agricultural Science (B.Sc, M.Sc, or Ph.D). Every expert undergoes credential verification and quality audits before conducting 1-on-1 consultations.'
    },
    {
      q: 'Is registering on the FarmHith portal free?',
      a: 'Yes, registration and dashboard access are 100% free. There are no annual subscriptions or hidden platform fees. You only pay transparent, standardized charges when ordering lab tests or booking private video consultations.'
    },
    {
      q: 'What types of crop residue can I sell?',
      a: 'FarmHith supports a wide range of agricultural residues, including Paddy Straw, Wheat Straw, Sugarcane Trash/Bagasse, Cotton Stalks, Mustard Husk, and Maize Stover. All biomass is diverted from burning into eco-friendly bio-pellets and clean energy.'
    },
    {
      q: 'Can I view my soil test reports in my regional language?',
      a: 'Yes! All digital test results and fertiliser recommendations can be viewed and downloaded in Hindi, Punjabi, Marathi, Telugu, and English, making scientific agronomy accessible to every farming family.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="section-label mb-6">
            <Sparkles size={14} />
            <span>Support & Guidance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Frequently Asked <br />
            <span className="text-emerald">Questions.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about soil diagnostics, video advisory, payment timelines, and residue procurement.
          </p>
        </div>
      </section>

      {/* ═══════════════ FAQS ACCORDION ══════════════════════ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-primary-300 shadow-md ring-1 ring-primary-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base md:text-lg font-bold ${isOpen ? 'text-primary-800' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full transition-colors shrink-0 ${isOpen ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout Box */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-primary-200 flex items-center justify-center text-primary-700 shadow-sm mb-5">
            <HelpCircle size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Have a question not answered here?</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-6 text-sm md:text-base leading-relaxed">
            Our farmer support team is available Monday to Saturday (9:00 AM to 6:00 PM) via toll-free phone and email.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary-sm" style={{ display: 'inline-flex', padding: '0.75rem 1.75rem' }}>
              <MessageCircle size={18} /> Contact Support
            </Link>
            <a href="tel:18001234567" className="btn-outline-lg" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}>
              <Phone size={18} /> Call 1800-123-4567
            </a>
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
            <p className="footer-tagline">Empowering Indian farmers with scientific precision, expert advisory, and sustainable biomass revenue.</p>
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
              <Link href="/blog" className="footer-link">Blog</Link>
              <Link href="/faq" className="footer-link">FAQs</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
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
