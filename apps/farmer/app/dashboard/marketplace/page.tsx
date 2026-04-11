'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, SectionHeader, StatusBadge, Badge, Modal } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { Plus, Weight, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockCropListings, mockProcurementOrders } from '../../../lib/mock-data';

export default function MarketplacePage() {
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [declineModal, setDeclineModal] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Marketplace"
        description="List your crop residues and manage procurement orders"
        action={
          <Link
            href="/dashboard/marketplace/list"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} /> New Listing
          </Link>
        }
      />

      {/* My listings */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Listings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mockCropListings.map(listing => (
            <Card key={listing.id}>
              <div className="flex items-start justify-between mb-3">
                <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'default'}>{listing.residueType}</Badge>
                <StatusBadge status={listing.status} size="sm" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Weight size={14} className="text-gray-400" />
                  <span className="font-semibold">{listing.quantityTons} tons</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} className="text-gray-400" />{listing.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} className="text-gray-400" />Available from {formatDate(listing.availableFrom)}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">FarmHith Price</p>
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal text-gray-400">/ton</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total value</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatCurrency(listing.farmhithPricePerTon * listing.quantityTons)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {mockCropListings.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No listings yet. Create your first listing!</p>
          </div>
        )}
      </div>

      {/* Incoming orders */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Incoming Orders</h2>
        {mockProcurementOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No incoming orders yet.</p>
        ) : (
          <div className="space-y-3">
            {mockProcurementOrders.map(order => (
              <Card key={order.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{order.plantName}</p>
                    <p className="text-sm text-gray-500">
                      {order.listingResidueType} · {order.finalQuantityTons} tons
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Received {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-green-700">{formatCurrency(order.totalAmount)}</p>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                </div>
                {order.status === 'INTERESTED' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setConfirmModal(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                    >
                      <CheckCircle size={15} /> Confirm Order
                    </button>
                    <button
                      onClick={() => setDeclineModal(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2.5 rounded-xl transition-colors"
                    >
                      <AlertCircle size={15} /> Decline
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <Modal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Order"
        footer={
          <>
            <button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={() => setConfirmModal(null)} className="px-5 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              Yes, Confirm
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to confirm this procurement order? The bio-pellet plant will be notified and you will be committed to the sale.
        </p>
      </Modal>

      <Modal
        open={!!declineModal}
        onClose={() => setDeclineModal(null)}
        title="Decline Order"
        footer={
          <>
            <button onClick={() => setDeclineModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={() => setDeclineModal(null)} className="px-5 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
              Decline Order
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to decline this order? The plant will be notified that their request was not accepted.
        </p>
      </Modal>
    </div>
  );
}
