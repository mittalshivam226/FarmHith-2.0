'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, Sparkles, Leaf } from 'lucide-react';
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
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      {/* ═══════════════ HERO ════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="section-label mb-6">
            <Sparkles size={14} />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            We&apos;re here to <br />
            <span className="text-emerald">help you grow.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about lab testing, scheduling a video advisory, or selling stubble? Our team is always ready to assist.
          </p>
        </div>
      </section>

      {/* ═══════════════ CONTACT GRID ════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Contact Information */}
          <div className="space-y-6">
            <div>
              <div className="section-label mb-4">
                <MessageSquare size={14} /> Direct Channels
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Reach our agronomy support desk</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Connect with our state coordinators or customer care executives through any of the channels below.
              </p>
            </div>

            {/* Address Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Registered Headquarters</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  FarmHith Technologies Pvt. Ltd.<br />
                  S.R.M. Institute of Science and Technology,<br />
                  Kattankulathur, Chennai - 603203, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-1">For general inquiries, partnerships, and lab onboarding:</p>
                <a href="mailto:support@farmhith.com" className="text-base font-bold text-primary-700 hover:text-primary-800">
                  support@farmhith.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Farmer Helpline (Toll-Free)</h3>
                <p className="text-2xl font-black text-primary-700 tracking-tight">1800-123-4567</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Monday – Saturday, 9:00 AM to 6:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Message Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h3>
            <p className="text-sm text-slate-600 mb-8">
              Fill out your details below and a representative will respond within 24 hours.
            </p>

            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-8 text-center">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p className="text-emerald-800 text-sm mb-6 leading-relaxed">
                  Thank you for reaching out to FarmHith. An agronomy representative will get back to you shortly.
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Full Name <span className="text-red-500">*</span>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    How can we assist you? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your farm, soil test query, or residue listing..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center font-medium">
                    Failed to send message. Please check your connection or call our helpline directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary-full text-center flex items-center justify-center gap-2 py-3.5 shadow-sm hover:shadow-md"
                >
                  <Send size={18} />
                  <span>{status === 'loading' ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
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
