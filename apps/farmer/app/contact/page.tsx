'use client';
import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

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
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      <section className="section" style={{ paddingTop: '12rem' }}>
        <div className="section-label"><MessageSquare size={14} /> Get in Touch</div>
        <h1 className="section-title">We&apos;re here to <span className="text-emerald">help you grow.</span></h1>
        <p className="section-sub">Have a question about soil testing, our marketplace, or becoming a Soil-Mitra? Reach out to our dedicated support team.</p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 text-left">
          
          {/* Contact Information */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Contact Information</h3>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="bg-[#f2f0eb] p-3 rounded-xl text-[#006064]"><MapPin size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Head Office</h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  S.R.M. Institute of Science and Technology,<br />
                  Kattankulathur, Chennai - 603203<br />
                  Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="bg-[#f2f0eb] p-3 rounded-xl text-[#006064]"><Mail size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                <p className="text-gray-600 font-medium">support@farmhith.com</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="bg-[#f2f0eb] p-3 rounded-xl text-[#006064]"><Phone size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Call Us (Toll Free)</h4>
                <p className="text-gray-600 font-medium">1800-123-4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Sat, 9:00 AM to 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-[#0f172a] mb-6">Send us a message</h3>
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center">
                <h4 className="font-bold text-lg mb-2">Message Sent Successfully!</h4>
                <p>Thank you for reaching out. Our support team will contact you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-[#00838F] font-bold underline">Send another message</button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-[#00838F] outline-none transition-colors" placeholder="e.g. Ramesh Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number / Email</label>
                  <input type="text" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-[#00838F] outline-none transition-colors" placeholder="Enter contact details" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-[#00838F] outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                {status === 'error' && <p className="text-red-500 font-medium text-sm">Failed to send message. Please try again.</p>}
                <button disabled={status === 'loading'} className="btn-primary-sm justify-center py-3 text-lg mt-2 w-full disabled:opacity-50">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
