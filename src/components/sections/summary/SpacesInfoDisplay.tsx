
import React from 'react';
import { ProjectData } from '@/types';

interface SpacesInfoDisplayProps {
  spaces: ProjectData['formData']['spaces'];
  formatSpacesData: () => React.ReactNode;
}

export function SpacesInfoDisplay({ spaces, formatSpacesData }: SpacesInfoDisplayProps) {
  if (spaces.rooms.length === 0) return null;
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Spaces</h4>
      {formatSpacesData()}
      
      {spaces.additionalNotes && (
        <div className="mt-4">
          <p className="text-sm font-medium">Additional Notes:</p>
          <p className="text-sm">{spaces.additionalNotes}</p>
        </div>
      )}
    </div>
  );
}
