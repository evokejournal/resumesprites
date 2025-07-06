"use client";

import { MainLayout } from "@/components/MainLayout";
import { LinkManager } from "@/components/dashboard/LinkManager";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">Link Dashboard</h1>
          <p className="text-muted-foreground">Manage your shared resume links and track their performance.</p>
        </div>
        <LinkManager />
      </div>
    </MainLayout>
  );
}
