"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface SkillBarProps {
  level: number;
  barColor?: string;
  bgColor?: string;
}

export function SkillBar({ level, barColor, bgColor }: SkillBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger the animation after a short delay to ensure it's visible
    const timer = setTimeout(() => setProgress(level), 100);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <Progress 
      value={progress} 
      className={`h-2 ${bgColor || 'bg-secondary'}`}
      indicatorClassName={barColor || 'bg-primary'}
    />
  );
}
