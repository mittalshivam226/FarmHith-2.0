'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader, Badge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useAllCropListings, usePlantOrders } from '@farmhith/hooks';
import { Search, ShoppingCart, TrendingUp, Leaf, ArrowRight, MapPin, Weight, Loader2 } from 'lucide-react';

export default function BiopelletDashboard() {
  const { user } = useAuth();
  const plantId = user?.id;

  const { data: allListings, loading: loadingListings } = useAllCropListings();
  const { data: orders, loading: loadingOrders } = usePlantOrders(plantId);

  const activeListings  = allListings.filter(l => l.status === 'ACTIVE');
  const pendingOrders   = orders.filter(o => o.status === 'INTERESTED').length;
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED').length;
  const totalSpend      = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plant Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Listings" value={loadingListings ? '—' : activeListings.length} icon={<Leaf size={20} />} accent="green" />
        <StatCard label="Pending Orders"    value={loadingOrders ? '—' : pendingOrders}            icon={<ShoppingCart size={20} />} accent="amber" />
        <StatCard label="Confirmed Orders"  value={loadingOrders ? '—' : confirmedOrders}          icon={<Search size={20} />} accent="blue" />
        <StatCard label="Total Committed"   value={loadingOrders ? '—' : formatCurrency(totalSpend)} icon={<TrendingUp size={20} />} accent="purple" />
      </div>

      {/* Matching listings */}
      <Card>
        <SectionHeader
          title="Available Listings"
          description="Latest active crop residue listings from farmers"
          action={
            <Link href="/dashboard/listings" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              Browse all <ArrowRight size={12} />
            </Link>
          }
        />
        {loadingListings ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : activeListings.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">No active listings available right now. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {activeListings.slice(0, 4).map(listing => (
              <Link
                key={listing.id}
                href={`/dashboard/listings/${listing.id}`}
                className="p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="success">{listing.residueType}</Badge>
                  <StatusBadge status={listing.status} size="sm" />
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2">{listing.farmerName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={11} />
                  {listing.location}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Weight size={11} />
                    {listing.quantityTons} tons
                  </div>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal">/ton</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Recent orders */}
      <Card>
        <SectionHeader
          title="My Orders"
          action={<Link href="/dashboard/orders" className="text-xs text-green-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>}
        />
        {loadingOrders ? (
          <div className="flex justify-center py-6">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No orders placed yet. Browse listings to start procuring.</p>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.farmerName}</p>
                  <p className="text-xs text-gray-500">{order.listingResidueType} · {order.finalQuantityTons} tons</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
