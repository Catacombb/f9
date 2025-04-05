
import React from 'react';
import { ProjectData } from '@/types';

interface FilesDisplayProps {
  files?: File[];
  title: string;
  description?: string;
}

export function FilesDisplay({ files, title, description }: FilesDisplayProps) {
  if (!files || files.length === 0) {
    return null;
  }
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={`file-${index}`} className="text-sm">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        ))}
      </div>
    </div>
  );
}
