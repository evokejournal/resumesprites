"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  colors: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  previewComponent: React.ReactNode;
}

interface TemplateCardProps {
  template: Template;
  themes?: Theme[];
  isSelected: boolean;
  selectedTheme: string;
  onThemeSelect: (templateId: string, themeId: string) => void;
  name: string;
}

const unsupportiveTemplates = ["retro-terminal", "operating-system"];

export function TemplateCard({ template, themes, isSelected, selectedTheme, onThemeSelect, name }: TemplateCardProps) {
  const showThemes = themes && !unsupportiveTemplates.includes(template.id);
  const selectedThemeObject = themes?.find(t => t.id === (isSelected ? selectedTheme : (themes?.[0]?.id || 'original')));

  const handleSelectTemplate = () => {
    onThemeSelect(template.id, isSelected ? selectedTheme : (themes?.[0]?.id || 'original'));
  };

  const handleThemeClick = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onThemeSelect(template.id, themeId);
  };

  return (
    <Card
      onClick={handleSelectTemplate}
      className={cn(
        "flex flex-col transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.03]", 
        isSelected && "ring-2 ring-primary scale-[1.03]"
      )}
    >
      {isSelected && (
        <CheckCircle2
            className="absolute top-3 right-3 z-10 h-10 w-10 text-primary fill-white"
        />
      )}
      <CardHeader>
        <CardTitle className="h-14">{template.name}</CardTitle>
        <CardDescription className="h-16">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div className="relative mt-auto">
          <div className="aspect-square overflow-hidden rounded-md border">
            {React.isValidElement(template.previewComponent)
              ? React.cloneElement(template.previewComponent, { 
                  theme: selectedThemeObject,
                  name: name
                })
              : template.previewComponent
            }
          </div>
          {showThemes && (
            <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  title={theme.name}
                  onClick={(e) => handleThemeClick(e, theme.id)}
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all bg-white/50 backdrop-blur-sm",
                    isSelected && selectedTheme === theme.id ? 'border-primary scale-110' : 'border-transparent'
                  )}
                >
                  <div className="h-5 w-5 rounded-full flex overflow-hidden border">
                    <div style={{ backgroundColor: theme.colors[0] }} className="w-1/3 h-full"></div>
                    <div style={{ backgroundColor: theme.colors[1] }} className="w-1/3 h-full"></div>
                    <div style={{ backgroundColor: theme.colors[2] }} className="w-1/3 h-full"></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
