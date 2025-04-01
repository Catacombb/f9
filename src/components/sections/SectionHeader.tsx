
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionHeaderProps {
  title: string;
  description?: string;
  isBold?: boolean;
  progress?: number;
}

export function SectionHeader({ title, description, isBold = true, progress }: SectionHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className={`text-2xl font-bold ${isMobile ? 'mb-1' : 'mb-0'}`}>{title}</h1>
        {progress !== undefined && (
          <div className="text-sm font-medium text-muted-foreground">
            {progress}% Complete
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
