
import React from 'react';
import { DesignBriefLayout } from './DesignBriefLayout';
import { IntroSection } from './sections/IntroSection';
import { ProjectInfoSection } from './sections/ProjectInfoSection';
import { BudgetSection } from './sections/BudgetSection';
import { LifestyleSection } from './sections/LifestyleSection';
import { SiteSection } from './sections/SiteSection';
import { SpacesSection } from './sections/SpacesSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { ContractorsSection } from './sections/ContractorsSection';
import { CommunicationSection } from './sections/CommunicationSection';
import { InspirationSection } from './sections/InspirationSection';
import { UploadsSection } from './sections/UploadsSection';
import { SummarySection } from './sections/SummarySection';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from './ui/button';
import { generateTestData } from '@/utils/testDataGenerator';
import { toast } from 'sonner';

export function DesignBrief() {
  const { currentSection, updateFormData, projectData } = useDesignBrief();
  
  const loadTestData = () => {
    const testData = generateTestData();
    
    // Update each section with test data
    Object.entries(testData).forEach(([section, data]) => {
      updateFormData(section as any, data as any);
    });
    
    toast.success("Test data loaded successfully!");
  };
  
  const renderSection = () => {
    switch(currentSection) {
      case 'intro':
        return <IntroSection />;
      case 'projectInfo':
        return <ProjectInfoSection />;
      case 'contractors':
        return <ContractorsSection />;
      case 'budget':
        return <BudgetSection />;
      case 'lifestyle':
        return <LifestyleSection />;
      case 'spaces':
        return <SpacesSection />;
      case 'site':
        return <SiteSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'inspiration':
        return <InspirationSection />;
      case 'uploads':
        return <UploadsSection />;
      case 'communication':
        return <CommunicationSection />;
      case 'summary':
        // The summary section will auto-regenerate the summary when mounted
        return <SummarySection />;
      default:
        return <IntroSection />;
    }
  };
  
  return (
    <DesignBriefLayout>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTestData}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
          >
            Load Test Data
          </Button>
        </div>
      )}
      {renderSection()}
    </DesignBriefLayout>
  );
}
