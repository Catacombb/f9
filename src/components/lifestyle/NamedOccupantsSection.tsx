
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OccupantEntryList } from './OccupantEntryList';
import { OccupantEntry } from '@/types';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animation';
import { Users } from 'lucide-react';

interface NamedOccupantsSectionProps {
  occupantEntries: OccupantEntry[];
  onOccupantEntriesChange: (entries: OccupantEntry[]) => void;
}

export function NamedOccupantsSection({ 
  occupantEntries, 
  onOccupantEntriesChange 
}: NamedOccupantsSectionProps) {
  return (
    <Card className={cn("mb-6", animations.fadeIn)}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="h-5 w-5 text-primary animate-pulse" />
        <CardTitle className="text-xl">People & Pets</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add information about each person and pet living in your home. 
          This helps us understand specific requirements and preferences for different spaces.
        </p>
        
        <OccupantEntryList 
          entries={occupantEntries || []} 
          onChange={onOccupantEntriesChange}
        />
      </CardContent>
    </Card>
  );
}
