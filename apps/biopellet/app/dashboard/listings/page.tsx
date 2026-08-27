'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, StatusBadge, SectionHeader, Badge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useAllCropListings } from '@farmhith/hooks';
import { MapPin, Weight } from 'lucide-react';

const RESIDUE_TYPES = ['All', 'Paddy Straw', 'Wheat Straw', 'Sugarcane Bagasse', 'Cotton Stalks', 'Maize Stalks'];

export default function BiopelletListingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = React.useState('All');
  const [districtFilter, setDistrictFilter] = React.useState('');
  const { data: listings, loading, error } = useAllCropListings();

  const filtered = listings.filter(l => {
    const matchesResidue = filter === 'All' || l.residueType === filter;
    const matchesDistrict = districtFilter === '' || (l.location || '').toLowerCase().includes(districtFilter.toLowerCase());
    return matchesResidue && matchesDistrict;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Browse Listings"
        description="Find crop residue listings matching your plant's requirements"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {RESIDUE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* District Filter */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter by district/location..."
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <QueryState
        loading={loading}
        error={error}
        empty={filtered.length === 0}
        emptyProps={{
          title: filter !== 'All' ? `No ${filter} listings found` : "No listings found",
          description: "Check back later for new crop residue listings."
        }}
        loadingFallback={<div className="grid sm:grid-cols-2 gap-4"><CardSkeleton /><CardSkeleton /></div>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(listing => (
            <Link key={listing.id} href={`/dashboard/listings/${listing.id}`}>
              <Card hover>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="success">{listing.residueType}</Badge>
                  <StatusBadge status={listing.status} size="sm" />
                </div>
                <p className="font-semibold text-gray-900">{listing.farmerName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={11} />{listing.location}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Weight size={14} className="text-gray-400" />
                    <span className="font-semibold">{listing.quantityTons}</span> tons
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Price/ton</p>
                    <p className="font-bold text-green-700">{formatCurrency(listing.farmhithPricePerTon)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Available {formatDate(listing.availableFrom)}</span>
                  <span className="text-green-600 font-medium">Express Interest →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </QueryState>
    </div>
  );
}
