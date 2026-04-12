'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Textarea, Select } from '@farmhith/ui';
import { Save } from 'lucide-react';

export default function BiopelletProfile() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plantName: 'Greenleaf Bio-Energy Ltd.',
    address: 'Industrial Zone, Rajpura',
    state: 'Punjab',
    district: 'Patiala',
    acceptedResidueTypes: 'Paddy Straw',
    procurementRatePerTon: '2500',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Plant Profile</h1>
        <p className="text-slate-500">Manage your facility details and procurement preferences</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Facility Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plantName">Plant Name</Label>
              <Input
                id="plantName"
                value={formData.plantName}
                onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
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
            <CardTitle>Procurement Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="acceptedResidueTypes">Primary Feedstock</Label>
              <Select
                id="acceptedResidueTypes"
                value={formData.acceptedResidueTypes}
                onValueChange={(val) => setFormData({ ...formData, acceptedResidueTypes: val })}
                className="mt-1"
                options={[
                  { label: 'Paddy Straw', value: 'Paddy Straw' },
                  { label: 'Wheat Straw', value: 'Wheat Straw' },
                  { label: 'Sugarcane Trash', value: 'Sugarcane Trash' },
                  { label: 'Cotton Stalks', value: 'Cotton Stalks' },
                ]}
              />
            </div>
            
            <div>
              <Label htmlFor="procurementRatePerTon">Default Procurement Rate (₹ / Ton)</Label>
              <Input
                id="procurementRatePerTon"
                type="number"
                value={formData.procurementRatePerTon}
                onChange={(e) => setFormData({ ...formData, procurementRatePerTon: e.target.value })}
                className="mt-1 max-w-xs"
              />
              <p className="text-xs text-slate-500 mt-1">This is shown to farmers as your target buying price.</p>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <Button type="button" variant="outline">Discard Changes</Button>
              <Button type="submit" isLoading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
