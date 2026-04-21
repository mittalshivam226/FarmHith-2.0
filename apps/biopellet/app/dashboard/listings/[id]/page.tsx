'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, Badge, useToast, Modal } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { CropListing } from '@farmhith/types';
import { MapPin, Weight, CalendarDays, User, ArrowRight, Loader2 } from 'lucide-react';

export default function BiopelletListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, getToken } = useAuth();
  const toast = useToast();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<CropListing | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (!listingId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'cropListings', listingId));
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        setListing({ id: snap.id, ...snap.data() } as CropListing);
      }
      setFetchLoading(false);
    })();
  }, [listingId]);

  const handleOrder = async () => {
    if (!user || !listing) return;
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          listingId:         listing.id,
          finalQuantityTons: listing.quantityTons,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to place order');
      }

      toast.show({
        title: 'Interest Expressed',
        message: 'A procurement request has been sent to the farmer.',
        type: 'success',
      });
      router.push('/dashboard/orders');
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Error', message: err.message ?? 'Failed to place order. Please try again.', type: 'error' });
      setSubmitting(false);
    } finally {
      setConfirmModal(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Listing not found.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  const totalValue = listing.quantityTons * listing.farmhithPricePerTon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title={`Listing #${listing.id.slice(0, 8)}`}
        description="Review crop residue details and initiate procurement"
        action={
          <Button variant="outline" onClick={() => router.back()}>
            Back to Listings
          </Button>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Col - Info */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <Badge variant="success" size="sm">{listing.residueType}</Badge>
                <h2 className="text-xl font-bold mt-2 text-gray-900">{listing.quantityTons} Tons of {listing.residueType}</h2>
              </div>
              <StatusBadge status={listing.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <User size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Farmer</p>
                  <p className="font-medium text-gray-900">{listing.farmerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{listing.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDays size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Available From</p>
                  <p className="font-medium text-gray-900">{formatDate(listing.availableFrom)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Weight size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="font-medium text-gray-900">{listing.quantityTons} Tons</p>
                </div>
              </div>
            </div>

            {/* FarmHith Guarantee */}
            <div className="mt-6 bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3">
              <span className="text-xl shrink-0" aria-hidden>🛡️</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">FarmHith Verified Supply</p>
                <p className="text-xs text-gray-600 mt-1">
                  This listing is backed by FarmHith. Quality and quantity are verified at collection.
                  Transport is handled by our logistics partners.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col - Pricing & Action */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Procurement Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Rate per Ton</span>
                <span className="font-medium">{formatCurrency(listing.farmhithPricePerTon)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{listing.quantityTons} Tons</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                <span className="text-gray-500">Estimated Total</span>
                <span className="font-bold text-lg text-green-700">{formatCurrency(totalValue)}</span>
              </div>
            </div>

            {listing.status === 'ACTIVE' ? (
              <Button
                className="w-full flex justify-center items-center gap-2"
                onClick={() => setConfirmModal(true)}
              >
                Express Interest <ArrowRight size={16} />
              </Button>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-200 text-sm text-gray-500">
                This listing is no longer available.
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Verify Procurement Request"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmModal(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleOrder} disabled={submitting}>
              {submitting ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Processing…</> : 'Confirm Request'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            You are about to express interest in procuring <strong>{listing.quantityTons} tons</strong> of <strong>{listing.residueType}</strong> from {listing.farmerName}.
          </p>
          <p className="text-sm text-gray-600 shadow-sm border p-3 rounded-lg bg-yellow-50/50">
            Once the farmer confirms, a binding order will be created and FarmHith logistics will be assigned.
          </p>
        </div>
      </Modal>
    </div>
  );
}
