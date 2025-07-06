"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

export function PortfolioForm() {
  const { resumeData, updateField } = useResume();
  const { portfolio } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPortfolio = portfolio.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('portfolio', updatedPortfolio);
  };

  const addPortfolioItem = () => {
    const newPortfolioItem: PortfolioItem = {
      id: `port${Date.now()}`,
      title: '',
      url: '',
      description: '',
    };
    updateField('portfolio', [...portfolio, newPortfolioItem]);
  };

  const removePortfolioItem = (id: string) => {
    const updatedPortfolio = portfolio.filter(item => item.id !== id);
    updateField('portfolio', updatedPortfolio);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Showcase your best projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {portfolio.map((item, index) => (
          <div key={item.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removePortfolioItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Project Title</Label>
                <Input id={`title-${index}`} name="title" value={item.title} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., Project Alpha" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`url-${index}`}>URL</Label>
                <Input id={`url-${index}`} name="url" value={item.url} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., https://github.com/user/project" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea id={`description-${index}`} name="description" value={item.description} onChange={(e) => handleChange(item.id, e)} placeholder="Describe the project, your role, and technologies used." />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addPortfolioItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </CardContent>
    </Card>
  );
}
