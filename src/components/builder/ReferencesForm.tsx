"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Reference } from '@/lib/types';

export function ReferencesForm() {
  const { resumeData, updateField } = useResume();
  const { references } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedReferences = references.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('references', updatedReferences);
  };

  const addReference = () => {
    const newReference: Reference = {
      id: `ref${Date.now()}`,
      name: '',
      contact: '',
      relation: '',
    };
    updateField('references', [...references, newReference]);
  };

  const removeReference = (id: string) => {
    const updatedReferences = references.filter(item => item.id !== id);
    updateField('references', updatedReferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>References</CardTitle>
        <CardDescription>Provide professional references if requested.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {references.map((item, index) => (
          <div key={item.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeReference(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Full Name</Label>
                <Input id={`name-${index}`} name="name" value={item.name} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`contact-${index}`}>Contact (Email/Phone)</Label>
                <Input id={`contact-${index}`} name="contact" value={item.contact} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., jane.s@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`relation-${index}`}>Relation</Label>
              <Input id={`relation-${index}`} name="relation" value={item.relation} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Former Manager" />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addReference}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Reference
        </Button>
      </CardContent>
    </Card>
  );
}
