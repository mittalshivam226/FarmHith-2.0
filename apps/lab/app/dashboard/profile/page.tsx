'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Textarea } from '@farmhith/ui';
import { Save } from 'lucide-react';

export default function LabProfile() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    labName: 'AgriTest Punjab Labs',
    address: 'Phase 5, Industrial Area, Ludhiana',
    state: 'Punjab',
    district: 'Ludhiana',
    perTestPrice: '299',
    dailyCapacity: '20',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lab Profile</h1>
        <p className="text-slate-500">Manage your organisation details and capacity</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Organisation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="labName">Lab Name</Label>
              <Input
                id="labName"
                value={formData.labName}
                onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  disabled
                  value={formData.state}
                  className="mt-1 bg-slate-50"
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  disabled
                  value={formData.district}
                  className="mt-1 bg-slate-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Operations & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="perTestPrice">Standard Test Price (₹)</Label>
                <Input
                  id="perTestPrice"
                  type="number"
                  value={formData.perTestPrice}
                  onChange={(e) => setFormData({ ...formData, perTestPrice: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dailyCapacity">Daily Test Capacity</Label>
                <Input
                  id="dailyCapacity"
                  type="number"
                  value={formData.dailyCapacity}
                  onChange={(e) => setFormData({ ...formData, dailyCapacity: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
