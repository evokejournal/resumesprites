"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Education } from '@/lib/types';

export function EducationForm() {
  const { resumeData, updateField } = useResume();
  const { education } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedEducation = education.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('education', updatedEducation);
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: `edu${Date.now()}`,
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    updateField('education', [...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    const updatedEducation = education.filter(item => item.id !== id);
    updateField('education', updatedEducation);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>List your academic background and achievements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((item, index) => (
          <div key={item.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input id={`institution-${index}`} name="institution" value={item.institution} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., State University" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree / Field of Study</Label>
                <Input id={`degree-${index}`} name="degree" value={item.degree} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., B.S. in Computer Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input id={`startDate-${index}`} name="startDate" value={item.startDate} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Aug 2014" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input id={`endDate-${index}`} name="endDate" value={item.endDate} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., May 2018" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description / Achievements</Label>
              <Textarea id={`description-${index}`} name="description" value={item.description} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Graduated with honors, Dean's List" />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addEducation}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </CardContent>
    </Card>
  );
}
