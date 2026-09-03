'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Badge, Modal, EmptyState, CardSkeleton, Alert, QueryState } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyCropListings, useFarmerOrders } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Plus, Weight, MapPin, Clock, CheckCircle2, AlertCircle, FileText, TrendingUp, Sparkles, Building2, ArrowRight } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-8 text-slate-800">
      <SlideIn direction="left">
        <SectionHeader
          title="Crop Residue Marketplace"
          description="Monetize crop stubble directly to verified biopellet & energy plants at assured FarmHith rates"
          action={
            <Link
              href="/dashboard/marketplace/list"
              className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} /> List Crop Residue
            </Link>
          }
        />
      </SlideIn>

      {/* ── Value Prop Banner ── */}
      <FadeIn delay={0.05}>
        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-primary-700 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm sm:text-base">
                Zero Stubble Burning · 100% Monetized Harvest Waste
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800/90 mt-0.5">
                FarmHith connects your post-harvest biomass directly with industrial buyers. Guaranteed pickup & transparent digital weighing.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Active Listings ── */}
      <div>
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">My Active Listings</h2>
            {listings.length > 0 && (
              <span className="text-xs font-semibold text-slate-500">{listings.length} Active Lots</span>
            )}
          </div>
        </FadeIn>

        <QueryState
          loading={loadingListings}
          error={errorListings}
          empty={listings.length === 0}
          emptyProps={{
            title: "No Active Crop Residue Listings",
            description: "List your paddy straw, wheat stubble, or bagasse to connect with buyers.",
            icon: <FileText size={28} className="text-slate-400" />,
            action: (
              <Link href="/dashboard/marketplace/list" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors mt-2">
                <Plus size={16} /> Create Your First Listing
              </Link>
            )
          }}
          loadingFallback={<div className="grid sm:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {listings.map((listing, i) => (
              <ZoomIn key={listing.id} delay={0.15 + (i * 0.05)}>
                <Card hover className="bg-white border-slate-200/90 shadow-card h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs">
                          🌾
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg capitalize">{listing.residueType}</h3>
                      </div>
                      <StatusBadge status={listing.status} size="sm" />
                    </div>

                    <div className="space-y-2.5 mb-5 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5 text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Weight size={16} className="text-primary-700" />
                        <span>Available Quantity: <strong className="text-slate-900 font-extrabold text-base">{listing.quantityTons} Tons</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 px-1">
                        <MapPin size={15} className="text-slate-400 shrink-0" />
                        <span>{(listing as any).location ?? listing.farmerDistrict ?? 'District Field'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-500 px-1">
                        <Clock size={15} className="text-slate-400 shrink-0" />
                        <span>Available from: {listing.availableFrom ? formatDate(listing.availableFrom) : 'Immediate'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FarmHith Assured Rate</p>
                      <p className="text-lg font-black text-primary-700">
                        {formatCurrency(listing.farmhithPricePerTon)}<span className="text-xs font-normal text-slate-400">/ton</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Revenue</p>
                      <p className="text-base font-extrabold text-slate-900">
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

      {/* ── Incoming Buyer Orders ── */}
      <div className="pt-2">
        <FadeIn delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Incoming Buyer Orders & Interest</h2>
              <p className="text-xs text-slate-500">Orders submitted by bio-pellet manufacturing plants and aggregators</p>
            </div>
          </div>
        </FadeIn>

        <QueryState
          loading={loadingOrders}
          error={errorOrders}
          empty={orders.length === 0}
          emptyProps={{
            title: "No Incoming Buyer Orders Currently",
            description: "When buyers express interest in your listed residue, their purchase requests will appear here.",
            icon: <TrendingUp size={28} className="text-slate-400" />
          }}
        >
          <div className="space-y-4">
            {orders.map((order, i) => (
              <SlideIn key={order.id} delay={0.35 + (i * 0.08)} direction="right">
                <Card hover className="bg-white border-slate-200/90 shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <p className="font-bold text-slate-900 text-base sm:text-lg">{order.plantName}</p>
                          <StatusBadge status={order.status} size="sm" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          Residue: <strong className="text-slate-800 capitalize">{(order as any).residueType ?? (order as any).listingResidueType ?? 'Crop Residue'}</strong> · Quantity: <strong className="text-slate-800">{order.finalQuantityTons} Tons</strong>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Received {order.createdAt ? formatDate(order.createdAt) : 'Recently'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-3 sm:pt-0 border-t sm:border-t-0 gap-1">
                      <span className="text-xs text-slate-400">Total Purchase Value</span>
                      <p className="text-xl sm:text-2xl font-black text-primary-700">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>

                  {order.status === 'INTERESTED' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setConfirmModal(order.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
                      >
                        <CheckCircle2 size={16} /> Confirm Order & Schedule Pickup
                      </button>
                      <button
                        onClick={() => setDeclineModal(order.id)}
                        className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        <AlertCircle size={15} /> Decline
                      </button>
                    </div>
                  )}
                </Card>
              </SlideIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* ── Confirm Order Modal ── */}
      <Modal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Biomass Procurement Order"
        footer={
          <>
            <button
              onClick={() => setConfirmModal(null)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={updating}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-all shadow-xs disabled:opacity-60"
            >
              {updating ? 'Confirming Order…' : 'Yes, Confirm Sale'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          Are you sure you want to accept this procurement order? The buyer will be notified to dispatch weighing transport to your field on the available date.
        </p>
      </Modal>

      {/* ── Decline Order Modal ── */}
      <Modal
        open={!!declineModal}
        onClose={() => setDeclineModal(null)}
        title="Decline Procurement Order"
        footer={
          <>
            <button
              onClick={() => setDeclineModal(null)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDecline}
              disabled={updating}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {updating ? 'Declining Order…' : 'Decline Order'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to decline this procurement request from the buyer?
          </p>
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1"><AlertCircle size={14} /> Note</div>
            <p>The buyer will be informed and the listing will remain open to other interested plants.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

