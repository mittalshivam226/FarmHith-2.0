'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { 
  StatCard, 
  StatusBadge, 
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
  TrendingUp,
  IndianRupee,
  BellRing,
  CheckCircle,
  CalendarDays,
  FileText
} from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../components/Animations';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const farmerId = user?.id;
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  const { data: soilBookings, loading: loadingBookings } = useMyBookings(farmerId);
  const { data: mitraSessions, loading: loadingSessions } = useMyMitraSessions(farmerId);
  const { data: cropListings, loading: loadingListings } = useMyCropListings(farmerId);
  const { data: orders, loading: loadingOrders } = useFarmerOrders(farmerId);

  // Computed Stats
  const activeTests = soilBookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const upcomingSessions = mitraSessions.filter(b => b.status === 'CONFIRMED');
  const activeListings = cropListings.filter(l => l.status === 'ACTIVE');
  const pendingOrders = orders.filter(o => o.status === 'INTERESTED');
  
  const totalEarnings = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 text-slate-100">
      {/* 1. Farm Context */}
      <SlideIn direction="left">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greeting}, <span className="text-primary-400">{firstName}</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Here is your farm&apos;s current status and required actions.
          </p>
        </div>
      </SlideIn>

      {/* 2. Actionable Alerts */}
      <FadeIn delay={0.1}>
        {(!loadingOrders && pendingOrders.length > 0) && (
          <Alert variant="warning" title="Action Required: Pending Orders">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
              <p>You have {pendingOrders.length} pending order{pendingOrders.length > 1 ? 's' : ''} for your crop residue.</p>
              <Link href="/dashboard/marketplace" className="text-sm font-semibold text-warning-400 hover:underline">
                Review Orders &rarr;
              </Link>
            </div>
          </Alert>
        )}

        {(!loadingBookings && activeTests.length > 0) && (
          <div className="mt-4">
            <Alert variant="info" title="Soil Test Update">
              <p className="mt-1">You have {activeTests.length} soil test{activeTests.length > 1 ? 's' : ''} currently in progress. We will notify you when the reports are ready.</p>
            </Alert>
          </div>
        )}
      </FadeIn>

      {/* 3. Key Farm Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ZoomIn delay={0.2}><StatCard label="Total Earnings" value={loadingOrders ? '—' : formatCurrency(totalEarnings)} icon={<IndianRupee size={20} />} accent="green" /></ZoomIn>
        <ZoomIn delay={0.3}><StatCard label="Active Soil Tests" value={loadingBookings ? '—' : activeTests.length} icon={<FlaskConical size={20} />} accent="blue" /></ZoomIn>
        <ZoomIn delay={0.4}><StatCard label="Upcoming Sessions" value={loadingSessions ? '—' : upcomingSessions.length} icon={<Users size={20} />} accent="teal" /></ZoomIn>
        <ZoomIn delay={0.5}><StatCard label="Pending Orders" value={loadingOrders ? '—' : pendingOrders.length} icon={<BellRing size={20} />} accent={pendingOrders.length > 0 ? 'amber' : 'teal'} /></ZoomIn>
      </div>

      {/* 4 & 5. Crop Health & Expert Guidance */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Soil Tests */}
        <FadeIn delay={0.6}>
          <Card padding="none" className="overflow-hidden flex flex-col h-full bg-slate-900 border-slate-800 shadow-glow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-950/50 border-b border-slate-800 py-4 px-5">
              <CardTitle className="text-white">Recent Soil Tests</CardTitle>
              <Link href="/dashboard/soil-test" className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </Link>
            </CardHeader>
            <div className="flex-1 flex flex-col">
              {loadingBookings ? (
                <div className="p-5"><CardSkeleton /></div>
              ) : soilBookings.length === 0 ? (
                <EmptyState 
                  title="No soil tests yet" 
                  description="Book a test to understand your soil's health." 
                  icon={<FlaskConical size={24} className="text-slate-500" />}
                  action={<Link href="/dashboard/soil-test/book" className="text-sm font-semibold text-primary-400 hover:underline">Book Test</Link>}
                />
              ) : (
                <div className="divide-y divide-slate-800 flex-1">
                  {soilBookings.slice(0, 4).map((booking, i) => (
                    <SlideIn key={booking.id} delay={0.6 + (i * 0.1)} direction="left">
                      <Link
                        href={`/dashboard/soil-test/${booking.id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 shadow-glow-sm group-hover:scale-110 transition-transform">
                            <FlaskConical size={18} className="text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
                              {booking.labName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {booking.cropType} · {formatDate(booking.collectionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={booking.status} size="sm" />
                          <ArrowRight size={16} className="text-slate-500 group-hover:text-primary-400 transition-colors" />
                        </div>
                      </Link>
                    </SlideIn>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* Mitra Sessions */}
        <FadeIn delay={0.7}>
          <Card padding="none" className="overflow-hidden flex flex-col h-full bg-slate-900 border-slate-800 shadow-glow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-950/50 border-b border-slate-800 py-4 px-5">
              <CardTitle className="text-white">Upcoming Sessions</CardTitle>
              <Link href="/dashboard/mitra" className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Find Mitra
              </Link>
            </CardHeader>
            <div className="flex-1 flex flex-col">
              {loadingSessions ? (
                <div className="p-5"><CardSkeleton /></div>
              ) : mitraSessions.length === 0 ? (
                <EmptyState 
                  title="No upcoming sessions" 
                  description="Connect with a Soil-Mitra for expert agricultural advice." 
                  icon={<Users size={24} className="text-slate-500" />}
                  action={<Link href="/dashboard/mitra" className="text-sm font-semibold text-primary-400 hover:underline">Browse Experts</Link>}
                />
              ) : (
                <div className="divide-y divide-slate-800 flex-1">
                  {mitraSessions.slice(0, 4).map((session, i) => (
                    <SlideIn key={session.id} delay={0.7 + (i * 0.1)} direction="right">
                      <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-warning-500/10 border border-warning-500/20 flex items-center justify-center shrink-0 shadow-glow-sm group-hover:scale-110 transition-transform">
                            <Users size={18} className="text-warning-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{session.mitraName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                              <CalendarDays size={12} />
                              {formatDate(session.sessionDatetime)}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={session.status} size="sm" />
                      </div>
                    </SlideIn>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* 6. Marketplace Activity */}
      <FadeIn delay={0.8}>
        <Card padding="none" className="overflow-hidden bg-slate-900 border-slate-800 shadow-glow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-950/50 border-b border-slate-800 py-4 px-5">
            <CardTitle className="text-white">Marketplace Activity</CardTitle>
            <Link href="/dashboard/marketplace" className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Manage Listings
            </Link>
          </CardHeader>
          
          <div className="p-5 sm:p-6 grid lg:grid-cols-2 gap-8">
            {/* Active Listings Column */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-primary-400" /> My Active Listings
              </h3>
              {loadingListings ? (
                <CardSkeleton />
              ) : activeListings.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50">
                  <p className="text-sm text-slate-400 mb-2">You don't have any active crop residue listings.</p>
                  <Link href="/dashboard/marketplace/list" className="text-sm font-semibold text-primary-400 hover:underline">
                    Create Listing &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeListings.slice(0, 3).map((listing, i) => (
                    <ZoomIn key={listing.id} delay={0.8 + (i * 0.1)}>
                      <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-500/30 transition-colors hud-element">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{listing.residueType}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{listing.quantityTons} tons · Available {formatDate(listing.availableFrom)}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <p className="text-sm font-bold text-primary-400">{formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal text-slate-500">/ton</span></p>
                          <div className="mt-1">
                            <StatusBadge status={listing.status} size="sm" />
                          </div>
                        </div>
                      </div>
                    </ZoomIn>
                  ))}
                </div>
              )}
            </div>

            {/* Pending/Recent Orders Column */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-400" /> Incoming Orders
              </h3>
              {loadingOrders ? (
                <CardSkeleton />
              ) : orders.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50">
                  <p className="text-sm text-slate-400">No orders received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order, i) => (
                    <ZoomIn key={order.id} delay={0.9 + (i * 0.1)}>
                      <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-500/30 transition-colors hud-element">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{order.plantName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {order.listingResidueType} · {order.finalQuantityTons} tons
                          </p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <p className="text-sm font-bold text-primary-400">{formatCurrency(order.totalAmount)}</p>
                          <div className="mt-1">
                            <StatusBadge status={order.status} size="sm" />
                          </div>
                        </div>
                      </div>
                    </ZoomIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
