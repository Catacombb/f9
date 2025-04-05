
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OccupantEntryList } from './OccupantEntryList';
import { OccupantEntry } from '@/types';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animation';
import { Users, User, Baby, Dog, Cat, HelpCircle } from 'lucide-react';

interface NamedOccupantsSectionProps {
  occupantEntries: OccupantEntry[];
  onOccupantEntriesChange: (entries: OccupantEntry[]) => void;
}

export function NamedOccupantsSection({ 
  occupantEntries, 
  onOccupantEntriesChange 
}: NamedOccupantsSectionProps) {
  // Calculate occupant counts
  const counts = occupantEntries.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOccupants = occupantEntries.length;

  const getOccupantIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="h-5 w-5" />;
      case 'child': return <Baby className="h-5 w-5" />;
      case 'dog': return <Dog className="h-5 w-5" />;
      case 'cat': return <Cat className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <Card className={cn("mb-6", animations.fadeIn)}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="h-5 w-5 text-primary animate-pulse" />
        <CardTitle className="text-xl">People & Pets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sticky top-4 z-10 bg-card rounded-lg shadow-md p-4 mb-6 border border-muted flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium">Total Occupants: {totalOccupants}</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {Object.entries(counts).map(([type, count]) => (
              <div key={type} className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full text-sm animate-fade-in">
                {getOccupantIcon(type)}
                <span>{count} {type.charAt(0).toUpperCase() + type.slice(1)}{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
        
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
