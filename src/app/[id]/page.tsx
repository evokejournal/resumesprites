"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import firebaseApp from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templateComponentMap } from "@/lib/templates";

export default function ResumeLinkPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) throw new Error('No link ID provided');
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeData, setResumeData] = useState<any>(null);
  const [showResume, setShowResume] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const db = getFirestore(firebaseApp);
      
      // Search in the global links collection using shortId
      const linksRef = collection(db, 'links');
      const linkQuery = query(linksRef, where('shortId', '==', id));
      const linkSnapshot = await getDocs(linkQuery);
      
      if (linkSnapshot.empty) {
        setError("Link not found.");
        setLoading(false);
        return;
      }
      
      const linkData = linkSnapshot.docs[0].data();
      
      if (linkData.password !== passcode) {
        setError("Incorrect passcode.");
        setLoading(false);
        return;
      }
      
      setResumeData(linkData.resumeDataSnapshot);
      setShowResume(true);
      setLoading(false);
    } catch (err) {
      console.error('Error loading resume:', err);
      setError("Failed to load resume.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!showResume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md flex flex-col items-center"
        >
          <h1 className="text-2xl font-bold mb-4 text-emerald-700">Enter Passcode</h1>
          <p className="mb-6 text-gray-600 text-center">
            This resume is protected. Please enter the passcode provided by the candidate.
          </p>
          <input
            type="password"
            className="border rounded px-4 py-2 w-full mb-4 text-lg"
            placeholder="Passcode"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            required
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <Button type="submit" className="w-full">Access Resume</Button>
        </form>
      </div>
    );
  }

  // Render the actual resume using the correct template and theme
  const TemplateComponent = templateComponentMap[resumeData?.template || 'modern'];
  
  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-3xl font-bold mb-4">Template not found</h1>
        <p className="text-gray-600">The selected template could not be loaded.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <TemplateComponent {...resumeData} />
    </div>
  );
} 