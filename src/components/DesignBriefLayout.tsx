
import React from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';
import { ThemeToggle } from './ThemeProvider';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { AppLogo } from './AppLogo';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  const { projectData, currentSection } = useDesignBrief();
  
  // Create a form instance to provide FormContext
  const formMethods = useForm();
  
  const lastSavedFormatted = projectData.lastSaved 
    ? formatDistanceToNow(new Date(projectData.lastSaved), { addSuffix: true })
    : 'Not saved yet';
  
  // Create dynamic title based on client name and address
  const clientName = projectData?.formData?.projectInfo?.clientName || '';
  const projectAddress = projectData?.formData?.projectInfo?.projectAddress || '';
  
  const headerTitle = clientName ? `${clientName} Brief` : 'Design Brief';
  const headerSubtitle = projectAddress 
    ? `Create your project brief for ${projectAddress}`
    : currentSection === 'intro' 
      ? 'Create your project brief'
      : 'Create your project brief';
  
  // Calculate overall completion percentage
  const calculateOverallProgress = () => {
    // Skip intro and summary sections
    const sections = ['projectInfo', 'contractors', 'budget', 'lifestyle', 'site', 'spaces', 'architecture', 'communication'];
    let totalProgress = 0;
    
    // Use the calculated progress for each section from the context logic
    sections.forEach(section => {
      if (section === 'projectInfo' && projectData.formData.projectInfo) {
        const filled = Object.values(projectData.formData.projectInfo).filter(val => 
          val !== undefined && val !== null && val !== ''
        ).length;
        const required = ['clientName', 'projectAddress', 'contactEmail', 'contactPhone', 'projectType'].length;
        totalProgress += filled >= required ? 100 : Math.round((filled / required) * 100);
      } else if (section === 'contractors' && projectData.formData.contractors) {
        const hasBuilder = projectData.formData.contractors.preferredBuilder ? 1 : 0;
        const hasProfessionals = projectData.formData.contractors.professionals?.length > 0 ? 1 : 0;
        totalProgress += (hasBuilder + hasProfessionals) > 0 ? 50 : 0;
      } else if (projectData.formData[section]) {
        // For other sections, count any filled field as progress
        const filled = Object.values(projectData.formData[section]).filter(val => 
          val !== undefined && val !== null && val !== '' && val !== false
        ).length;
        totalProgress += filled > 0 ? Math.min(100, Math.round((filled / 3) * 100)) : 0;
      }
    });
    
    return Math.round(totalProgress / sections.length);
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Check if we should show header
  const showHeader = !clientName || !projectAddress;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesignBriefSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && (
          <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10">
            <div className="flex items-center space-x-2">
              <AppLogo size="small" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{headerTitle}</span>
                <span className="text-xs text-muted-foreground">
                  Last saved {lastSavedFormatted}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </header>
        )}
        
        <main className="flex-1 overflow-auto">
          <Form {...formMethods}>
            {children}
          </Form>
        </main>
        
        <footer className="h-16 border-t flex flex-col justify-between px-4 py-2 text-xs text-muted-foreground">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span>Overall Progress: {overallProgress}%</span>
              <span className="text-right">© 2025 Northstar by www.nickharrison.co</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <div className="flex justify-between items-center w-full">
            <div>
              {!showHeader && (
                <span className="text-sm font-medium">{headerTitle} • Last saved {lastSavedFormatted}</span>
              )}
            </div>
            <div className="flex space-x-4">
              <Link to="/about" className="hover:underline">About Northstar</Link>
              <a href="#help" className="hover:underline">Need help?</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
