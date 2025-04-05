
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OccupantEntry } from '@/types';
import { NamedOccupantsSection } from './NamedOccupantsSection';
import { animations } from '@/lib/animation';
import { cn } from '@/lib/utils';

interface LifestyleOccupantsSectionProps {
  occupants: string;
  onOccupantsChange: (value: string) => void;
  occupantEntries: OccupantEntry[];
  onOccupantEntriesChange: (entries: OccupantEntry[]) => void;
}

export function LifestyleOccupantsSection({
  occupants,
  onOccupantsChange,
  occupantEntries,
  onOccupantEntriesChange
}: LifestyleOccupantsSectionProps) {
  
  const initialValues = {
    adults: 2,
    children: 0,
    dogs: 0,
    cats: 0,
    other: 0
  };
  
  const [values, setValues] = React.useState(() => {
    try {
      if (occupants) {
        return JSON.parse(occupants);
      }
    } catch (e) {}
    return initialValues;
  });

  const handleChange = (key: keyof typeof values, value: number) => {
    const numValue = parseInt(value as unknown as string, 10) || 0;
    const newValues = { ...values, [key]: numValue };
    setValues(newValues);
    onOccupantsChange(JSON.stringify(newValues));
  };
  
  return (
    <div className="space-y-6">
      <Card className={cn("transition-all duration-300", animations.fadeIn)}>
        <CardHeader>
          <CardTitle className="text-xl">Household Occupants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Please tell us who will be living in the home.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="transition-all duration-200 hover:scale-105">
              <Label htmlFor="adult-count" className="mb-2 block">Adults</Label>
              <Input
                id="adult-count"
                type="number"
                min="0"
                value={values.adults}
                onChange={(e) => handleChange('adults', parseInt(e.target.value, 10))}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
            <div className="transition-all duration-200 hover:scale-105">
              <Label htmlFor="child-count" className="mb-2 block">Children</Label>
              <Input
                id="child-count" 
                type="number"
                min="0"
                value={values.children}
                onChange={(e) => handleChange('children', parseInt(e.target.value, 10))}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
            <div className="transition-all duration-200 hover:scale-105">
              <Label htmlFor="dog-count" className="mb-2 block">Dogs</Label>
              <Input 
                id="dog-count"
                type="number"
                min="0"
                value={values.dogs}
                onChange={(e) => handleChange('dogs', parseInt(e.target.value, 10))}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
            <div className="transition-all duration-200 hover:scale-105">
              <Label htmlFor="cat-count" className="mb-2 block">Cats</Label>
              <Input 
                id="cat-count"
                type="number"
                min="0"
                value={values.cats}
                onChange={(e) => handleChange('cats', parseInt(e.target.value, 10))}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
            <div className="transition-all duration-200 hover:scale-105">
              <Label htmlFor="other-count" className="mb-2 block">Other Pets</Label>
              <Input 
                id="other-count"
                type="number"
                min="0"
                value={values.other}
                onChange={(e) => handleChange('other', parseInt(e.target.value, 10))}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <NamedOccupantsSection 
        occupantEntries={occupantEntries} 
        onOccupantEntriesChange={onOccupantEntriesChange}
      />
    </div>
  );
}
