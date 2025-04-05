
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface InspirationEntry {
  link: string;
  description: string;
}

interface InspirationEntryListProps {
  entries: InspirationEntry[];
  onChange: (entries: InspirationEntry[]) => void;
}

export function InspirationEntryList({ entries = [], onChange }: InspirationEntryListProps) {
  const addEntry = () => {
    onChange([...entries, { link: '', description: '' }]);
  };

  const updateEntry = (index: number, field: 'link' | 'description', value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    onChange(updatedEntries);
  };

  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    onChange(updatedEntries);
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No inspiration references added yet.</p>
      )}
      
      {entries.map((entry, index) => (
        <Card key={index} className="border border-muted">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h4 className="text-sm font-medium">Reference {index + 1}</h4>
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
              <Label htmlFor={`link-${index}`} className="mb-2 block">
                URL or Link
              </Label>
              <Input
                id={`link-${index}`}
                placeholder="https://www.example.com/inspiration"
                value={entry.link}
                onChange={(e) => updateEntry(index, 'link', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor={`description-${index}`} className="mb-2 block">
                What do you like about this?
              </Label>
              <Textarea
                id={`description-${index}`}
                placeholder="Describe what appeals to you about this design reference..."
                value={entry.description}
                onChange={(e) => updateEntry(index, 'description', e.target.value)}
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
        <span>Add Reference</span>
      </Button>
    </div>
  );
}
