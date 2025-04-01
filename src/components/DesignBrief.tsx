
import React from 'react';
import { DesignBriefLayout } from './DesignBriefLayout';
import { IntroSection } from './sections/IntroSection';
import { ProjectInfoSection } from './sections/ProjectInfoSection';
import { BudgetSection } from './sections/BudgetSection';
import { LifestyleSection } from './sections/LifestyleSection';
import { SiteSection } from './sections/SiteSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { InspirationSection } from './sections/InspirationSection';
import { UploadsSection } from './sections/UploadsSection';
import { SummarySection } from './sections/SummarySection';
import { useDesignBrief } from '@/context/DesignBriefContext';

export function DesignBrief() {
  const { currentSection } = useDesignBrief();
  
  const renderSection = () => {
    switch(currentSection) {
      case 'intro':
        return <IntroSection />;
      case 'projectInfo':
        return <ProjectInfoSection />;
      case 'budget':
        return <BudgetSection />;
      case 'lifestyle':
        return <LifestyleSection />;
      case 'site':
        return <SiteSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'inspiration':
        return <InspirationSection />;
      case 'uploads':
        return <UploadsSection />;
      case 'summary':
        return <SummarySection />;
      default:
        return <IntroSection />;
    }
  };
  
  return (
    <DesignBriefLayout>
      {renderSection()}
    </DesignBriefLayout>
  );
}
