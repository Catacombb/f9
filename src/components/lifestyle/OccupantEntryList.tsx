
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User, Baby, Dog, Cat, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OccupantEntry } from '@/types';

interface OccupantEntryListProps {
  entries: OccupantEntry[];
  onChange: (entries: OccupantEntry[]) => void;
}

export function OccupantEntryList({ entries = [], onChange }: OccupantEntryListProps) {
  const addEntry = () => {
    onChange([...entries, { id: crypto.randomUUID(), type: 'adult', name: '' }]);
  };

  const updateEntry = (index: number, field: keyof OccupantEntry, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { 
      ...updatedEntries[index], 
      [field]: value 
    };
    onChange(updatedEntries);
  };

  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    onChange(updatedEntries);
  };

  const getOccupantIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="h-4 w-4" />;
      case 'child': return <Baby className="h-4 w-4" />;
      case 'dog': return <Dog className="h-4 w-4" />;
      case 'cat': return <Cat className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No named occupants added yet.</p>
      )}
      
      {entries.map((entry, index) => (
        <Card key={entry.id} className="border border-muted">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getOccupantIcon(entry.type)}
                <h4 className="text-sm font-medium">
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} {index + 1}
                </h4>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeEntry(index)}
                className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Remove</span>
              </Button>
            </div>
            
            <div>
              <Label htmlFor={`occupant-type-${index}`} className="mb-2 block">
                Occupant Type
              </Label>
              <Select 
                value={entry.type} 
                onValueChange={(value) => updateEntry(index, 'type', value)}
              >
                <SelectTrigger id={`occupant-type-${index}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="other">Other Pet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor={`occupant-name-${index}`} className="mb-2 block">
                Name
              </Label>
              <Input
                id={`occupant-name-${index}`}
                placeholder="Enter name"
                value={entry.name}
                onChange={(e) => updateEntry(index, 'name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor={`occupant-notes-${index}`} className="mb-2 block">
                Notes (optional)
              </Label>
              <Textarea
                id={`occupant-notes-${index}`}
                placeholder="Any specific details or preferences..."
                value={entry.notes || ''}
                onChange={(e) => updateEntry(index, 'notes', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        type="button" 
        variant="outline"
        onClick={addEntry}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        <span>Add Person or Pet</span>
      </Button>
    </div>
  );
}
