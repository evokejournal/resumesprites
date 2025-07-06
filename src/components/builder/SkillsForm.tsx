"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Skill } from '@/lib/types';

export function SkillsForm() {
  const { resumeData, updateField } = useResume();
  const { skills } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSkills = skills.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    updateField('skills', updatedSkills);
  };
  
  const handleSliderChange = (id: string, value: number[]) => {
    const updatedSkills = skills.map(item =>
      item.id === id ? { ...item, level: value[0] } : item
    );
    updateField('skills', updatedSkills);
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill${Date.now()}`,
      name: '',
      level: 50,
    };
    updateField('skills', [...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter(item => item.id !== id);
    updateField('skills', updatedSkills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Showcase your talents and expertise.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {skills.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`skillName-${index}`}>Skill Name</Label>
                <Input id={`skillName-${index}`} name="name" value={item.name} onChange={(e) => handleChange(item.id, e)} placeholder="e.g., JavaScript" />
              </div>
              <div className="w-1/3 space-y-2">
                <Label>Proficiency ({item.level}%)</Label>
                <Slider
                  value={[item.level]}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleSliderChange(item.id, value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive self-end" onClick={() => removeSkill(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addSkill}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </CardContent>
    </Card>
  );
}
