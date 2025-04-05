
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User, Baby, Dog, Cat, HelpCircle, Heart, Music, Laptop } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OccupantEntry } from '@/types';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animation';
import { useToast } from '@/hooks/use-toast';

interface OccupantEntryListProps {
  entries: OccupantEntry[];
  onChange: (entries: OccupantEntry[]) => void;
}

export function OccupantEntryList({ entries = [], onChange }: OccupantEntryListProps) {
  const { toast } = useToast();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const addEntry = () => {
    const newEntry = { id: crypto.randomUUID(), type: 'adult', name: '' };
    const newEntries = [...entries, newEntry];
    onChange(newEntries);
    setActiveIndex(newEntries.length - 1);
    
    // Show a toast notification
    toast({
      title: "Occupant Added",
      description: "New occupant has been added to your home.",
      duration: 3000,
    });
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
    const name = entries[index].name || `Occupant ${index + 1}`;
    const updatedEntries = entries.filter((_, i) => i !== index);
    onChange(updatedEntries);
    setActiveIndex(null);
    
    // Show a toast notification
    toast({
      title: "Occupant Removed",
      description: `${name} has been removed.`,
      duration: 3000,
    });
  };

  const getOccupantIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="h-5 w-5" />;
      case 'child': return <Baby className="h-5 w-5" />;
      case 'dog': return <Dog className="h-5 w-5" />;
      case 'cat': return <Cat className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const getOccupantDisplayName = (entry: OccupantEntry, index: number): string => {
    if (entry.name && entry.name.trim() !== '') {
      return entry.name;
    }
    
    const typeLabels = {
      'adult': 'Adult',
      'child': 'Child',
      'dog': 'Dog',
      'cat': 'Cat',
      'other': 'Pet'
    };
    
    return `${typeLabels[entry.type as keyof typeof typeLabels] || 'Occupant'} ${index + 1}`;
  };

  const getRandomPlaceholder = (type: string): string => {
    const adultPlaceholders = ["Works from home", "Enjoys quiet reading spaces", "Needs home office", "Early riser", "Night owl"];
    const childPlaceholders = ["Loves playing outside", "Needs study area", "Enjoys music", "Very active", "Has many toys"];
    const dogPlaceholders = ["Needs outdoor space", "Indoor dog", "Very energetic", "Older and calm", "Service animal"];
    const catPlaceholders = ["Indoor only", "Has cat tree", "Needs climbing spaces", "Multiple litter boxes", "Senior cat"];
    const otherPlaceholders = ["Needs special habitat", "Free-roaming", "Caged during day", "Aquatic pet", "Exotic animal"];
    
    const placeholders = {
      'adult': adultPlaceholders,
      'child': childPlaceholders,
      'dog': dogPlaceholders,
      'cat': catPlaceholders,
      'other': otherPlaceholders,
    };
    
    const options = placeholders[type as keyof typeof placeholders] || adultPlaceholders;
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No named occupants added yet.</p>
      )}
      
      {entries.map((entry, index) => (
        <Card 
          key={entry.id} 
          className={cn(
            "border border-muted transition-all duration-300",
            activeIndex === index ? "ring-2 ring-primary ring-opacity-50" : "",
            animations.fadeIn
          )}
          onClick={() => setActiveIndex(index)}
        >
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className={cn("flex items-center gap-2 transition-all", animations.slideIn)}>
                {getOccupantIcon(entry.type)}
                <h4 className="text-sm font-medium">
                  {getOccupantDisplayName(entry, index)}
                </h4>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeEntry(index)}
                className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 group"
              >
                <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                <span>Remove</span>
              </Button>
            </div>
            
            <div className={cn("transition-all", animations.fadeIn, "delay-100")}>
              <Label htmlFor={`occupant-type-${index}`} className="mb-2 block">
                Occupant Type
              </Label>
              <Select 
                value={entry.type} 
                onValueChange={(value) => updateEntry(index, 'type', value)}
              >
                <SelectTrigger id={`occupant-type-${index}`} className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all">
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
            
            <div className={cn("transition-all", animations.fadeIn, "delay-200")}>
              <Label htmlFor={`occupant-name-${index}`} className="mb-2 block">
                Name
              </Label>
              <Input
                id={`occupant-name-${index}`}
                placeholder="Enter name"
                value={entry.name}
                onChange={(e) => updateEntry(index, 'name', e.target.value)}
                className="focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
            
            <div className={cn("transition-all", animations.fadeIn, "delay-300")}>
              <Label htmlFor={`occupant-notes-${index}`} className="mb-2 block">
                Notes (optional)
              </Label>
              <Textarea
                id={`occupant-notes-${index}`}
                placeholder={getRandomPlaceholder(entry.type)}
                value={entry.notes || ''}
                onChange={(e) => updateEntry(index, 'notes', e.target.value)}
                className="min-h-[80px] focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        type="button" 
        variant="outline"
        onClick={addEntry}
        className={cn("w-full group transition-all duration-200 hover:bg-primary hover:text-primary-foreground", animations.pop)}
      >
        <Plus className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform duration-300" />
        <span>Add Person or Pet</span>
      </Button>
    </div>
  );
}
