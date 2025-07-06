"use client";

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Loader2, Printer } from 'lucide-react';

export default function CoverLetterPdfPage() {
    const params = useParams();
    const { generatedLinks, isHydrated } = useResume();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // Wait for the context to be hydrated from localStorage
    if (!isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-500" />
                    <p className="mt-4 text-lg text-gray-600">Loading Document...</p>
                </div>
            </div>
        );
    }
    
    const linkData = generatedLinks.find(link => link.id === id);

    if (!linkData) {
        return notFound();
    }

    const { resumeDataSnapshot, url, password } = linkData;
    const { about, contact, coverLetter } = resumeDataSnapshot;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0">
            <div className="w-full max-w-4xl flex justify-end mb-4 print:hidden">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print / Save as PDF
                </Button>
            </div>
            <div className="bg-white shadow-lg p-12 w-full max-w-4xl aspect-[8.5/11] print:shadow-none print:p-16">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-gray-800">{about.name}</h1>
                        <p className="text-gray-600">{about.jobTitle}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p>{contact.email}</p>
                        <p>{contact.phone}</p>
                        <p>{contact.website}</p>
                        <p>{contact.location}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-gray-600">{currentDate}</p>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {coverLetter || "No cover letter provided."}
                </div>

                <div className="mt-12 pt-8 border-t text-center text-gray-700">
                    <p className="text-lg font-semibold">
                        My interactive resume can be viewed online here:
                    </p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                        {url}
                    </a>
                    <p className="mt-2 text-md">
                        Password: <span className="font-bold">{password}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
