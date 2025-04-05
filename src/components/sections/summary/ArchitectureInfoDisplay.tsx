
import React from 'react';
import { FormData } from '@/types';

interface ArchitectureInfoDisplayProps {
  architecture: FormData['architecture'];
}

export function ArchitectureInfoDisplay({ architecture }: ArchitectureInfoDisplayProps) {
  // Early return if no architecture data
  if (!architecture || Object.keys(architecture).length === 0) return null;

  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Architectural Preferences</h4>
      
      {architecture.stylePrefences && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Style Preferences</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.stylePrefences}</p>
        </div>
      )}
      
      {architecture.preferredStyles && architecture.preferredStyles.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Preferred Architectural Styles</h5>
          <div className="flex flex-wrap gap-2">
            {architecture.preferredStyles.map((style, index) => (
              <span key={index} className="bg-muted px-2 py-1 rounded-md text-sm">
                {style}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {architecture.externalMaterials && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">External Materials</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.externalMaterials}</p>
        </div>
      )}
      
      {architecture.internalFinishes && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Internal Finishes</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.internalFinishes}</p>
        </div>
      )}
      
      {architecture.sustainabilityGoals && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Sustainability Goals</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.sustainabilityGoals}</p>
        </div>
      )}
      
      {architecture.sustainabilityFeatures && architecture.sustainabilityFeatures.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Sustainability Features</h5>
          <div className="flex flex-wrap gap-2">
            {architecture.sustainabilityFeatures.map((feature, index) => (
              <span key={index} className="bg-muted px-2 py-1 rounded-md text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {architecture.specialFeatures && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Special Features</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.specialFeatures}</p>
        </div>
      )}
      
      {/* Display inspiration entries */}
      {architecture.inspirationEntries && architecture.inspirationEntries.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Inspiration References</h5>
          <div className="space-y-3">
            {architecture.inspirationEntries.map((entry, index) => (
              <div key={index} className="bg-muted/50 p-3 rounded-md">
                <a href={entry.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {entry.link}
                </a>
                {entry.description && (
                  <p className="text-gray-700 mt-1 whitespace-pre-line">{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {architecture.inspirationNotes && (
        <div className="mb-4">
          <h5 className="font-semibold mb-1">Additional Notes</h5>
          <p className="text-gray-700 whitespace-pre-line">{architecture.inspirationNotes}</p>
        </div>
      )}
    </div>
  );
}
