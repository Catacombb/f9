
import React from 'react';
import { OccupantEntry } from '@/types';
import { NamedOccupantsSection } from './NamedOccupantsSection';
import { animations } from '@/lib/animation';
import { cn } from '@/lib/utils';

interface LifestylePeopleTabProps {
  occupantEntries: OccupantEntry[];
  onOccupantEntriesChange: (entries: OccupantEntry[]) => void;
}

export function LifestylePeopleTab({
  occupantEntries,
  onOccupantEntriesChange
}: LifestylePeopleTabProps) {
  return (
    <div className={cn("space-y-6", animations.fadeIn)}>
      <NamedOccupantsSection 
        occupantEntries={occupantEntries} 
        onOccupantEntriesChange={onOccupantEntriesChange}
      />
    </div>
  );
}
