"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Experience } from '@/lib/types';

export function ExperienceForm() {
  const { resumeData, updateField } = useResume();
  const { experience } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperience = experience.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('experience', updatedExperience);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    updateField('experience', [...experience, newExperience]);
  };

  const removeExperience = (id: string) => {
    const updatedExperience = experience.filter(item => item.id !== id);
    updateField('experience', updatedExperience);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Detail your professional work experience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {experience.map((item, index) => (
          <div key={item.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input id={`company-${index}`} name="company" value={item.company} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Tech Solutions Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`role-${index}`}>Role</Label>
                <Input id={`role-${index}`} name="role" value={item.role} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Senior Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input id={`startDate-${index}`} name="startDate" value={item.startDate} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Jan 2020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input id={`endDate-${index}`} name="endDate" value={item.endDate} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Present" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description / Responsibilities</Label>
              <Textarea id={`description-${index}`} name="description" value={item.description} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., - Led the development of...\n- Mentored junior developers..." />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addExperience}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </CardContent>
    </Card>
  );
}
