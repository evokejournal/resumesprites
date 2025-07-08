"use client";

import { MainLayout } from "@/components/MainLayout";
import { ResumeBuilder } from "@/components/builder/ResumeBuilder";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ResumeBuilder />
      </MainLayout>
    </ProtectedRoute>
  );
}
