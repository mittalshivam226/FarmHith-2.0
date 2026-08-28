'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Badge, Modal, EmptyState, CardSkeleton, Alert, QueryState } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyCropListings, useFarmerOrders } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Plus, Weight, MapPin, Clock, CheckCircle, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [declineModal, setDeclineModal] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const { data: listings, loading: loadingListings, error: errorListings } = useMyCropListings(user?.id);
  const { data: orders, loading: loadingOrders, error: errorOrders } = useFarmerOrders(user?.id);

  async function handleConfirm() {
    if (!confirmModal) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'procurementOrders', confirmModal), { status: 'CONFIRMED' });
    } catch (e) { console.error(e); }
    setUpdating(false);
    setConfirmModal(null);
  }

  async function handleDecline() {
    if (!declineModal) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'procurementOrders', declineModal), { status: 'CANCELLED' });
    } catch (e) { console.error(e); }
    setUpdating(false);
    setDeclineModal(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
      <SlideIn direction="left">
        <div className="[&_h2]:!text-white [&_p]:!text-slate-400">
          <SectionHeader
            title="Marketplace"
            description="List your crop residues and manage procurement orders"
            action={
              <Link
                href="/dashboard/marketplace/list"
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-glow-sm"
              >
                <Plus size={16} /> New Listing
              </Link>
            }
          />
        </div>
      </SlideIn>

      {/* My listings */}
      <div>
        <FadeIn delay={0.1}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Listings</h2>
        </FadeIn>
        <QueryState
          loading={loadingListings}
          error={errorListings}
          empty={listings.length === 0}
          emptyProps={{
            title: "No active listings",
            description: "Create your first crop residue listing to start selling.",
            icon: <FileText size={24} className="text-slate-500" />,
            action: <Link href="/dashboard/marketplace/list" className="text-sm font-bold text-primary-400 hover:underline">Create Listing</Link>
          }}
          loadingFallback={<div className="grid sm:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {listings.map((listing, i) => (
              <ZoomIn key={listing.id} delay={0.2 + (i * 0.1)}>
                <Card className="bg-slate-900 border-slate-800 hud-element hover:border-slate-700 transition-colors h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'default'} className={listing.status === 'ACTIVE' ? 'bg-success-500/10 text-success-400 border border-success-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}>
                      {listing.residueType}
                    </Badge>
                    <StatusBadge status={listing.status} size="sm" />
                  </div>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Weight size={14} className="text-primary-400" />
                      </div>
                      <span className="font-bold text-lg">{listing.quantityTons} <span className="text-slate-500 font-normal">tons</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-primary-400" />
                      </div>
                      {(listing as any).location ?? listing.farmerDistrict ?? 'Location not set'}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-primary-400" />
                      </div>
                      Available from {listing.availableFrom ? formatDate(listing.availableFrom) : '—'}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">FarmHith Price</p>
                      <p className="text-xl font-black text-primary-400">
                        {formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal text-slate-500">/ton</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total value</p>
                      <p className="text-lg font-bold text-slate-100">
                        {formatCurrency(listing.farmhithPricePerTon * listing.quantityTons)}
                      </p>
                    </div>
                  </div>
                </Card>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* Incoming orders */}
      <div className="pt-4">
        <FadeIn delay={0.4}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Incoming Orders</h2>
        </FadeIn>
        <QueryState
          loading={loadingOrders}
          error={errorOrders}
          empty={orders.length === 0}
          emptyProps={{
            title: "No incoming orders",
            description: "When buyers are interested in your residue, their orders will appear here.",
            icon: <TrendingUp size={24} className="text-slate-500" />
          }}
        >
          <div className="space-y-4">
            {orders.map((order, i) => (
              <SlideIn key={order.id} delay={0.5 + (i * 0.1)} direction="right">
                <Card className="bg-slate-900 border-slate-800 hud-element hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-info-500/10 border border-info-500/20 flex items-center justify-center shrink-0 shadow-glow-sm">
                        <TrendingUp size={20} className="text-info-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 text-lg mb-1">{order.plantName}</p>
                        <p className="text-sm text-slate-400 font-medium">
                          {(order as any).residueType ?? (order as any).listingResidueType ?? 'Crop Residue'} · {order.finalQuantityTons} tons
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Received {order.createdAt ? formatDate(order.createdAt) : '—'}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <p className="text-2xl font-black text-primary-400">{formatCurrency(order.totalAmount)}</p>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                  </div>
                  {order.status === 'INTERESTED' && (
                    <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setConfirmModal(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-slate-950 text-sm font-bold py-3 rounded-xl transition-all shadow-glow-sm"
                      >
                        <CheckCircle size={16} /> Confirm Order
                      </button>
                      <button
                        onClick={() => setDeclineModal(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-bold py-3 rounded-xl transition-colors"
                      >
                        <AlertCircle size={16} /> Decline
                      </button>
                    </div>
                  )}
                </Card>
              </SlideIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* Confirm modal */}
      <Modal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Order"
        footer={
          <>
            <button onClick={() => setConfirmModal(null)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={updating}
              className="px-6 py-2.5 text-sm font-bold bg-primary-500 text-slate-950 rounded-xl hover:bg-primary-400 transition-all shadow-glow-sm disabled:opacity-60"
            >
              {updating ? 'Confirming Order…' : 'Confirm Order'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-400 leading-relaxed">Are you sure you want to confirm this procurement order? The bio-pellet plant will be notified and you will be committed to the sale.</p>
      </Modal>

      <Modal
        open={!!declineModal}
        onClose={() => setDeclineModal(null)}
        title="Decline Order"
        footer={
          <>
            <button onClick={() => setDeclineModal(null)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors">Cancel</button>
            <button
              onClick={handleDecline}
              disabled={updating}
              className="px-6 py-2.5 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-400 transition-colors disabled:opacity-60"
            >
              {updating ? 'Declining Order…' : 'Decline Order'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Are you sure you want to decline this order?</p>
          <div className="p-4 rounded-xl border border-warning-500/30 bg-warning-500/10 text-warning-400 text-sm">
            <div className="font-bold flex items-center gap-2 mb-1"><AlertCircle size={16} /> Irreversible Action</div>
            <p className="text-warning-400/80">The buyer will be notified immediately that their request was rejected. This action cannot be undone.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
