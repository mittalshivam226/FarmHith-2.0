'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import WebsiteNav from '../components/WebsiteNav';
import { CursorGlow } from '../components/CursorGlow';
import { FadeIn, SlideIn, ZoomIn, StaggerText } from '../components/Animations';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="landing-root bg-slate-950 text-slate-100 min-h-screen">
      <CursorGlow />
      <WebsiteNav />

      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="cyber-grid opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-8">
              <HelpCircle size={14} />
              <span>Support</span>
            </div>
          </FadeIn>
          <StaggerText 
            text="Frequently Asked Questions" 
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" 
            delay={0.1}
          />
          <FadeIn delay={0.4}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about FarmHith, soil testing, and the marketplace.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-left space-y-4">
          {faqs.map((faq, i) => (
            <SlideIn key={i} delay={i * 0.1} direction="left">
              <div 
                className={`border rounded-2xl overflow-hidden transition-colors cursor-pointer hud-element ${
                  openIndex === i ? 'bg-slate-900 border-primary-500/30 shadow-glow-sm' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className={`text-lg font-bold ${openIndex === i ? 'text-primary-400' : 'text-slate-100'}`}>
                    {faq.q}
                  </h3>
                  {openIndex === i ? (
                    <ChevronUp size={20} className="text-primary-400 shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-500 shrink-0" />
                  )}
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-slate-400 font-medium leading-relaxed border-t border-slate-800/50 mt-2">
                        <div className="pt-4">{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SlideIn>
          ))}
        </div>

        <ZoomIn delay={0.6}>
          <div className="mt-20 bg-primary-500/10 border border-primary-500/30 rounded-3xl p-12 max-w-3xl mx-auto text-center shadow-glow-md hud-element">
            <h3 className="text-3xl font-black text-white mb-4">Still have questions?</h3>
            <p className="text-primary-400 font-medium mb-8 text-lg">Our support team is here to help you get the most out of your farm.</p>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-400 transition-all shadow-glow-md">
              Contact Support <ArrowRight size={18} />
            </Link>
          </div>
        </ZoomIn>
      </section>
    </div>
  );
}
