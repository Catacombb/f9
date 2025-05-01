
import React from 'react';
import { Label } from '@/components/ui/label';
import { OccupantEntry } from '@/types';

interface PrimaryUsersSelectProps {
  occupants: OccupantEntry[];
  selectedUsers: string[];
  onChange: (selectedIds: string[]) => void;
}

export const PrimaryUsersSelect = ({ occupants, selectedUsers, onChange }: PrimaryUsersSelectProps) => {
  const handleChange = (userId: string) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onChange(newSelectedUsers);
  };

  if (!occupants.length) {
    return (
      <div className="space-y-2">
        <Label className="block text-black font-medium">Primary Users</Label>
        <p className="text-sm text-black italic">
          No household occupants have been added yet. Add them in the Lifestyle section first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="block text-black font-medium">Primary Users</Label>
      <div className="flex flex-wrap gap-2">
        {occupants.map(occupant => (
          <div
            key={occupant.id}
            className={`
              px-3 py-1.5 rounded-md cursor-pointer border transition-colors
              ${selectedUsers.includes(occupant.id)
                ? 'bg-yellow-500 border-yellow-600 text-black'
                : 'bg-white border-gray-300 text-black hover:bg-yellow-100'
              }
            `}
            onClick={() => handleChange(occupant.id)}
          >
            <div className="flex items-center space-x-2">
              <span>{occupant.name}</span>
              {selectedUsers.includes(occupant.id) && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-black">
        Select who will primarily use this space
      </p>
    </div>
  );
};
