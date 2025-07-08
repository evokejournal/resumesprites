
"use client";

import { MainLayout } from "@/components/MainLayout";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { useResume } from "@/context/ResumeContext";
import { templates } from "@/lib/templates";
import { templateThemes } from "@/lib/data";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function TemplatesPage() {
  const { resumeData, updateField } = useResume();

  const handleSelectTemplateAndTheme = (templateId: string, themeId: string) => {
    updateField('template', templateId);
    updateField('theme', themeId);
  };
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-headline font-bold">Choose Your Template</h1>
            <p className="text-muted-foreground">Select a template that best represents your professional style.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                themes={templateThemes[template.id as keyof typeof templateThemes]}
                isSelected={resumeData.template === template.id}
                selectedTheme={resumeData.theme}
                onThemeSelect={handleSelectTemplateAndTheme}
                name={resumeData.about.name}
              />
            ))}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
