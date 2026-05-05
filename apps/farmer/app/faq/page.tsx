'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does a soil test take?',
      a: 'Once your soil sample is collected from your farm, it takes exactly 5 working days for the digital report to be generated and visible on your FarmHith dashboard.'
    },
    {
      q: 'How do I sell my crop residue?',
      a: 'Go to the Marketplace section in your dashboard, click "List Residue", select the type (e.g. Paddy Straw) and estimated quantity. Verified Bio-Pellet plants will contact you with their prices.'
    },
    {
      q: 'Are the Soil-Mitras qualified experts?',
      a: 'Yes! All our Soil-Mitras undergo a strict verification process. They hold degrees in Agricultural Sciences and have verified field experience before they are allowed to consult on the platform.'
    },
    {
      q: 'Is the FarmHith portal free to use?',
      a: 'Registration and using the platform features are 100% free. You only pay standard fees for laboratory soil tests and a nominal consultation fee if you choose to book a video call with a Soil-Mitra.'
    },
    {
      q: 'Can I view the app in my local language?',
      a: 'We are currently rolling out multi-language support. Very soon, you will be able to switch the entire dashboard to Hindi, Punjabi, Marathi, or Telugu.'
    }
  ];

  return (
    <div className="landing-root">
      <div className="bg-pattern" />
      <WebsiteNav />

      <section className="section" style={{ paddingTop: '12rem' }}>
        <div className="section-label"><HelpCircle size={14} /> Support</div>
        <h1 className="section-title">Frequently Asked <span className="text-emerald">Questions</span></h1>
        <p className="section-sub">Everything you need to know about FarmHith, soil testing, and the marketplace.</p>

        <div className="max-w-3xl mx-auto text-left">
          {faqs.map((faq, i) => (
            <div key={i} className="mb-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0f172a] mb-2 flex justify-between items-center">
                {faq.q}
                <ChevronDown size={20} className="text-[#00838F]" />
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#f2f0eb] border border-[#D2B48C] rounded-[24px] p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#003333] mb-4">Still have questions?</h3>
          <p className="text-[#006064] font-medium mb-6">Our support team is here to help you get the most out of your farm.</p>
          <Link href="/contact" className="btn-primary-sm inline-flex justify-center w-auto mx-auto py-3 px-8 text-lg">
            Contact Support <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
