
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { OccupantEntry } from '@/types';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, User, Baby, Dog, Cat, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PrimaryUsersSelectProps {
  occupants: OccupantEntry[];
  selectedUsers: string[];
  onChange: (selectedIds: string[]) => void;
}

export function PrimaryUsersSelect({ 
  occupants, 
  selectedUsers, 
  onChange 
}: PrimaryUsersSelectProps) {
  const [open, setOpen] = React.useState(false);
  
  const getOccupantIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="h-4 w-4" />;
      case 'child': return <Baby className="h-4 w-4" />;
      case 'dog': return <Dog className="h-4 w-4" />;
      case 'cat': return <Cat className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  // Toggle selection of a user
  const toggleUser = (id: string) => {
    const newSelection = selectedUsers.includes(id)
      ? selectedUsers.filter(userId => userId !== id)
      : [...selectedUsers, id];
    
    onChange(newSelection);
  };
  
  return (
    <div className="space-y-2">
      <Label>Who will primarily use this space?</Label>
      
      {occupants.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No people or pets added yet. You can add them in the Lifestyle section.
        </p>
      ) : (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} selected`
                  : "Select people/pets..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search people/pets..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {occupants.map((occupant) => (
                      <CommandItem
                        key={occupant.id}
                        value={occupant.name}
                        onSelect={() => {
                          toggleUser(occupant.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {getOccupantIcon(occupant.type)}
                          <span>{occupant.name || `Unnamed ${occupant.type}`}</span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedUsers.includes(occupant.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedUsers.map((userId) => {
                const occupant = occupants.find(o => o.id === userId);
                if (!occupant) return null;
                
                return (
                  <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                    {getOccupantIcon(occupant.type)}
                    <span>{occupant.name || `Unnamed ${occupant.type}`}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => toggleUser(userId)}
                    >
                      ×
                    </Button>
                  </Badge>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
