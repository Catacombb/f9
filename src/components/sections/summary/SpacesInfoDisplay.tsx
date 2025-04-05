
import React from 'react';
import { FormData } from '@/types';

interface SpacesInfoDisplayProps {
  spaces: FormData['spaces'];
  formatSpacesData: () => React.ReactNode;
}

export function SpacesInfoDisplay({ spaces, formatSpacesData }: SpacesInfoDisplayProps) {
  // Calculate total spaces and room type counts
  const getTotalSpacesSummary = () => {
    if (!spaces.rooms || !spaces.rooms.length) return null;
    
    const roomCounts: Record<string, number> = {};
    spaces.rooms.forEach(room => {
      const type = room.type;
      if (roomCounts[type]) {
        roomCounts[type]++;
      } else {
        roomCounts[type] = 1;
      }
    });
    
    // Convert to array of key rooms to highlight
    const keyRooms = Object.entries(roomCounts)
      .filter(([type, count]) => count > 0 && ['Bedroom', 'Bathroom', 'Kitchen', 'Living Room'].includes(type))
      .map(([type, count]) => `${count} ${count === 1 ? type : type + (type.endsWith('m') ? 's' : 's')}`)
      .join(', ');
    
    return (
      <p className="text-sm font-medium mb-4 animate-fade-in">
        Total Spaces: {spaces.rooms.length} — including {keyRooms}.
      </p>
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Spaces</h4>
      
      {spaces.rooms && spaces.rooms.length > 0 && getTotalSpacesSummary()}
      
      <div>
        <h5 className="font-medium">Home Level Type</h5>
        <p className="text-sm">{spaces.homeLevelType || 'Not specified'}</p>
      </div>
      
      <div>
        <h5 className="font-medium">Spaces</h5>
        <div className="space-y-2 text-sm">
          {formatSpacesData()}
        </div>
      </div>
      
      {spaces.homeSize && (
        <div>
          <h5 className="font-medium">Home Size</h5>
          <p className="text-sm">{spaces.homeSize}</p>
        </div>
      )}
      
      {spaces.eliminableSpaces && (
        <div>
          <h5 className="font-medium">Eliminable Spaces</h5>
          <p className="text-sm">{spaces.eliminableSpaces}</p>
        </div>
      )}
      
      {spaces.additionalNotes && (
        <div>
          <h5 className="font-medium">Additional Notes</h5>
          <p className="text-sm">{spaces.additionalNotes}</p>
        </div>
      )}
    </div>
  );
}
