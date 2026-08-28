'use client';
import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { CursorGlow } from '../components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from '../components/Animations';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', contactInfo: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen">
      <CursorGlow />
      <WebsiteNav />

      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8">
              <MessageSquare size={14} />
              <span>Get in Touch</span>
            </div>
          </FadeIn>
          <StaggerText 
            text="We're here to help you grow." 
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" 
            delay={0.1}
          />
          <FadeIn delay={0.4}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have a question about soil testing, our marketplace, or becoming a Soil-Mitra? Reach out to our dedicated support team.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="flex flex-col gap-6">
            <SlideIn direction="left" delay={0.1}>
              <h3 className="text-3xl font-black text-white mb-6">Contact Information</h3>
            </SlideIn>
            
            <SlideIn direction="left" delay={0.2}>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6 shadow-glow-sm hud-element hover:border-slate-700 transition-colors">
                <div className="bg-primary-500/10 p-4 rounded-xl text-primary-400 border border-primary-500/20 shadow-glow-sm shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Head Office</h4>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    S.R.M. Institute of Science and Technology,<br />
                    Kattankulathur, Chennai - 603203<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="left" delay={0.3}>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6 shadow-glow-sm hud-element hover:border-slate-700 transition-colors">
                <div className="bg-primary-500/10 p-4 rounded-xl text-primary-400 border border-primary-500/20 shadow-glow-sm shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Email Us</h4>
                  <p className="text-primary-400 font-bold text-lg hover:text-primary-300 transition-colors cursor-pointer">support@farmhith.com</p>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="left" delay={0.4}>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-start gap-6 shadow-glow-sm hud-element hover:border-slate-700 transition-colors">
                <div className="bg-primary-500/10 p-4 rounded-xl text-primary-400 border border-primary-500/20 shadow-glow-sm shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Call Us (Toll Free)</h4>
                  <p className="text-primary-400 font-black text-2xl tracking-wide">1800-123-4567</p>
                  <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider">Mon-Sat, 9:00 AM to 6:00 PM</p>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Contact Form */}
          <ZoomIn delay={0.5}>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-10 shadow-glow-md hud-element h-full flex flex-col">
              <h3 className="text-3xl font-black text-white mb-8">Send us a message</h3>
              {status === 'success' ? (
                <div className="bg-success-500/10 border border-success-500/30 text-success-400 rounded-2xl p-8 text-center flex-1 flex flex-col justify-center shadow-glow-sm">
                  <h4 className="text-2xl font-black mb-3">Message Sent Successfully!</h4>
                  <p className="text-success-400/80 mb-6 font-medium">Thank you for reaching out. Our support team will contact you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-primary-400 font-bold hover:text-primary-300 transition-colors uppercase tracking-wider">Send another message</button>
                </div>
              ) : (
                <form className="flex flex-col gap-6 flex-1" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 font-bold text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Ramesh Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Phone Number / Email</label>
                    <input type="text" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 font-bold text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-600" placeholder="Enter contact details" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Message</label>
                    <textarea rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 font-bold text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none placeholder:text-slate-600 h-[calc(100%-2rem)]" placeholder="How can we help you?"></textarea>
                  </div>
                  {status === 'error' && <p className="text-red-400 font-bold text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">Failed to send message. Please try again.</p>}
                  <button disabled={status === 'loading'} className="bg-primary-500 text-slate-950 font-black justify-center py-4 rounded-xl text-lg hover:bg-primary-400 transition-all shadow-glow-md disabled:opacity-50 mt-2">
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </ZoomIn>

        </div>
      </section>
    </div>
  );
}
