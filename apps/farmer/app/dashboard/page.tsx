'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card } from '@farmhith/ui';
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
  CheckCircle,
  Clock,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const farmerId = user?.id;
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  const { data: soilBookings, loading: loadingBookings } = useMyBookings(farmerId);
  const { data: mitraSessions, loading: loadingSessions } = useMyMitraSessions(farmerId);
  const { data: cropListings, loading: loadingListings } = useMyCropListings(farmerId);
  const { data: orders, loading: loadingOrders } = useFarmerOrders(farmerId);

  // Stats derived from live data
  const activeTests = soilBookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;
  const upcomingSessions = mitraSessions.filter(b => b.status === 'CONFIRMED').length;
  const activeListings = cropListings.filter(l => l.status === 'ACTIVE').length;
  const pendingOrders = orders.filter(o => o.status === 'INTERESTED').length;
  const totalEarnings = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const isLoading = loadingBookings || loadingSessions || loadingListings || loadingOrders;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here&apos;s an overview of your FarmHith activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Soil Tests"
          value={loadingBookings ? '—' : activeTests}
          icon={<FlaskConical size={20} />}
          accent="blue"
        />
        <StatCard
          label="Upcoming Sessions"
          value={loadingSessions ? '—' : upcomingSessions}
          icon={<Users size={20} />}
          accent="teal"
        />
        <StatCard
          label="Active Listings"
          value={loadingListings ? '—' : activeListings}
          icon={<ShoppingBasket size={20} />}
          accent="green"
        />
        <StatCard
          label="Pending Orders"
          value={loadingOrders ? '—' : pendingOrders}
          icon={<TrendingUp size={20} />}
          accent="amber"
        />
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Soil Tests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Soil Tests</h2>
            <Link href="/dashboard/soil-test" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {loadingBookings ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : soilBookings.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No soil tests booked yet.</p>
            ) : (
              soilBookings.slice(0, 3).map(booking => (
                <Link
                  key={booking.id}
                  href={`/dashboard/soil-test/${booking.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FlaskConical size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.labName}</p>
                      <p className="text-xs text-gray-500">{booking.cropType} · {formatDate(booking.collectionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={booking.status} size="sm" />
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/dashboard/soil-test/book"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-green-200 text-sm text-green-700 font-medium hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            + Book a New Soil Test
          </Link>
        </Card>

        {/* Mitra Sessions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Mitra Sessions</h2>
            <Link href="/dashboard/mitra" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {loadingSessions ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : mitraSessions.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No mitra sessions booked yet.</p>
            ) : (
              mitraSessions.slice(0, 2).map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-teal-100 flex items-center justify-center">
                      <Users size={16} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.mitraName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(session.sessionDatetime)} · {formatCurrency(session.amountPaid)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={session.status} size="sm" />
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/mitra"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-teal-200 text-sm text-teal-700 font-medium hover:border-teal-400 hover:bg-teal-50 transition-colors"
          >
            + Book a Soil-Mitra Session
          </Link>
        </Card>
      </div>

      {/* Marketplace + Orders */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">My Listings &amp; Orders</h2>
          <Link href="/dashboard/marketplace" className="text-xs text-green-600 hover:underline flex items-center gap-1">
            Manage <ArrowRight size={12} />
          </Link>
        </div>

        {loadingListings ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : cropListings.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">No crop listings yet.</p>
            <Link
              href="/dashboard/marketplace/new"
              className="mt-2 inline-flex items-center text-sm text-green-600 font-medium hover:underline"
            >
              Create your first listing <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {cropListings.map(listing => (
              <div key={listing.id} className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{listing.residueType}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{listing.quantityTons} tons · {listing.location}</p>
                    <p className="text-sm font-bold text-green-700 mt-2">
                      {formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal text-gray-500">/ton</span>
                    </p>
                  </div>
                  <StatusBadge status={listing.status} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                  <Clock size={12} />
                  Available from {formatDate(listing.availableFrom)}
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Incoming Orders</p>
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100 mb-2">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.plantName}</p>
                    <p className="text-xs text-gray-500">
                      {order.listingResidueType} · {order.finalQuantityTons} tons · {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} size="sm" />
                  <Link
                    href="/dashboard/marketplace/orders"
                    className="text-xs bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
