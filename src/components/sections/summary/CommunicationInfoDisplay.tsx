
import React from 'react';
import { ProjectData } from '@/types';

interface CommunicationInfoDisplayProps {
  communication: ProjectData['formData']['communication'];
}

export function CommunicationInfoDisplay({ communication }: CommunicationInfoDisplayProps) {
  if (!communication.preferredMethods?.length && 
      !communication.bestTimes?.length &&
      !communication.availableDays?.length &&
      !communication.frequency &&
      !communication.urgentContact &&
      !communication.responseTime) {
    return null;
  }
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Communication Preferences</h4>
      <div className="space-y-4">
        {communication.preferredMethods?.length > 0 && (
          <div>
            <p className="text-sm font-medium">Preferred Methods:</p>
            <p className="text-sm">{communication.preferredMethods.join(', ')}</p>
          </div>
        )}
        {communication.bestTimes?.length > 0 && (
          <div>
            <p className="text-sm font-medium">Best Times:</p>
            <p className="text-sm">{communication.bestTimes.join(', ')}</p>
          </div>
        )}
        {communication.availableDays?.length > 0 && (
          <div>
            <p className="text-sm font-medium">Available Days:</p>
            <p className="text-sm">{communication.availableDays.join(', ')}</p>
          </div>
        )}
        {communication.frequency && (
          <div>
            <p className="text-sm font-medium">Update Frequency:</p>
            <p className="text-sm">{communication.frequency}</p>
          </div>
        )}
        {communication.urgentContact && (
          <div>
            <p className="text-sm font-medium">Urgent Contact:</p>
            <p className="text-sm">{communication.urgentContact}</p>
          </div>
        )}
        {communication.responseTime && (
          <div>
            <p className="text-sm font-medium">Expected Response Time:</p>
            <p className="text-sm">{communication.responseTime}</p>
          </div>
        )}
      </div>
    </div>
  );
}
