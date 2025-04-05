
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectData } from '@/types';

// Import all our display components
import { ProjectInfoDisplay } from './ProjectInfoDisplay';
import { BudgetInfoDisplay } from './BudgetInfoDisplay';
import { LifestyleInfoDisplay } from './LifestyleInfoDisplay';
import { SiteInfoDisplay } from './SiteInfoDisplay';
import { SpacesInfoDisplay } from './SpacesInfoDisplay';
import { ArchitectureInfoDisplay } from './ArchitectureInfoDisplay';
import { ContractorsInfoDisplay } from './ContractorsInfoDisplay';
import { FilesDisplay } from './FilesDisplay';
import { InspirationDisplay } from './InspirationDisplay';
import { CommunicationInfoDisplay } from './CommunicationInfoDisplay';
import { SupportingFilesDisplay } from './SupportingFilesDisplay';

interface SummaryTabContentProps {
  formData: ProjectData['formData'];
  files: ProjectData['files'];
  formatSpacesData: () => React.ReactNode;
  formatOccupantsData: () => string;
  inspirationImages: Array<{ id: string; src: string; alt: string }>;
}

export function SummaryTabContent({
  formData,
  files,
  formatSpacesData,
  formatOccupantsData,
  inspirationImages
}: SummaryTabContentProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Design Brief Overview</h3>
        
        <div className="border rounded-lg p-6 space-y-8">
          {/* Project Info */}
          <ProjectInfoDisplay projectInfo={formData.projectInfo} />
          
          {/* Budget Info */}
          <BudgetInfoDisplay budget={formData.budget} />
          
          {/* Lifestyle */}
          <LifestyleInfoDisplay 
            lifestyle={formData.lifestyle} 
            formatOccupantsData={formatOccupantsData} 
          />
          
          {/* Site Information */}
          <SiteInfoDisplay 
            site={formData.site} 
            sitePhotos={files.sitePhotos} 
          />
          
          {/* Spaces */}
          <SpacesInfoDisplay 
            spaces={formData.spaces} 
            formatSpacesData={formatSpacesData} 
          />
          
          {/* Architectural Preferences */}
          <ArchitectureInfoDisplay architecture={formData.architecture} />
          
          {/* Project Team */}
          <ContractorsInfoDisplay contractors={formData.contractors} />
          
          {/* Uploaded Files */}
          <FilesDisplay 
            uploadedFiles={files.uploadedFiles} 
            title="Uploaded Files" 
          />
          
          {/* Site Documents */}
          <FilesDisplay 
            uploadedFiles={[]} 
            siteDocuments={files.siteDocuments} 
            title="Site Documents" 
          />
          
          {/* Inspiration Selections */}
          <InspirationDisplay 
            inspirationSelections={files.inspirationSelections} 
            inspirationImages={inspirationImages} 
          />

          {/* Communication Preferences */}
          <CommunicationInfoDisplay communication={formData.communication} />
          
          {/* Supporting Files */}
          <SupportingFilesDisplay 
            uploadedFiles={files.uploadedFiles}
            siteDocuments={files.siteDocuments}
          />
        </div>
      </CardContent>
    </Card>
  );
}
