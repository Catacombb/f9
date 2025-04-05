
import React from 'react';
import { ProjectData } from '@/types';

interface ContractorsInfoDisplayProps {
  contractors: ProjectData['formData']['contractors'];
}

export function ContractorsInfoDisplay({ contractors }: ContractorsInfoDisplayProps) {
  if (contractors.professionals.length === 0) return null;
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Project Team</h4>
      <div className="space-y-4">
        {contractors.preferredBuilder && (
          <div>
            <p className="text-sm font-medium">Preferred Builder:</p>
            <p className="text-sm">{contractors.preferredBuilder}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium">Go to Tender:</p>
          <p className="text-sm">{contractors.goToTender ? "Yes" : "No"}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Professionals:</p>
          <div className="ml-4">
            {contractors.professionals.map((professional, index) => (
              <div key={professional.id || index} className="mb-2">
                <p className="text-sm">
                  <span className="font-medium">{professional.type}:</span> {professional.name}
                  {professional.contact && ` (${professional.contact})`}
                  {professional.notes && ` - ${professional.notes}`}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {contractors.additionalNotes && (
          <div>
            <p className="text-sm font-medium">Additional Notes:</p>
            <p className="text-sm">{contractors.additionalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
