
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

interface SectionHeaderProps {
  title: string;
  description?: string;
  isBold?: boolean;
  icon?: React.ReactNode;
  progress?: number;
}

export function SectionHeader({ title, description, isBold = true, icon, progress }: SectionHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className={`text-2xl font-bold ${isMobile ? 'mb-1' : 'mb-0'} flex items-center gap-2`}>
          {icon && icon}
          {title}
        </h1>
      </div>
      
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Completion</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
