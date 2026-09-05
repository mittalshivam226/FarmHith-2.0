'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  FlaskConical, Users, ArrowRight,
  Leaf, Shield, TrendingUp, Star, ChevronRight,
  CheckCircle, Award, Sparkles, Building2, ExternalLink,
  Sliders, Activity, DollarSign, CloudRain, Video,
  Clock, CheckCircle2, PhoneCall, HelpCircle
} from 'lucide-react';
import WebsiteNav from './components/WebsiteNav';
import { FadeIn, SlideIn, ZoomIn } from './components/Animations';

interface CropResidueData {
  name: string;
  tonsPerAcre: number;
  pricePerTon: number;
  co2Factor: number; // kg CO2 per ton
}

const RESIDUE_RATES: Record<string, CropResidueData> = {
  paddy: { name: 'Paddy / Rice Straw (धान की पराली)', tonsPerAcre: 2.2, pricePerTon: 2400, co2Factor: 2400 },
  wheat: { name: 'Wheat Straw (गेहूं का भूसा)', tonsPerAcre: 1.8, pricePerTon: 3200, co2Factor: 2100 },
  sugarcane: { name: 'Sugarcane Bagasse & Trash (गन्ने का खोई)', tonsPerAcre: 3.5, pricePerTon: 2100, co2Factor: 2600 },
  cotton: { name: 'Cotton Stalks (कपास की डंडियां)', tonsPerAcre: 1.5, pricePerTon: 2600, co2Factor: 1900 },
  mustard: { name: 'Mustard Husk (सरसों की तूड़ी)', tonsPerAcre: 1.2, pricePerTon: 2800, co2Factor: 1800 },
};

const SOIL_PRESETS = [
  {
    name: 'Depleted Nitrogen (Deficient)',
    n: 'Low', p: 'Moderate', k: 'High', ph: 6.2,
    healthScore: 58,
    diagnosis: 'Severe Nitrogen deficiency detected. Micro-nodule absorption is restricted.',
    dosage: 'Apply Urea (45 kg/acre) + Bio-Azotobacter culture with first irrigation.',
    yieldBoost: '+38%',
  },
  {
    name: 'Acidic Soil (Low pH)',
    n: 'Moderate', p: 'Low', k: 'Moderate', ph: 5.4,
    healthScore: 62,
    diagnosis: 'High acidity locking Phosphorus intake. Risk of root stunting.',
    dosage: 'Broadcast Agricultural Lime (150 kg/acre) 14 days before sowing + SSP (50 kg/acre).',
    yieldBoost: '+29%',
  },
  {
    name: 'Balanced Fertile Soil (Optimal)',
    n: 'Optimal', p: 'Optimal', k: 'Optimal', ph: 6.8,
    healthScore: 92,
    diagnosis: 'Excellent NPK balance and balanced pH. Ready for premium high-yield cultivation.',
    dosage: 'Standard maintenance dosing: DAP (25 kg/acre) + Organic Compost.',
    yieldBoost: '+18%',
  },
];

const EXPERTS = [
  {
    name: 'Dr. Vikramaditya Sharma',
    degree: 'Ph.D in Agronomy (PAU Ludhiana)',
    exp: '14+ Years Experience',
    specialty: 'Cereal Crops & Soil Chemistry',
    langs: ['Hindi', 'Punjabi', 'English'],
    rating: 4.98,
    reviews: 1420,
    avatar: 'VS',
    status: 'Online Now',
  },
  {
    name: 'Dr. Ananya Kulkarni',
    degree: 'M.Sc in Plant Pathology (IARI New Delhi)',
    exp: '9+ Years Experience',
    specialty: 'Disease Diagnosis & Organic Pest Control',
    langs: ['Marathi', 'Hindi', 'English'],
    rating: 4.95,
    reviews: 980,
    avatar: 'AK',
    status: 'Online Now',
  },
  {
    name: 'Sardar Harpal Singh',
    degree: 'Ex-Chief Agriculture Officer',
    exp: '22+ Years Field Advisory',
    specialty: 'Stubble Monetization & Nutrient Management',
    langs: ['Punjabi', 'Hindi'],
    rating: 5.0,
    reviews: 2150,
    avatar: 'HS',
    status: 'In Session (Next slot 15m)',
  },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === 'FARMER') router.replace('/dashboard');
  }, [user, isLoading, router]);

  // Calculator State
  const [acres, setAcres] = useState<number>(12);
  const [selectedResidue, setSelectedResidue] = useState<string>('paddy');

  // Soil Simulator State
  const [selectedSoilPreset, setSelectedSoilPreset] = useState<number>(0);

  // Live Activity Notification Index
  const [activityIdx, setActivityIdx] = useState<number>(0);
  const activities = [
    '🌾 Harpreet S. from Ludhiana, Punjab sold 22 Tons Paddy Straw • ₹52,800 paid directly',
    '🔬 Lab sample collected in Nashik, Maharashtra — 5-Day NPK Analysis initiated',
    '👨‍⚕️ Ramesh Patel from Gujarat completed video consultation with Dr. Sharma • 5★ Rating',
    '💰 Baldev Singh from Amritsar received ₹38,400 residue payout in registered bank account',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIdx((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activities.length]);

  const calcResults = useMemo(() => {
    const data = RESIDUE_RATES[selectedResidue] || RESIDUE_RATES.paddy;
    const totalTons = Math.round(acres * data.tonsPerAcre * 10) / 10;
    const revenue = Math.round(totalTons * data.pricePerTon);
    const co2Saved = Math.round(totalTons * data.co2Factor);
    const logisticsSaved = Math.round(totalTons * 650);
    return { totalTons, revenue, co2Saved, logisticsSaved };
  }, [acres, selectedResidue]);

  if (isLoading || user?.role === 'FARMER') return null;

  return (
    <div className="landing-root bg-[#fbfdfa] text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900">
      <WebsiteNav />

      {/* ═══════════════ AMBIENT GLOW MESH BACKGROUND ═══════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-200/40 via-amber-100/25 to-transparent blur-[140px]" />
        <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px]" />
        <div className="absolute top-[1600px] left-0 w-[600px] h-[600px] bg-amber-100/25 blur-[140px]" />
      </div>

      {/* ═══════════════ HERO SECTION ══════════════════════════════ */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-emerald-500/20 text-xs sm:text-sm font-bold text-emerald-900 mb-8 shadow-sm hover:border-emerald-500/40 transition-all">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span>Pan-India Agricultural Operating Network • 18 States Live</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl leading-[1.08] mb-6">
          The Precision Operating System for{' '}
          <span className="text-gradient-emerald">Indian Agriculture.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed font-medium">
          Eliminate agricultural guesswork. Book accredited 5-day soil diagnostics, consult verified agronomists on live video, and turn crop stubble into guaranteed seasonal income.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-primary-700 to-emerald-600 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_30px_rgba(46,125,50,0.35)] hover:shadow-[0_15px_40px_rgba(46,125,50,0.45)] hover:-translate-y-0.5 transition-all group"
          >
            <span>Create Free Farmer Account</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 font-bold text-base sm:text-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
          >
            <DollarSign size={20} className="text-amber-600" />
            <span>Calculate Stubble Revenue</span>
          </a>
        </div>

        {/* Live Activity Ticker Toast */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-emerald-900/10 rounded-2xl py-3 px-5 shadow-md flex items-center gap-3 text-left mb-14">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Activity size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">Live Network Activity</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
              {activities[activityIdx]}
            </div>
          </div>
        </div>

        {/* Visual Hero Showcase with Floating Indicators */}
        <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1800&auto=format&fit=crop"
            alt="FarmHith Digital Smart Farm"
            className="w-full h-auto object-cover max-h-[500px] opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Floating Pill Left */}
          <div className="hidden sm:flex absolute top-6 left-6 items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg animate-float">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FlaskConical size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">600+ NABL Testing Labs</div>
              <div className="text-[11px] text-emerald-700 font-semibold">5-Day Guaranteed SLA</div>
            </div>
          </div>

          {/* Floating Pill Right */}
          <div className="hidden sm:flex absolute bottom-8 right-8 items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg animate-float-delayed">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">₹8.4 Cr+ Paid for Stubble</div>
              <div className="text-[11px] text-amber-700 font-semibold">Zero-Burning Bio-Pellets</div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 sm:left-10 text-left text-white max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-400/40">
              <Sparkles size={12} /> Science Meets Technology
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-snug">
              Every soil sample tracked. Every crop ton valued.
            </h3>
          </div>
        </div>
      </section>

      {/* ═══════════════ IMPACT STATS STRIP ═════════════════════════ */}
      <section className="relative z-10 py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '50,000+', label: 'Registered Farmers', sub: 'Across 18 states & 120+ districts', icon: <Users size={22} className="text-primary-700" /> },
            { value: '5 Days', label: 'Guaranteed Test SLA', sub: 'From field sample to phone report', icon: <Clock size={22} className="text-emerald-700" /> },
            { value: '₹8.4 Cr+', label: 'Biomass Payouts', sub: '100% Direct bank transfers', icon: <TrendingUp size={22} className="text-amber-700" /> },
            { value: '600+', label: 'NABL Lab Partners', sub: 'ISO/IEC 17025 accredited network', icon: <Shield size={22} className="text-blue-700" /> },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">{stat.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FLASHY WIDGET 1: CROP RESIDUE CALCULATOR ════ */}
      <section id="calculator" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <DollarSign size={14} /> Interactive Stubble Revenue Estimator
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Stop burning stubble. <br />
            <span className="text-gradient-gold">See how much your field can earn.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Slide your total land size and choose your crop to view real-time guaranteed bio-pellet procurement returns.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-xl max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Select Your Crop Residue Type
                </label>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Floor Price Assured
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(RESIDUE_RATES).map(([key, data]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedResidue(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedResidue === key
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="text-xs font-bold">{key.toUpperCase()}</div>
                    <div className="text-[11px] text-slate-500 truncate">{data.name.split('(')[0]}</div>
                    <div className="text-xs font-extrabold text-amber-700 mt-1">₹{data.pricePerTon}/Ton</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Your Farm Land Area: <span className="text-emerald-700 text-xl font-black">{acres} Acres</span>
                </label>
                <span className="text-xs text-slate-500 font-semibold">1 to 100 Acres</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={acres}
                onChange={(e) => setAcres(parseInt(e.target.value))}
                className="farm-slider"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
                <span>1 Acre</span>
                <span>25 Acres</span>
                <span>50 Acres</span>
                <span>75 Acres</span>
                <span>100 Acres</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-3">
              <Shield size={24} className="text-emerald-700 shrink-0" />
              <div>
                <strong>FarmHith Guaranteed Floor Price:</strong> We coordinate free doorstep field pickup logistics. No transport deductions or mediator commission.
              </div>
            </div>
          </div>

          {/* Output Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-7 shadow-2xl flex flex-col justify-between h-full border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                Estimated Seasonal Earnings
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
                ₹{calcResults.revenue.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-300 mb-6">
                Direct NEFT / UPI transfer within 7 days of field pickup.
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Biomass Yield:</span>
                  <span className="font-bold text-white">{calcResults.totalTons} Metric Tons</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>CO₂ Diverted from Air:</span>
                  <span className="font-bold text-emerald-400">{calcResults.co2Saved.toLocaleString()} kg CO₂</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Free Pickup Subsidy Value:</span>
                  <span className="font-bold text-amber-400">₹{calcResults.logisticsSaved.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-center text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>List Your Stubble on Marketplace</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════ FLASHY WIDGET 2: SOIL LAB DIAGNOSTIC SIMULATOR */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <FlaskConical size={14} /> Interactive Diagnostic Simulator
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Precision Soil Diagnostics — <span className="text-gradient-emerald">Simulated.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              See how our partner NABL laboratories decode complex soil samples into actionable fertiliser prescriptions in simple terms.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
            {/* Preset Selector */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Click Sample Scenario to Test:
              </div>
              {SOIL_PRESETS.map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setSelectedSoilPreset(idx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedSoilPreset === idx
                      ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{preset.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      pH {preset.ph} • N: {preset.n} • P: {preset.p} • K: {preset.k}
                    </div>
                  </div>
                  <ChevronRight size={18} className={selectedSoilPreset === idx ? 'text-primary-700' : 'text-slate-400'} />
                </button>
              ))}

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> NABL Partner Standards
                </div>
                <p>Every real sample is tested for Nitrogen, Phosphorus, Potassium, Zinc, Boron, Sulfur, and Organic Carbon with GPS geo-tagging.</p>
              </div>
            </div>

            {/* Diagnostic Result Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Sample Lab Report Preview</div>
                  <h3 className="text-xl font-bold text-slate-900">{SOIL_PRESETS[selectedSoilPreset].name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500">Soil Health Score</div>
                  <div className="text-2xl font-black text-emerald-700">{SOIL_PRESETS[selectedSoilPreset].healthScore}/100</div>
                </div>
              </div>

              {/* Metric Badges */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-slate-50 text-center border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">pH Level</div>
                  <div className="text-base font-extrabold text-slate-900">{SOIL_PRESETS[selectedSoilPreset].ph}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-center border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Nitrogen (N)</div>
                  <div className={`text-base font-extrabold ${SOIL_PRESETS[selectedSoilPreset].n === 'Low' ? 'text-red-600' : 'text-emerald-700'}`}>
                    {SOIL_PRESETS[selectedSoilPreset].n}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-center border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Phosphorus (P)</div>
                  <div className="text-base font-extrabold text-slate-900">{SOIL_PRESETS[selectedSoilPreset].p}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-center border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Potassium (K)</div>
                  <div className="text-base font-extrabold text-slate-900">{SOIL_PRESETS[selectedSoilPreset].k}</div>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">Agronomist Diagnosis</div>
                <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  {SOIL_PRESETS[selectedSoilPreset].diagnosis}
                </p>
              </div>

              {/* Actionable Prescription */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Custom Fertiliser Dosing</span>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                    Expected Boost: {SOIL_PRESETS[selectedSoilPreset].yieldBoost}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
                  {SOIL_PRESETS[selectedSoilPreset].dosage}
                </p>
              </div>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Book Real Doorstep Soil Test (5-Day Guarantee)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FLASHY WIDGET 3: LIVE AGRONOMIST DIRECTORY ═ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Video size={14} /> Tele-Agronomy Network
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Consult Verified <span className="text-gradient-emerald">Soil-Mitra Experts.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            1-on-1 private video calls with certified agriculture officers and university agronomists whenever your crops face issues.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {EXPERTS.map((expert) => (
            <div
              key={expert.name}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center border border-emerald-200">
                    {expert.avatar}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    {expert.status}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{expert.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mb-3">{expert.degree} • {expert.exp}</p>

                <div className="text-xs font-bold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 mb-4">
                  🎯 Specialty: {expert.specialty}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.langs.map((l) => (
                    <span key={l} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Star size={16} fill="currentColor" />
                  <span>{expert.rating}</span>
                  <span className="text-xs text-slate-400 font-normal">({expert.reviews} calls)</span>
                </div>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ UNIFIED 4-PORTAL ECOSYSTEM ═════════════════ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Sparkles size={14} /> Integrated Agri-Stack
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Four Portals. One United Ecosystem.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              FarmHith synchronizes the entire agricultural supply chain across 4 specialized application hubs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Farmer Hub',
                desc: 'Instant soil test bookings, diagnostic history, agronomist video calls & stubble selling.',
                badge: 'Active Portal',
                link: '/register',
                cta: 'Register as Farmer',
                icon: <Leaf size={24} className="text-emerald-400" />,
                external: false,
              },
              {
                title: 'Soil-Mitra Portal',
                desc: 'Certified agriculture officers conducting live farmer calls and reviewing lab reports.',
                badge: 'Expert Hub',
                link: 'http://localhost:3002',
                cta: 'Open Mitra Portal',
                icon: <Users size={24} className="text-amber-400" />,
                external: true,
              },
              {
                title: 'Bio-Pellet Industry',
                desc: 'Large-scale biomass plants procuring stubble directly with verified digital weight slips.',
                badge: 'Industrial Buyer',
                link: 'http://localhost:3003',
                cta: 'Open Pellet Portal',
                icon: <Building2 size={24} className="text-blue-400" />,
                external: true,
              },
              {
                title: 'Testing Laboratories',
                desc: 'NABL accredited test facilities managing sample collection barcodes and digital signoffs.',
                badge: 'NABL Network',
                link: 'http://localhost:3004',
                cta: 'Open Lab Portal',
                icon: <FlaskConical size={24} className="text-purple-400" />,
                external: true,
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center">
                      {p.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{p.desc}</p>
                </div>

                {p.external ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-slate-700/60"
                  >
                    <span>{p.cta}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <Link
                    href={p.link}
                    className="inline-flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-slate-700/60"
                  >
                    <span>{p.cta}</span>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS (3 STEPS) ═════════════════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Clock size={14} /> Frictionless Workflow
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          From Field to Results in 3 Easy Steps.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-16 font-medium">
          Simple, intuitive, and designed specifically for smallholders and large-scale agriculturalists alike.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              step: '01',
              title: 'Create Free Account',
              desc: 'Register in under 2 minutes with your name, phone number, village, and primary crop. No cumbersome paperwork.',
              icon: <Shield size={28} className="text-primary-700" />,
            },
            {
              step: '02',
              title: 'Select Digital Service',
              desc: 'Book a certified doorstep soil test, schedule a video session with a crop doctor, or list your stubble for sale.',
              icon: <Leaf size={28} className="text-emerald-700" />,
            },
            {
              step: '03',
              title: 'Reap Verified Profits',
              desc: 'Follow custom lab fertilizer prescriptions for +30% yield and receive direct bank payouts for crop residue.',
              icon: <TrendingUp size={28} className="text-amber-700" />,
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-primary-300 transition-all relative overflow-hidden"
            >
              <div className="text-5xl font-black text-slate-100 tracking-tighter mb-4">{s.step}</div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FINAL HIGH-CONVERTING CTA ══════════════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-primary-800 to-emerald-950 text-white p-8 sm:p-16 text-center shadow-2xl relative overflow-hidden border border-emerald-500/30">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">
              <Sparkles size={14} /> Join 50,000+ Indian Farmers
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
              The future of your farm starts with one click.
            </h2>
            <p className="text-slate-200 text-base sm:text-lg mb-10 leading-relaxed font-medium">
              Join today for free. Access certified NABL soil testing, connect with agronomy officers, and monetize crop residue seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-white text-emerald-950 font-black text-base sm:text-lg shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
              >
                Create Free Farmer Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-base transition-all"
              >
                Already registered? Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center shadow-sm">
                <Leaf size={22} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">FarmHith</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Transforming Indian agriculture through precision lab diagnostics, live tele-agronomy, and sustainable residue monetization.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Core Services</h4>
            <div className="flex flex-col space-y-2.5 text-xs sm:text-sm font-medium">
              <Link href="/register" className="text-slate-600 hover:text-emerald-700">Doorstep Soil Testing</Link>
              <Link href="/register" className="text-slate-600 hover:text-emerald-700">Soil-Mitra Video Advisory</Link>
              <Link href="/register" className="text-slate-600 hover:text-emerald-700">Crop Residue Marketplace</Link>
              <Link href="/features" className="text-slate-600 hover:text-emerald-700">All Platform Capabilities</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Company & Resources</h4>
            <div className="flex flex-col space-y-2.5 text-xs sm:text-sm font-medium">
              <Link href="/about" className="text-slate-600 hover:text-emerald-700">About Our Mission</Link>
              <Link href="/blog" className="text-slate-600 hover:text-emerald-700">Agronomy Insights & Blog</Link>
              <Link href="/faq" className="text-slate-600 hover:text-emerald-700">Frequently Asked Questions</Link>
              <Link href="/contact" className="text-slate-600 hover:text-emerald-700">Contact Support & Helpline</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Ecosystem Hubs</h4>
            <div className="flex flex-col space-y-2.5 text-xs sm:text-sm font-medium">
              <Link href="/login" className="text-slate-600 hover:text-emerald-700 font-bold">Farmer Login</Link>
              <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-amber-700">Soil-Mitra Expert Portal</a>
              <a href="http://localhost:3003" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-blue-700">Bio-Pellet Industry Portal</a>
              <a href="http://localhost:3004" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-700">Testing Laboratory Portal</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Toll-Free Farmer Support: 1800-123-4567</span>
            <span>support@farmhith.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
