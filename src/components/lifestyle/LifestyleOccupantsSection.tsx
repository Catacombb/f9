
import React from 'react';
import { OccupantEntry } from '@/types';
import { NamedOccupantsSection } from './NamedOccupantsSection';
import { animations } from '@/lib/animation';
import { cn } from '@/lib/utils';

interface LifestyleOccupantsSectionProps {
  occupantEntries: OccupantEntry[];
  onOccupantEntriesChange: (entries: OccupantEntry[]) => void;
}

export function LifestyleOccupantsSection({
  occupantEntries,
  onOccupantEntriesChange
}: LifestyleOccupantsSectionProps) {
  return (
    <div className={cn("space-y-6", animations.fadeIn)}>
      <NamedOccupantsSection 
        occupantEntries={occupantEntries} 
        onOccupantEntriesChange={onOccupantEntriesChange}
      />
    </div>
  );
}
