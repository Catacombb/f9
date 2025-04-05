
import React from 'react';
import { FormData } from '@/types';

interface SpacesInfoDisplayProps {
  spaces: FormData['spaces'];
  formatSpacesData: () => React.ReactNode;
}

export function SpacesInfoDisplay({ spaces, formatSpacesData }: SpacesInfoDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Spaces</h4>
      
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
