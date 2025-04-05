
import React from 'react';
import { ProjectData } from '@/types';

interface ArchitectureInfoDisplayProps {
  architecture: ProjectData['formData']['architecture'];
}

export function ArchitectureInfoDisplay({ architecture }: ArchitectureInfoDisplayProps) {
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Architectural Preferences</h4>
      <div className="space-y-4">
        {architecture.stylePrefences && (
          <div>
            <p className="text-sm font-medium">Style Preferences:</p>
            <p className="text-sm">{architecture.stylePrefences}</p>
          </div>
        )}
        {architecture.externalMaterials && (
          <div>
            <p className="text-sm font-medium">External Materials:</p>
            <p className="text-sm">{architecture.externalMaterials}</p>
          </div>
        )}
        {architecture.internalFinishes && (
          <div>
            <p className="text-sm font-medium">Internal Finishes:</p>
            <p className="text-sm">{architecture.internalFinishes}</p>
          </div>
        )}
        {architecture.sustainabilityGoals && (
          <div>
            <p className="text-sm font-medium">Sustainability Goals:</p>
            <p className="text-sm">{architecture.sustainabilityGoals}</p>
          </div>
        )}
        {architecture.specialFeatures && (
          <div>
            <p className="text-sm font-medium">Special Features:</p>
            <p className="text-sm">{architecture.specialFeatures}</p>
          </div>
        )}
      </div>
    </div>
  );
}
