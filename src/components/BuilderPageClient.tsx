"use client";

import { MainLayout } from "@/components/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ResumeBuilder } from "@/components/builder/ResumeBuilder";

export default function BuilderPageClient() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ResumeBuilder />
      </MainLayout>
    </ProtectedRoute>
  );
} 