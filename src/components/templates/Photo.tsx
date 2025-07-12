"use client";

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PhotoProps {
  photo: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Photo({ photo, name, size = 'md', className }: PhotoProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  if (!photo) {
    return null;
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage 
        src={photo} 
        alt={name} 
        data-ai-hint="profile picture"
        className="object-cover"
      />
      <AvatarFallback className="text-sm font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
} 