'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { 
  StatCard, 
  StatusBadge, 
  Badge,
  Card, 
  CardHeader,
  CardTitle,
  Alert,
  CardSkeleton,
  EmptyState
} from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import {
  useMyBookings,
  useMyMitraSessions,
  useMyCropListings,
  useFarmerOrders,
} from '@farmhith/hooks';
import {
  FlaskConical,
  Users,
  ShoppingBasket,
  ArrowRight,
  IndianRupee,
  CalendarDays,
  FileText,
  Video,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Leaf,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../components/Animations';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const farmerId = user?.id;
  const firstName = user?.name?.split(' ')[0] ?? 'Kisan';

  const { data: soilBookings, loading: loadingBookings } = useMyBookings(farmerId);
  const { data: mitraSessions, loading: loadingSessions } = useMyMitraSessions(farmerId);
  const { data: cropListings, loading: loadingListings } = useMyCropListings(farmerId);
  const { data: orders, loading: loadingOrders } = useFarmerOrders(farmerId);

  // Computed Stats & States
  const activeTests = soilBookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const latestCompletedTest = soilBookings.find(b => b.status === 'COMPLETED' && b.report);
  const latestBooking = soilBookings[0];

  const upcomingSessions = mitraSessions.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const nextSession = upcomingSessions[0];

  const activeListings = cropListings.filter(l => l.status === 'ACTIVE');
  const primaryListing = activeListings[0];
  const pendingOrders = orders.filter(o => o.status === 'INTERESTED');

  const totalResidueTons = cropListings
    .filter(l => l.status === 'ACTIVE')
    .reduce((sum, l) => sum + l.quantityTons, 0);

  const totalEarnings = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Overall Soil Condition Interpretation helper
  const getSoilSummary = (params?: { ph?: number; nitrogen?: number; phosphorus?: number; potassium?: number }) => {
    if (!params) return null;
    const { ph = 7, nitrogen = 0, phosphorus = 0, potassium = 0 } = params;
    const isPhGood = ph >= 6.0 && ph <= 7.5;
    const isNGood = nitrogen >= 150 || nitrogen > 0;
    const isPGood = phosphorus >= 20 || phosphorus > 0;
    const isKGood = potassium >= 150 || potassium > 0;
    
    return {
      condition: isPhGood && isNGood ? 'Optimal Health' : 'Action Recommended',
      ph: ph.toFixed(1),
      nLevel: nitrogen > 250 ? 'High' : nitrogen > 120 ? 'Good' : 'Moderate',
      pLevel: phosphorus > 30 ? 'High' : phosphorus > 15 ? 'Good' : 'Moderate',
      kLevel: potassium > 200 ? 'High' : potassium > 100 ? 'Good' : 'Moderate',
    };
  };

  const soilReportPreview = latestCompletedTest?.report ? getSoilSummary(latestCompletedTest.report.testParameters) : null;

  return (
    <div className="space-y-8 text-slate-800">
      {/* ── 1. Personalized Header & Hero ── */}
      <SlideIn direction="left">
        <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          {/* Subtle agricultural background element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
            <Leaf size={240} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm mb-3">
              <Sparkles size={13} className="text-secondary-300" />
              <span>FarmHith Kisan Companion</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {greeting}, <span className="text-secondary-300">{firstName}</span> 👋
            </h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base leading-relaxed">
              Understand your soil health, get verified agronomist advice, and turn crop residue into guaranteed income.
            </p>

            {/* Quick Actions Pills inside Hero */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6">
              <Link
                href="/dashboard/soil-test/book"
                className="inline-flex items-center gap-2 bg-white text-primary-800 hover:bg-slate-50 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <FlaskConical size={16} className="text-primary-600" />
                🌱 Test My Soil
              </Link>
              <Link
                href="/dashboard/mitra"
                className="inline-flex items-center gap-2 bg-primary-600/60 hover:bg-primary-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all border border-white/20 active:scale-95"
              >
                <Users size={16} className="text-secondary-300" />
                👨‍🌾 Talk to Soil-Mitra
              </Link>
              <Link
                href="/dashboard/marketplace/list"
                className="inline-flex items-center gap-2 bg-primary-600/60 hover:bg-primary-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all border border-white/20 active:scale-95"
              >
                <ShoppingBasket size={16} className="text-secondary-300" />
                ♻️ Sell Crop Residue
              </Link>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* ── 2. Actionable Alerts (Pending Orders / Attention needed) ── */}
      <FadeIn delay={0.1}>
        {(!loadingOrders && pendingOrders.length > 0) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm sm:text-base">
                  Bio-Pellet Plant Interested in Your Crop Residue!
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                  You have <span className="font-bold">{pendingOrders.length} incoming order offer{pendingOrders.length > 1 ? 's' : ''}</span> waiting for your confirmation.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/marketplace"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Review & Confirm &rarr;
            </Link>
          </div>
        )}

        {(!loadingBookings && activeTests.length > 0) && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-sky-50 border border-sky-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-sky-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <FlaskConical size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sky-900 text-sm sm:text-base">
                  Soil Test In Progress
                </h4>
                <p className="text-xs sm:text-sm text-sky-800 mt-0.5">
                  Your sample with <span className="font-bold">{latestBooking?.labName}</span> is being processed. You will be notified when the report is ready.
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/soil-test/${latestBooking?.id}`}
              className="inline-flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Track Status &rarr;
            </Link>
          </div>
        )}
      </FadeIn>

      {/* ── 3. Three Core FarmHith Signature Service Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">What would you like to do today?</h2>
            <p className="text-xs sm:text-sm text-slate-500">FarmHith's three connected services for your farm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 🌱 Soil Health */}
          <ZoomIn delay={0.15}>
            <Card hover className="flex flex-col h-full border-t-4 border-t-primary-600 bg-white group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 border border-primary-200/80 flex items-center justify-center text-primary-700 shadow-xs group-hover:scale-105 transition-transform">
                  <FlaskConical size={22} />
                </div>
                <Badge variant={latestCompletedTest ? 'success' : 'default'} size="sm">
                  {latestCompletedTest ? 'Report Ready' : activeTests.length > 0 ? 'Testing' : 'Certified Lab'}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                🌱 Soil Testing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Know what&apos;s in your soil. Book a certified laboratory and get a detailed NPK/pH health report.
              </p>

              {/* Status Context Layer */}
              <div className="my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex-1">
                {latestCompletedTest ? (
                  <div>
                    <div className="flex items-center justify-between font-semibold mb-2">
                      <span className="text-slate-500">Latest Soil Report:</span>
                      <span className="text-primary-700 font-bold">{soilReportPreview?.condition ?? 'Available'}</span>
                    </div>
                    {soilReportPreview && (
                      <div className="grid grid-cols-4 gap-1 text-center pt-1 border-t border-slate-200/60">
                        <div className="bg-white p-1 rounded border border-slate-200/60">
                          <p className="text-[10px] text-slate-400">pH</p>
                          <p className="font-bold text-slate-800">{soilReportPreview.ph}</p>
                        </div>
                        <div className="bg-white p-1 rounded border border-slate-200/60">
                          <p className="text-[10px] text-slate-400">N</p>
                          <p className="font-bold text-primary-700">{soilReportPreview.nLevel}</p>
                        </div>
                        <div className="bg-white p-1 rounded border border-slate-200/60">
                          <p className="text-[10px] text-slate-400">P</p>
                          <p className="font-bold text-amber-700">{soilReportPreview.pLevel}</p>
                        </div>
                        <div className="bg-white p-1 rounded border border-slate-200/60">
                          <p className="text-[10px] text-slate-400">K</p>
                          <p className="font-bold text-sky-700">{soilReportPreview.kLevel}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeTests.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-sky-600 shrink-0" />
                    <span>Sample collection scheduled with <strong>{latestBooking?.labName}</strong>.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck size={16} className="text-primary-600 shrink-0" />
                    <span>Certified testing laboratories near your district.</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-2">
                {latestCompletedTest ? (
                  <Link
                    href={`/dashboard/soil-test/${latestCompletedTest.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <FileText size={15} /> View Soil Report
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/soil-test/book"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <Plus size={15} /> Book Soil Test
                  </Link>
                )}
              </div>
            </Card>
          </ZoomIn>

          {/* Card 2: 👨‍🌾 Soil-Mitra */}
          <ZoomIn delay={0.25}>
            <Card hover className="flex flex-col h-full border-t-4 border-t-secondary-500 bg-white group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs group-hover:scale-105 transition-transform">
                  <Users size={22} />
                </div>
                <Badge variant="harvest" size="sm">Verified Expert</Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                👨‍🌾 Soil-Mitra
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Get advice from a verified agricultural expert. Conduct one-to-one video consultations for your crops.
              </p>

              {/* Status Context Layer */}
              <div className="my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex-1">
                {nextSession ? (
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Upcoming Consultation:</p>
                    <p className="font-bold text-slate-900 text-sm">{nextSession.mitraName}</p>
                    <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                      <CalendarDays size={13} className="text-amber-600" />
                      <span>{formatDate(nextSession.sessionDatetime)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Agronomists specializing in Paddy, Wheat, Cotton, Sugarcane & Soil nutrition.</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-2">
                {nextSession ? (
                  <Link
                    href={`/dashboard/mitra/${nextSession.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <Video size={15} /> Join Consultation
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/mitra"
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <Users size={15} /> Find a Soil-Mitra
                  </Link>
                )}
              </div>
            </Card>
          </ZoomIn>

          {/* Card 3: ♻️ Sell Crop Residue */}
          <ZoomIn delay={0.35}>
            <Card hover className="flex flex-col h-full border-t-4 border-t-primary-800 bg-white group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-xs group-hover:scale-105 transition-transform">
                  <ShoppingBasket size={22} />
                </div>
                <Badge variant={primaryListing ? 'success' : 'default'} size="sm">
                  {primaryListing ? 'Active Listing' : 'B2B Marketplace'}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                ♻️ Sell Crop Residue
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Turn crop waste into income. List your paddy/wheat residue for certified bio-pellet plants.
              </p>

              {/* Status Context Layer */}
              <div className="my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex-1">
                {primaryListing ? (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{primaryListing.residueType}</span>
                      <span className="text-primary-700 font-bold">{primaryListing.quantityTons} Tons</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>FarmHith Rate:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(primaryListing.farmhithPricePerTon)}/t</span>
                    </div>
                    {pendingOrders.length > 0 && (
                      <p className="text-amber-700 font-semibold mt-1.5 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        {pendingOrders.length} interested buyer offer
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-slate-600">
                    <TrendingUp size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>Assured rates: Paddy Straw ₹2,500/t, Wheat Straw ₹2,200/t. Zero burning penalty.</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-2">
                {primaryListing ? (
                  <Link
                    href="/dashboard/marketplace"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <ShoppingBasket size={15} /> View Marketplace
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/marketplace/list"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <Plus size={15} /> Sell Residue
                  </Link>
                )}
              </div>
            </Card>
          </ZoomIn>
        </div>
      </div>

      {/* ── 4. Key Farm Metrics ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Farm Overview & Summary</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Residue Earnings"
            value={loadingOrders ? '—' : formatCurrency(totalEarnings)}
            icon={<IndianRupee size={20} />}
            accent="green"
          />
          <StatCard
            label="Active Soil Tests"
            value={loadingBookings ? '—' : activeTests.length}
            icon={<FlaskConical size={20} />}
            accent="blue"
          />
          <StatCard
            label="Consultations"
            value={loadingSessions ? '—' : mitraSessions.length}
            icon={<Users size={20} />}
            accent="amber"
          />
          <StatCard
            label="Residue Listed"
            value={loadingListings ? '—' : `${totalResidueTons} Tons`}
            icon={<ShoppingBasket size={20} />}
            accent="teal"
          />
        </div>
      </div>

      {/* ── 5. Status-Driven Activity Timeline & Connected Events ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Soil Test Bookings */}
        <Card padding="none" className="overflow-hidden flex flex-col h-full bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/70 border-b border-slate-200/80 py-4 px-5">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <FlaskConical size={18} className="text-primary-700" />
              Recent Soil Tests
            </CardTitle>
            <Link href="/dashboard/soil-test" className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors">
              View All &rarr;
            </Link>
          </CardHeader>

          <div className="flex-1 flex flex-col">
            {loadingBookings ? (
              <div className="p-5"><CardSkeleton /></div>
            ) : soilBookings.length === 0 ? (
              <div className="py-10 px-5 text-center">
                <FlaskConical size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Soil Tests Booked Yet</p>
                <p className="text-xs text-slate-500 mt-0.5">Book certified laboratory testing to know your soil&apos;s NPK and pH levels.</p>
                <Link
                  href="/dashboard/soil-test/book"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary-700 bg-primary-50 px-3.5 py-2 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <Plus size={14} /> Book Soil Test
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 flex-1">
                {soilBookings.slice(0, 3).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/soil-test/${booking.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 text-primary-700 group-hover:scale-105 transition-transform">
                        <FlaskConical size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                          {booking.labName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {booking.cropType} · {formatDate(booking.collectionDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={booking.status} size="sm" />
                      <ArrowRight size={15} className="text-slate-400 group-hover:text-primary-700 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Expert Consultations */}
        <Card padding="none" className="overflow-hidden flex flex-col h-full bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/70 border-b border-slate-200/80 py-4 px-5">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-amber-600" />
              Soil-Mitra Sessions
            </CardTitle>
            <Link href="/dashboard/mitra" className="text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors">
              Find Mitra &rarr;
            </Link>
          </CardHeader>

          <div className="flex-1 flex flex-col">
            {loadingSessions ? (
              <div className="p-5"><CardSkeleton /></div>
            ) : mitraSessions.length === 0 ? (
              <div className="py-10 px-5 text-center">
                <Users size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Consultations Scheduled</p>
                <p className="text-xs text-slate-500 mt-0.5">Connect with verified agronomists for customized crop recommendations.</p>
                <Link
                  href="/dashboard/mitra"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <Users size={14} /> Browse Experts
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 flex-1">
                {mitraSessions.slice(0, 3).map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/mitra/${session.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-700 group-hover:scale-105 transition-transform">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {session.mitraName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <CalendarDays size={12} className="text-amber-600" />
                          {formatDate(session.sessionDatetime)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={session.status} size="sm" />
                      <ArrowRight size={15} className="text-slate-400 group-hover:text-amber-700 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── 6. Marketplace Status & Activity ── */}
      <Card padding="none" className="overflow-hidden bg-white shadow-card">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-50/70 border-b border-slate-200/80 py-4 px-5">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <ShoppingBasket size={18} className="text-primary-800" />
            Crop Residue Marketplace Activity
          </CardTitle>
          <Link href="/dashboard/marketplace" className="text-xs font-bold text-primary-800 hover:text-primary-900 transition-colors">
            Manage Listings &rarr;
          </Link>
        </CardHeader>
        
        <div className="p-5 sm:p-6 grid lg:grid-cols-2 gap-8">
          {/* Active Listings */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText size={14} className="text-primary-700" /> My Crop Residue Listings
            </h3>
            {loadingListings ? (
              <CardSkeleton />
            ) : activeListings.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs sm:text-sm text-slate-500 mb-2">You don&apos;t have any active crop residue listings.</p>
                <Link href="/dashboard/marketplace/list" className="text-xs font-bold text-primary-700 hover:underline">
                  + Create First Listing &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeListings.slice(0, 2).map((listing) => (
                  <div key={listing.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:border-primary-300 transition-colors flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{listing.residueType}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{listing.quantityTons} Tons · Available from {formatDate(listing.availableFrom)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-700">{formatCurrency(listing.farmhithPricePerTon)}<span className="text-[10px] text-slate-400 font-normal">/t</span></p>
                      <div className="mt-1">
                        <StatusBadge status={listing.status} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bio-Pellet Plant Orders */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-primary-700" /> Bio-Pellet Plant Orders
            </h3>
            {loadingOrders ? (
              <CardSkeleton />
            ) : orders.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs sm:text-sm text-slate-500">No procurement orders received yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:border-primary-300 transition-colors flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.plantName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.listingResidueType} · {order.finalQuantityTons} Tons
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-700">{formatCurrency(order.totalAmount)}</p>
                      <div className="mt-1">
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

