"use client";

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CoverLetterForm() {
  const { resumeData, updateField } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('coverLetter', e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Letter (Optional)</CardTitle>
        <CardDescription>
          Write a compelling cover letter. This will appear as a pop-up when someone views your resume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coverLetter">Your Cover Letter</Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            value={resumeData.coverLetter}
            onChange={handleChange}
            placeholder="Start with a strong opening that grabs the reader's attention..."
            rows={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}
