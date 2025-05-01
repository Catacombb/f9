
import React from 'react';
import { Label } from '@/components/ui/label';
import { OccupantEntry } from '@/types';
import { Check, User, Baby, Dog, Cat, HelpCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PrimaryUsersSelectProps {
  occupants: OccupantEntry[];
  selectedUsers: string[];
  onChange: (selectedIds: string[]) => void;
}

export const PrimaryUsersSelect = ({ occupants, selectedUsers, onChange }: PrimaryUsersSelectProps) => {
  const handleToggleUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onChange(newSelectedUsers);
  };

  const handleSelectUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      onChange([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    onChange(selectedUsers.filter(id => id !== userId));
  };

  if (!occupants.length) {
    return (
      <div className="space-y-2">
        <Label className="block text-black font-medium">Primary Users</Label>
        <p className="text-sm text-muted-foreground italic">
          No household occupants have been added yet. Add them in the Lifestyle section first.
        </p>
      </div>
    );
  }

  const getOccupantIcon = (type: string) => {
    switch (type) {
      case 'adult': return <User className="h-4 w-4" />;
      case 'child': return <Baby className="h-4 w-4" />;
      case 'dog': return <Dog className="h-4 w-4" />;
      case 'cat': return <Cat className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getOccupantName = (occupant: OccupantEntry): string => {
    let name = occupant.name || 'Unnamed';
    
    if (occupant.type === 'other' || occupant.type === 'dog' || occupant.type === 'cat') {
      name += ` (${occupant.type === 'other' ? 'Pet' : occupant.type.charAt(0).toUpperCase() + occupant.type.slice(1)})`;
    }
    
    return name;
  };

  return (
    <div className="space-y-3">
      <Label className="block text-black font-medium">Primary Users</Label>
      
      <div className="flex flex-col space-y-3">
        {/* Dropdown to add users */}
        <Select onValueChange={handleSelectUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Add primary user..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Household Members</SelectLabel>
              {occupants.map(occupant => (
                <SelectItem 
                  key={occupant.id} 
                  value={occupant.id} 
                  disabled={selectedUsers.includes(occupant.id)}
                >
                  <div className="flex items-center gap-2">
                    {getOccupantIcon(occupant.type)}
                    <span>{getOccupantName(occupant)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Display selected users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedUsers.map(userId => {
              const occupant = occupants.find(o => o.id === userId);
              if (!occupant) return null;
              
              return (
                <Badge 
                  key={userId} 
                  className="px-2 py-1 gap-1 flex items-center bg-yellow-100 text-black border border-yellow-300 hover:bg-yellow-200"
                >
                  {getOccupantIcon(occupant.type)}
                  <span>{getOccupantName(occupant)}</span>
                  <button 
                    type="button"
                    className="ml-1 rounded-full hover:bg-yellow-300 p-0.5"
                    onClick={() => handleRemoveUser(userId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Select who will primarily use this space
      </p>
    </div>
  );
};
