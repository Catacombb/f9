
import React from 'react';
import { ProjectData } from '@/types';

interface SiteInfoDisplayProps {
  site: ProjectData['formData']['site'];
}

export function SiteInfoDisplay({ site }: SiteInfoDisplayProps) {
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Site Information</h4>
      <div className="space-y-4">
        {site.existingConditions && (
          <div>
            <p className="text-sm font-medium">Existing Conditions:</p>
            <p className="text-sm">{site.existingConditions}</p>
          </div>
        )}
        {site.siteFeatures && (
          <div>
            <p className="text-sm font-medium">Site Features:</p>
            <p className="text-sm">
              {typeof site.siteFeatures === 'string' 
                ? site.siteFeatures 
                : Array.isArray(site.siteFeatures) 
                  ? site.siteFeatures.join(', ')
                  : String(site.siteFeatures)}
            </p>
          </div>
        )}
        {site.viewsOrientations && (
          <div>
            <p className="text-sm font-medium">Views/Orientations:</p>
            <p className="text-sm">{site.viewsOrientations}</p>
          </div>
        )}
        {site.accessConstraints && (
          <div>
            <p className="text-sm font-medium">Access/Constraints:</p>
            <p className="text-sm">{site.accessConstraints}</p>
          </div>
        )}
        {site.neighboringProperties && (
          <div>
            <p className="text-sm font-medium">Neighboring Properties:</p>
            <p className="text-sm">{site.neighboringProperties}</p>
          </div>
        )}
      </div>
    </div>
  );
}
