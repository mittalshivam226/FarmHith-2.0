'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, StatusBadge, SectionHeader, Badge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyBookings, useAvailableLabs } from '@farmhith/hooks';
import { FlaskConical, MapPin, Plus, Loader2 } from 'lucide-react';

export default function SoilTestPage() {
  const { user } = useAuth();
  const { data: bookings, loading: loadingBookings } = useMyBookings(user?.id);
  const { data: labs, loading: loadingLabs } = useAvailableLabs();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Soil Tests"
        description="Book soil tests from verified labs and view your reports"
        action={
          <Link
            href="/dashboard/soil-test/book"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} /> Book Test
          </Link>
        }
      />

      {/* My bookings */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Bookings</h2>
        {loadingBookings ? (
          <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FlaskConical size={32} className="mx-auto mb-3 opacity-30" />
            <p>No soil tests booked yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(booking => (
              <Link key={booking.id} href={`/dashboard/soil-test/${booking.id}`} className="block">
                <Card hover padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <FlaskConical size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{booking.labName}</p>
                        <p className="text-sm text-gray-500">{booking.cropType} · {booking.landParcelDetails}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Collection: {formatDate(booking.collectionDate)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={booking.status} />
                      <span className="text-sm font-semibold text-gray-700">{formatCurrency(booking.amountPaid)}</span>
                    </div>
                  </div>
                  {booking.report && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
                      {[
                        { label: 'N', value: booking.report.testParameters.nitrogen, unit: 'mg/kg' },
                        { label: 'P', value: booking.report.testParameters.phosphorus, unit: 'mg/kg' },
                        { label: 'K', value: booking.report.testParameters.potassium, unit: 'mg/kg' },
                        { label: 'pH', value: booking.report.testParameters.ph, unit: '' },
                      ].map(param => (
                        <div key={param.label} className="text-center">
                          <p className="text-xs text-gray-500">{param.label}</p>
                          <p className="text-sm font-bold text-gray-900">{param.value}{param.unit && <span className="text-xs font-normal text-gray-400 ml-0.5">{param.unit}</span>}</p>
                        </div>
                      ))}
                      <a href="#" className="ml-auto text-xs text-blue-600 hover:underline">Download PDF →</a>
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Browse labs */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Verified Labs Near You</h2>
        {loadingLabs ? (
          <div className="flex justify-center py-6"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
        ) : labs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No verified labs available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map(lab => (
              <Card key={lab.id} hover>
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <FlaskConical size={18} className="text-white" />
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <h3 className="font-semibold text-gray-900">{lab.labName}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={11} />{lab.address}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Per test</p>
                    <p className="text-base font-bold text-green-700">{formatCurrency(lab.perTestPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-sm font-semibold text-gray-700">{lab.dailyCapacity}/day</p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/soil-test/book?labId=${lab.id}`}
                  className="mt-4 w-full block text-center text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl transition-colors"
                >
                  Book with this Lab
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
