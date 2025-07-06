"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/context/ResumeContext';
import { Loader2, Sparkles } from 'lucide-react';
import { parseResume } from '@/ai/flows/parse-resume-flow';

export function ResumeImportForm() {
    const { toast } = useToast();
    const { setResumeData } = useResume();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const resumeFileUri = reader.result as string;

            try {
                const parsedData = await parseResume({ resumeFileUri });
                
                setResumeData(currentData => {
                    const experience = parsedData.experience?.map(item => ({...item, id: `exp${Math.random()}`})) || currentData.experience;
                    const education = parsedData.education?.map(item => ({...item, id: `edu${Math.random()}`})) || currentData.education;
                    const skills = parsedData.skills?.map(item => ({...item, id: `skill${Math.random()}`})) || currentData.skills;
                    const portfolio = parsedData.portfolio?.map(item => ({...item, id: `port${Math.random()}`})) || currentData.portfolio;
                    const references = parsedData.references?.map(item => ({...item, id: `ref${Math.random()}`})) || currentData.references;
                    const custom = parsedData.custom || currentData.custom;

                    return {
                        ...currentData,
                        about: { ...currentData.about, ...parsedData.about },
                        contact: { ...currentData.contact, ...parsedData.contact },
                        experience,
                        education,
                        skills,
                        portfolio,
                        references,
                        custom,
                        coverLetter: parsedData.coverLetter || currentData.coverLetter,
                    };
                });

                toast({
                    title: 'Success!',
                    description: 'Your resume has been parsed and the fields have been pre-filled.',
                });
            } catch (error) {
                console.error("Failed to parse resume:", error);
                toast({
                    variant: 'destructive',
                    title: 'Parsing Failed',
                    description: 'There was an error parsing your resume file. Please ensure it is a common format (PDF, DOCX, TXT) and try again.',
                });
            } finally {
                setIsLoading(false);
                // Reset file input to allow uploading the same file again
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.onerror = () => {
            console.error("Failed to read file.");
            toast({
                variant: 'destructive',
                title: 'File Read Error',
                description: 'Could not read the selected file. Please try again.',
            });
            setIsLoading(false);
        };
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    Smart Import
                </CardTitle>
                <CardDescription>
                    Save time by uploading your existing resume. Our tool will automatically fill out the builder for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    disabled={isLoading}
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Parsing...
                        </>
                    ) : (
                        'Upload Resume File'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
