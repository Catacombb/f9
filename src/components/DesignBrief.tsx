
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
import { Button } from './ui/button';
import { generateTestData, generateTestFiles } from '@/utils/testDataGenerator';
import { toast } from 'sonner';
import { Beaker } from 'lucide-react';

export function DesignBrief() {
  const { 
    currentSection, 
    updateFormData, 
    updateFiles, 
    updateSummary, 
    setCurrentSection, 
    projectData,
    markAsTestData 
  } = useDesignBrief();
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);
  
  const loadTestData = () => {
    toast.info("Loading test data. This may take a moment...");
    
    setTimeout(() => {
      try {
        // Mark this as test data so it will be cleared on refresh
        markAsTestData();
        
        // Generate comprehensive test data for all sections
        const testData = generateTestData();
        
        // Update each section with complete test data
        Object.entries(testData).forEach(([section, data]) => {
          updateFormData(section as any, data as any);
        });
        
        // Generate and update test files, including imagery and documents
        try {
          const fileData = generateTestFiles();
          updateFiles({
            uploadedFiles: fileData.uploadedFiles,
            uploadedInspirationImages: fileData.uploadedInspirationImages,
            inspirationSelections: fileData.inspirationSelections,
            siteDocuments: fileData.siteDocuments,
          });
          
          toast.success("Test data loaded successfully! All sections now 100% complete.", {
            duration: 5000,
          });
          
          // Automatically navigate to the summary section after loading test data
          setTimeout(() => {
            toast("Navigating to Summary section...");
            window.scrollTo(0, 0);
            updateSummary({ 
              editedSummary: "This design brief was auto-generated using the Load Test function. It represents a comprehensive example of a filled-out brief for a modern family home. All sections have been populated with realistic sample data to demonstrate the full capabilities of the Northstar brief system." 
            });
            setCurrentSection('summary');
          }, 1000);
        } catch (error) {
          console.error("Error generating test files:", error);
          toast.error("Test data loaded partially. Error with file generation.");
        }
      } catch (error) {
        console.error("Error loading test data:", error);
        toast.error("Failed to load test data. Please try again.");
      }
    }, 500);
  };
  
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
      case 'communication':
        return <CommunicationSection />;
      case 'uploads':
        return <UploadsSection />;
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
      {(process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_TEST_MODE === 'true') && (
        <div className="fixed top-20 right-4 z-50">
          <Button 
            onClick={loadTestData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md"
            size="sm"
          >
            <Beaker className="h-4 w-4 mr-2" />
            Load Test
          </Button>
        </div>
      )}
      {renderSection()}
    </DesignBriefLayout>
  );
}
