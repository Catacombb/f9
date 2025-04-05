
import React from 'react';
import { ProjectData } from '@/types';

interface ProjectInfoDisplayProps {
  projectInfo: ProjectData['formData']['projectInfo'];
}

export function ProjectInfoDisplay({ projectInfo }: ProjectInfoDisplayProps) {
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Project Information</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Client Name:</p>
          <p className="text-sm">{projectInfo.clientName || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Project Address:</p>
          <p className="text-sm">{projectInfo.projectAddress || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Contact Email:</p>
          <p className="text-sm">{projectInfo.contactEmail || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Contact Phone:</p>
          <p className="text-sm">{projectInfo.contactPhone || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Project Type:</p>
          <p className="text-sm">
            {projectInfo.projectType ? projectInfo.projectType.replace('_', ' ') : "Not provided"}
          </p>
        </div>
      </div>
      
      {projectInfo.projectDescription && (
        <div className="mt-4">
          <p className="text-sm font-medium">Project Description:</p>
          <p className="text-sm">{projectInfo.projectDescription}</p>
        </div>
      )}
    </div>
  );
}
