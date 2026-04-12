'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@farmhith/ui';
import { IndianRupee, TrendingUp, Download } from 'lucide-react';
import { Button } from '@farmhith/ui';

const TRANSACTIONS = [
  { id: 'TXN-1002', date: '2026-04-12', amount: 269.10, status: 'CREDITED', description: 'Payout for Soil Test #991' },
  { id: 'TXN-1001', date: '2026-04-10', amount: 269.10, status: 'CREDITED', description: 'Payout for Soil Test #990' },
  { id: 'TXN-1000', date: '2026-04-05', amount: 538.20, status: 'CREDITED', description: 'Payout for Soil Tests #988, #989' },
];

export default function LabEarnings() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Earnings & Payouts</h1>
          <p className="text-slate-500">View your revenue and transaction history</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Available to Withdraw</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-5 h-5 text-emerald-700" />
              <span className="text-3xl font-bold text-emerald-900">1,076.40</span>
            </div>
            <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">Withdraw Funds</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-5 h-5 text-slate-700" />
              <span className="text-3xl font-bold text-slate-900">4,580.00</span>
            </div>
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Clearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-5 h-5 text-amber-600" />
              <span className="text-3xl font-bold text-amber-700">538.20</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Will be credited in 2-3 business days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{txn.id}</td>
                    <td className="px-4 py-3 text-slate-500">{txn.date}</td>
                    <td className="px-4 py-3 text-slate-600">{txn.description}</td>
                    <td className="px-4 py-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                      +₹{txn.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
