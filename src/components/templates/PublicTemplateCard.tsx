
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Template {
  id: string;
  name: string;
  description: string;
  previewComponent: React.ReactNode;
}

interface PublicTemplateCardProps {
  template: Template;
}

export function PublicTemplateCard({ template }: PublicTemplateCardProps) {
  return (
    <Link href={`/explore-templates/${template.id}`} className="block group">
      <Card
        className="flex flex-col transition-all h-full cursor-pointer relative overflow-hidden group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-primary"
      >
        <CardHeader>
          <CardTitle className="h-14">{template.name}</CardTitle>
          <CardDescription className="h-16">{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="aspect-square overflow-hidden rounded-md border mt-auto">
            {template.previewComponent}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
