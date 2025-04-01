
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
  
  // Create dynamic title based on client name
  const clientName = projectData?.formData?.projectInfo?.clientName || '';
  
  // Calculate overall completion percentage - counting only required fields
  const calculateOverallProgress = () => {
    // Skip intro and summary sections
    const sections = ['projectInfo', 'contractors', 'budget', 'lifestyle', 'site', 'spaces', 'architecture', 'communication'];
    let totalProgress = 0;
    let totalRequiredFields = 0;
    let completedRequiredFields = 0;
    
    // Required fields for each section
    const requiredFields = {
      projectInfo: ['clientName', 'projectAddress', 'contactEmail', 'contactPhone', 'projectType'],
      contractors: [],
      budget: ['budgetRange'],
      lifestyle: ['occupants'],
      site: [],
      spaces: [],
      architecture: [],
      communication: []
    };
    
    // Calculate total required fields
    for (const section in requiredFields) {
      totalRequiredFields += requiredFields[section].length;
    }
    
    // Count completed required fields
    for (const section in requiredFields) {
      if (projectData.formData[section]) {
        requiredFields[section].forEach(field => {
          if (projectData.formData[section][field] && 
              projectData.formData[section][field] !== '' && 
              projectData.formData[section][field] !== undefined) {
            completedRequiredFields++;
          }
        });
      }
    }
    
    // Calculate progress percentage
    if (totalRequiredFields > 0) {
      totalProgress = Math.round((completedRequiredFields / totalRequiredFields) * 100);
    } else {
      totalProgress = 0;
    }
    
    return totalProgress;
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Check if we should show header - only show the logo after client info is entered
  const projectAddress = projectData?.formData?.projectInfo?.projectAddress || '';
  const showHeader = !clientName || !projectAddress;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesignBriefSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10">
          <div className="flex items-center space-x-2">
            <AppLogo size="small" />
            {showHeader && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Design Brief</span>
                <span className="text-xs text-muted-foreground">
                  Create your project brief
                </span>
              </div>
            )}
          </div>
          
          {/* Center content with last saved timestamp */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground">
            Last saved {lastSavedFormatted}
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </header>
        
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
              {!showHeader && clientName && (
                <span className="text-sm font-medium">{clientName} Brief</span>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
