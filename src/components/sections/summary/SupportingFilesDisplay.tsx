
import React from 'react';
import { ProjectData } from '@/types';

interface SupportingFilesDisplayProps {
  uploadedFiles: ProjectData['files']['uploadedFiles'];
  siteDocuments: ProjectData['files']['siteDocuments'];
}

export function SupportingFilesDisplay({ uploadedFiles, siteDocuments }: SupportingFilesDisplayProps) {
  if ((uploadedFiles.length === 0) && (!siteDocuments || siteDocuments.length === 0)) {
    return null;
  }
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Supporting Files</h4>
      <div className="space-y-4">
        <p className="text-sm">
          The following files have been included with this design brief. 
          All documents can be accessed from the project portal.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {uploadedFiles.map((file, index) => (
            <li key={`download-${index}`}>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
          {siteDocuments && siteDocuments.map((file, index) => (
            <li key={`site-download-${index}`}>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
