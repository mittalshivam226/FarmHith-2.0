'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle, Phone, Search, Leaf } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

const FAQS = [
  {
    category: 'Soil Testing',
    q: 'How long does a laboratory soil test take to complete?',
    a: 'Once your soil sample is collected from your farm, our partner NABL-accredited laboratory processes it immediately. You will receive an SMS notification and access to your comprehensive digital report on your FarmHith dashboard within 5 working days.'
  },
  {
    category: 'Stubble Marketplace',
    q: 'How do I sell my crop residue on the marketplace?',
    a: 'After logging into your farmer dashboard, navigate to "Residue Market" and click "List Residue". Specify your crop type (e.g., Paddy Straw, Wheat Straw), estimated metric tonnage, and farm location. Verified bio-pellet plants will submit procurement orders at FarmHith-assured floor prices, and we coordinate pickup directly from your field.'
  },
  {
    category: 'Soil-Mitra',
    q: 'Who are the Soil-Mitras and what are their qualifications?',
    a: 'Soil-Mitras are certified agricultural officers, agronomists, and crop health specialists holding degrees in Agricultural Science (B.Sc, M.Sc, or Ph.D). Every expert undergoes credential verification and quality audits before conducting 1-on-1 consultations.'
  },
  {
    category: 'Platform & Fees',
    q: 'Is registering on the FarmHith portal free?',
    a: 'Yes, registration and dashboard access are 100% free. There are no annual subscriptions or hidden platform fees. You only pay transparent, standardized charges when ordering lab tests or booking private video consultations.'
  },
  {
    category: 'Stubble Marketplace',
    q: 'What types of crop residue can I sell?',
    a: 'FarmHith supports a wide range of agricultural residues, including Paddy Straw, Wheat Straw, Sugarcane Trash/Bagasse, Cotton Stalks, Mustard Husk, and Maize Stover. All biomass is diverted from burning into eco-friendly bio-pellets and clean energy.'
  },
  {
    category: 'Soil Testing',
    q: 'Can I view my soil test reports in my regional language?',
    a: 'Yes! All digital test results and fertiliser recommendations can be viewed and downloaded in Hindi, Punjabi, Marathi, Telugu, and English, making scientific agronomy accessible to every farming family.'
  },
  {
    category: 'Platform & Fees',
    q: 'How are residue payments sent to farmers?',
    a: 'Payments are processed directly via secure NEFT / IMPS / UPI bank transfer to the registered farmer account within 7 business days of physical pickup and automated weighbridge verification.'
  }
];

const CATEGORIES = ['All Questions', 'Soil Testing', 'Stubble Marketplace', 'Soil-Mitra', 'Platform & Fees'];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === 'All Questions' || faq.category === selectedCategory;
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="landing-root bg-[#fbfdfa] text-slate-900">
      <WebsiteNav />

      {/* Ambient background light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-100/35 blur-[140px]" />
      </div>

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative z-10 pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles size={14} /> Help Center & Knowledge Base
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Frequently Asked <br />
          <span className="text-gradient-emerald">Questions.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
          Clear answers about sample collection, lab testing turnaround, agronomist credentials, and stubble payments.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. soil test, payment, stubble)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════ ACCORDION ═══════════════════════════ */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
              <p className="text-sm text-slate-500 mt-1">Try a different search keyword or contact our support desk.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
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
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                        {faq.category}
                      </span>
                      <span className={`text-base sm:text-lg font-bold block ${isOpen ? 'text-primary-800' : 'text-slate-900'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`p-1.5 rounded-full transition-colors shrink-0 ${isOpen ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Help Box */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-primary-700 shadow-sm mb-4">
            <HelpCircle size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Have a question not listed here?</h3>
          <p className="text-slate-600 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Our farmer support team is available Monday to Saturday (9:00 AM to 6:00 PM IST) via toll-free phone and email.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm shadow-sm flex items-center gap-2">
              <MessageCircle size={18} /> Contact Support Desk
            </Link>
            <a href="tel:18001234567" className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2">
              <Phone size={18} /> Call 1800-123-4567
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ══════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
