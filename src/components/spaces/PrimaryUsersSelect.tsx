
import React from 'react';
import { Label } from '@/components/ui/label';
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
import { Check, ChevronsUpDown, User, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OccupantEntry } from '@/types';

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
  
  // Filter out pets (dogs, cats, other)
  const humanOccupants = occupants.filter(
    occupant => occupant.type === 'adult' || occupant.type === 'child'
  );
  
  const getOccupantIcon = (type: string) => {
    return type === 'adult' ? <User className="h-4 w-4" /> : <Baby className="h-4 w-4" />;
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
      <Label>Primary Users</Label>
      
      {humanOccupants.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No people added yet. You can add them in the Lifestyle section.
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
                  : "Select people..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search people..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {humanOccupants.map((occupant) => (
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
                const occupant = humanOccupants.find(o => o.id === userId);
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
