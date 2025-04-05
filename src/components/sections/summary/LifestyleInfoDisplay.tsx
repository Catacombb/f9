
import React from 'react';
import { FormData } from '@/types';

interface LifestyleInfoDisplayProps {
  lifestyle: FormData['lifestyle'];
  formatOccupantsData: () => string;
}

export function LifestyleInfoDisplay({ lifestyle, formatOccupantsData }: LifestyleInfoDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Lifestyle</h4>
      
      <div className="grid gap-4">
        <div>
          <h5 className="font-medium">Occupants</h5>
          <p className="text-sm">{formatOccupantsData()}</p>
        </div>
        
        {lifestyle.occupationDetails && (
          <div>
            <h5 className="font-medium">Work Needs</h5>
            <p className="text-sm">{lifestyle.occupationDetails}</p>
          </div>
        )}
        
        {lifestyle.dailyRoutine && (
          <div>
            <h5 className="font-medium">Daily Routines</h5>
            <p className="text-sm">{lifestyle.dailyRoutine}</p>
          </div>
        )}
        
        {lifestyle.entertainmentStyle && (
          <div>
            <h5 className="font-medium">Entertainment Style</h5>
            <p className="text-sm">{lifestyle.entertainmentStyle}</p>
          </div>
        )}
        
        {lifestyle.specialRequirements && (
          <div>
            <h5 className="font-medium">Special Requirements</h5>
            <p className="text-sm">{lifestyle.specialRequirements}</p>
          </div>
        )}
        
        {lifestyle.homeFeeling && (
          <div>
            <h5 className="font-medium">Desired Home Feeling</h5>
            <p className="text-sm">{lifestyle.homeFeeling}</p>
          </div>
        )}
      </div>
    </div>
  );
}
