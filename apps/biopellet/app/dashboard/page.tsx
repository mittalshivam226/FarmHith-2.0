'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader, Badge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { Search, ShoppingCart, TrendingUp, Leaf, ArrowRight, MapPin, Weight } from 'lucide-react';
import { mockListings, mockOrders } from '../../lib/mock-data';

export default function BiopelletDashboard() {
  const { user } = useAuth();

  const activeListings   = mockListings.filter(l => l.status === 'ACTIVE');
  const pendingOrders    = mockOrders.filter(o => o.status === 'INTERESTED').length;
  const confirmedOrders  = mockOrders.filter(o => o.status === 'CONFIRMED').length;
  const totalSpend       = mockOrders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plant Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Listings" value={activeListings.length} icon={<Leaf size={20} />} accent="green" />
        <StatCard label="Pending Orders"    value={pendingOrders}        icon={<ShoppingCart size={20} />} accent="amber" />
        <StatCard label="Confirmed Orders"  value={confirmedOrders}      icon={<Search size={20} />} accent="blue" />
        <StatCard label="Total Committed"   value={formatCurrency(totalSpend)} icon={<TrendingUp size={20} />} accent="purple" />
      </div>

      {/* Matching listings */}
      <Card>
        <SectionHeader
          title="Matching Listings"
          description="Crop residues matching your accepted types"
          action={
            <Link href="/dashboard/listings" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              Browse all <ArrowRight size={12} />
            </Link>
          }
        />
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
      </Card>

      {/* Recent orders */}
      <Card>
        <SectionHeader
          title="My Orders"
          action={<Link href="/dashboard/orders" className="text-xs text-green-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>}
        />
        <div className="space-y-3">
          {mockOrders.map(order => (
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
      </Card>
    </div>
  );
}
