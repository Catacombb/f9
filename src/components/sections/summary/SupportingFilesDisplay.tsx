
import React from 'react';
import { ProjectData } from '@/types';

interface SupportingFilesDisplayProps {
  files: ProjectData['files'];
}

export function SupportingFilesDisplay({ files }: SupportingFilesDisplayProps) {
  const allFiles = [
    ...(files.uploadedFiles || []),
    ...(files.siteDocuments || []),
    ...(files.sitePhotos || []),
    ...(files.designFiles || []),
    ...(files.inspirationFiles || [])
  ];
  
  if (allFiles.length === 0) {
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
          {files.siteDocuments?.map((file, index) => (
            <li key={`site-doc-${index}`}>
              <span className="font-medium">Site Document:</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
          {files.sitePhotos?.map((file, index) => (
            <li key={`site-photo-${index}`}>
              <span className="font-medium">Site Photo:</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
          {files.designFiles?.map((file, index) => (
            <li key={`design-file-${index}`}>
              <span className="font-medium">Design File:</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
          {files.inspirationFiles?.map((file, index) => (
            <li key={`inspiration-file-${index}`}>
              <span className="font-medium">Inspiration File:</span> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
          {files.uploadedFiles?.map((file, index) => (
            <li key={`other-file-${index}`}>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
