
import React from 'react';
import { ProjectData } from '@/types';

interface LifestyleInfoDisplayProps {
  lifestyle: ProjectData['formData']['lifestyle'];
  formatOccupantsData: () => string;
}

export function LifestyleInfoDisplay({ lifestyle, formatOccupantsData }: LifestyleInfoDisplayProps) {
  if (!lifestyle) {
    return null;
  }
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Lifestyle Information</h4>
      <div className="space-y-4">
        {lifestyle.occupants && (
          <div>
            <p className="text-sm font-medium">Occupants:</p>
            <p className="text-sm">{formatOccupantsData()}</p>
          </div>
        )}
        
        {lifestyle.occupationDetails && (
          <div>
            <p className="text-sm font-medium">Occupation Details:</p>
            <p className="text-sm">{lifestyle.occupationDetails}</p>
          </div>
        )}
        
        {lifestyle.dailyRoutine && (
          <div>
            <p className="text-sm font-medium">Daily Routine:</p>
            <p className="text-sm">{lifestyle.dailyRoutine}</p>
          </div>
        )}
        
        {lifestyle.entertainmentStyle && (
          <div>
            <p className="text-sm font-medium">Entertainment Style:</p>
            <p className="text-sm">{lifestyle.entertainmentStyle}</p>
          </div>
        )}
        
        {lifestyle.specialRequirements && (
          <div>
            <p className="text-sm font-medium">Special Requirements:</p>
            <p className="text-sm">{lifestyle.specialRequirements}</p>
          </div>
        )}
        
        {lifestyle.homeFeeling && (
          <div>
            <p className="text-sm font-medium">Desired Home Feeling:</p>
            <p className="text-sm">{lifestyle.homeFeeling}</p>
          </div>
        )}
      </div>
    </div>
  );
}
