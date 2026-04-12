'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Textarea, Select } from '@farmhith/ui';
import { Save } from 'lucide-react';

export default function MitraProfile() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Dr. Harpreet Kaur',
    bio: 'Agronomy expert with 8+ years helping Punjab farmers maximize yield through soil health management.',
    specialty1: 'Wheat Diseases',
    specialty2: 'Soil Fertility',
    sessionFee: '499',
    language: 'Punjabi',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Expert Profile</h1>
        <p className="text-slate-500">Manage your public information shown to farmers</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Consultation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty1">Primary Specialty</Label>
                <Input
                  id="specialty1"
                  value={formData.specialty1}
                  onChange={(e) => setFormData({ ...formData, specialty1: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="specialty2">Secondary Specialty</Label>
                <Input
                  id="specialty2"
                  value={formData.specialty2}
                  onChange={(e) => setFormData({ ...formData, specialty2: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="sessionFee">Session Fee (₹ / 30 mins)</Label>
                <Input
                  id="sessionFee"
                  type="number"
                  value={formData.sessionFee}
                  onChange={(e) => setFormData({ ...formData, sessionFee: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="language">Primary Language</Label>
                <Select
                  id="language"
                  value={formData.language}
                  onValueChange={(val) => setFormData({ ...formData, language: val })}
                  className="mt-1"
                  options={[
                    { label: 'Hindi', value: 'Hindi' },
                    { label: 'Punjabi', value: 'Punjabi' },
                    { label: 'English', value: 'English' },
                  ]}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-2 border-t border-slate-100 mt-4">
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
