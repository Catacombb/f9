
import React, { useEffect } from 'react';
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
import { UploadsSection } from './sections/UploadsSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { SummarySection } from './sections/SummarySection';
import { useDesignBrief } from '@/context/DesignBriefContext';

export function DesignBrief() {
  const { currentSection, setCurrentSection } = useDesignBrief();
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);
  
  const renderSection = () => {
    switch(currentSection) {
      case 'intro':
        return <IntroSection />;
      case 'projectInfo':
        return <ProjectInfoSection />;
      case 'site':
        return <SiteSection />;
      case 'lifestyle':
        return <LifestyleSection />;
      case 'spaces':
        return <SpacesSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'contractors':
        return <ContractorsSection />;
      case 'budget':
        return <BudgetSection />;
      case 'uploads':
        return <UploadsSection />;
      case 'communication':
        return <CommunicationSection />;
      case 'feedback':
        return <FeedbackSection />;
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
