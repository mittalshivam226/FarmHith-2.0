'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, Sparkles, Leaf, Clock } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', contactInfo: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactInfo.trim() || !formData.message.trim()) {
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('success');
      setFormData({ name: '', contactInfo: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

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
          <Sparkles size={14} /> Farmer Helpdesk & Operations
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          We&apos;re here to <br />
          <span className="text-gradient-emerald">support your harvest.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Questions about soil test status, booking a private video session with a crop doctor, or listing your stubble? Reach out anytime.
        </p>
      </section>

      {/* ═══════════════ CONTACT SPLIT ═══════════════════════ */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (5 Cols): Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Toll-Free Farmer Line</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">1800-123-4567</div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-2">
                <Clock size={14} /> Monday to Saturday, 9:00 AM to 6:00 PM IST
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Email Support</div>
              <a href="mailto:support@farmhith.com" className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors block mb-1">
                support@farmhith.com
              </a>
              <p className="text-xs text-slate-500">Typical response time: Under 4 hours</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">National Headquarters</div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                FarmHith Technologies Pvt. Ltd.<br />
                S.R.M. Institute of Science and Technology,<br />
                Kattankulathur, Chennai - 603203, Tamil Nadu, India
              </p>
            </div>
          </div>

          {/* Right Column (7 Cols): Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Send an Inquiry to Our Agronomists</h3>
            <p className="text-sm text-slate-500 mb-8">
              Fill out your details below and a regional officer will contact you.
            </p>

            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-8 text-center">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Inquiry Received!</h4>
                <p className="text-emerald-800 text-sm mb-6 leading-relaxed">
                  Thank you for reaching out to FarmHith. An agronomy coordinator will call or email you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-primary-700 font-bold hover:underline text-sm uppercase tracking-wider"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number or Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="e.g. +91 98765 43210 or name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Message / Farm Query <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your soil testing query, crop health problem, or stubble listing..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center font-medium">
                    Failed to send message. Please check your connection or call our toll-free line.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>{status === 'loading' ? 'Sending Message...' : 'Submit Farm Inquiry'}</span>
                </button>
              </form>
            )}
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
