"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { CustomItem } from '@/lib/types';

export function CustomForm() {
  const { resumeData, updateField } = useResume();
  const { custom } = resumeData;

  const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('custom', { ...custom, title: e.target.value });
  };

  const handleItemChange = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedItems = custom.items.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('custom', { ...custom, items: updatedItems });
  };

  const addItem = () => {
    const newItem: CustomItem = {
      id: `custom${Date.now()}`,
      description: '',
    };
    updateField('custom', { ...custom, items: [...custom.items, newItem] });
  };

  const removeItem = (id: string) => {
    const updatedItems = custom.items.filter(item => item.id !== id);
    updateField('custom', { ...custom, items: updatedItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Section</CardTitle>
        <CardDescription>Add a custom section to your resume. You can name it whatever you like.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sectionTitle">Section Title</Label>
          <Input id="sectionTitle" name="title" value={custom.title} onChange={handleSectionTitleChange} placeholder="e.g., Awards, Certifications" />
        </div>
        {custom.items.map((item, index) => (
          <div key={item.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea id={`description-${index}`} name="description" value={item.description} onChange={(e) => handleItemChange(item.id, e)} placeholder="Describe the item." />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </CardContent>
    </Card>
  );
}
