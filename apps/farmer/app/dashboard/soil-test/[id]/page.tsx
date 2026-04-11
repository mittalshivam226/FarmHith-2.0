'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, SectionHeader, StatusBadge, Button } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { mockSoilTestBookings } from '../../../../lib/mock-data';
import { MapPin, FlaskConical, Calendar, Info, FileText } from 'lucide-react';

export default function SoilTestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const booking = mockSoilTestBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Booking not found.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title={`Booking #${booking.id}`}
        description="Soil test details and reports"
        action={
          <Button variant="outline" onClick={() => router.back()}>
            Back to List
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Lab Info */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FlaskConical size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{booking.labName}</p>
              <p className="text-xs text-gray-500">Testing Laboratory</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Collection Date</p>
                <p className="font-medium text-gray-900">{formatDate(booking.collectionDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <StatusBadge status={booking.status} size="sm" />
            </div>
          </div>
        </Card>

        {/* Payment & Crop Info */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Crop & Area Details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-500">Crop Type</span>
              <span className="font-medium text-gray-900">{booking.cropType}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-500">Land Details</span>
              <span className="font-medium text-gray-900">{booking.landParcelDetails}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-green-700">{formatCurrency(booking.amountPaid)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Section */}
      {booking.report ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Soil Analysis Report</p>
                <p className="text-xs text-gray-500">Generated {formatDate(booking.report.generatedAt)}</p>
              </div>
            </div>
            <Button variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50">
              Download PDF
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Nitrogen (N)', value: booking.report.testParameters.nitrogen, unit: 'mg/kg', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Phosphorus (P)', value: booking.report.testParameters.phosphorus, unit: 'mg/kg', color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'Potassium (K)', value: booking.report.testParameters.potassium, unit: 'mg/kg', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'pH Level', value: booking.report.testParameters.ph, unit: '', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(p => (
              <div key={p.label} className={`${p.bg} p-4 rounded-xl text-center border border-white/50`}>
                <p className="text-xs text-gray-500 font-medium mb-1">{p.label}</p>
                <p className={`text-2xl font-bold ${p.color}`}>
                  {p.value} <span className="text-xs font-normal opacity-70">{p.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Agronomist Recommendation</p>
            <p className="text-sm text-gray-600 leading-relaxed">{booking.report.recommendation}</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-8">
            <FileText size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-900">Report Pending</p>
            <p className="text-sm text-gray-500 mt-1">
              {booking.status === 'PENDING' ? 'Lab has not accepted this booking yet.' : 
               booking.status === 'IN_PROGRESS' ? 'Lab is currently analyzing the sample.' : 
               'Report will be available here when completed.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
