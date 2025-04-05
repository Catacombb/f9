
import React from 'react';
import { ProjectData } from '@/types';

interface FilesDisplayProps {
  uploadedFiles: ProjectData['files']['uploadedFiles'];
  siteDocuments?: ProjectData['files']['siteDocuments'];
  title: string;
}

export function FilesDisplay({ uploadedFiles, siteDocuments, title }: FilesDisplayProps) {
  if ((!uploadedFiles || uploadedFiles.length === 0) && 
      (!siteDocuments || siteDocuments.length === 0)) {
    return null;
  }
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {uploadedFiles && uploadedFiles.map((file, index) => (
          <div key={`upload-${index}`} className="text-sm">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        ))}
        
        {siteDocuments && siteDocuments.map((file, index) => (
          <div key={`site-doc-${index}`} className="text-sm">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        ))}
      </div>
    </div>
  );
}
