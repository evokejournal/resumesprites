"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactForm() {
  const { resumeData, updateField } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField('contact', { ...resumeData.contact, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>How can employers get in touch with you?</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={resumeData.contact.email} onChange={handleChange} placeholder="e.g., alex.doe@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={resumeData.contact.phone} onChange={handleChange} placeholder="e.g., +1 123 456 7890" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website/Portfolio</Label>
          <Input id="website" name="website" value={resumeData.contact.website} onChange={handleChange} placeholder="e.g., yourportfolio.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={resumeData.contact.location} onChange={handleChange} placeholder="e.g., San Francisco, CA" />
        </div>
      </CardContent>
    </Card>
  );
}
