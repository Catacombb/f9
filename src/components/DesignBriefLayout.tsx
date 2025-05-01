import React, { useState, useEffect } from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';
// Remove ThemeToggle import since we've removed dark mode
import { useDesignBrief } from '@/context/DesignBriefContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/AppLogo';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  const { projectData, currentSection } = useDesignBrief();
  const isMobile = useIsMobile();
  
  // Create a form instance to provide FormContext
  const formMethods = useForm();
  
  const lastSavedFormatted = projectData.lastSaved 
    ? formatDistanceToNow(new Date(projectData.lastSaved), { addSuffix: true })
    : 'Not saved yet';
  
  // Create dynamic title based on client name
  const clientName = projectData?.formData?.projectInfo?.clientName || '';
  
  // Calculate overall progress percentage - counting only required fields
  const calculateOverallProgress = () => {
    // Define required fields for each section
    const requiredFields = {
      projectInfo: ['clientName', 'projectAddress', 'contactEmail', 'contactPhone', 'projectType'],
      contractors: ['preferredBuilder', 'goToTender'],
      budget: ['budgetRange', 'timeframe'],
      lifestyle: ['occupants'],
      site: [],
      spaces: [],
      architecture: [],
      communication: ['preferredMethods', 'responseTime']
    };
    
    let totalRequiredFields = 0;
    let completedRequiredFields = 0;
    
    // Calculate total required fields
    for (const section in requiredFields) {
      totalRequiredFields += requiredFields[section].length;
    }
    
    // Count completed required fields
    for (const section in requiredFields) {
      if (projectData.formData[section]) {
        requiredFields[section].forEach(field => {
          if (field === 'preferredMethods' || field === 'availableDays' || field === 'bestTimes') {
            // For array fields, check if there's at least one item
            if (projectData.formData[section][field] && 
                Array.isArray(projectData.formData[section][field]) && 
                projectData.formData[section][field].length > 0) {
              completedRequiredFields++;
            }
          } else if (field === 'goToTender') {
            // For boolean fields, it's considered filled if it's explicitly true or false
            if (projectData.formData[section][field] !== undefined) {
              completedRequiredFields++;
            }
          } else {
            // For regular fields, check if not empty
            if (projectData.formData[section][field] && 
                projectData.formData[section][field] !== '' && 
                projectData.formData[section][field] !== undefined) {
              completedRequiredFields++;
            }
          }
        });
      }
    }
    
    // Calculate progress percentage
    if (totalRequiredFields > 0) {
      return Math.round((completedRequiredFields / totalRequiredFields) * 100);
    } else {
      return 0;
    }
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Check if we should show header - only show the logo after client info is entered
  const projectAddress = projectData?.formData?.projectInfo?.projectAddress || '';
  const showHeader = !clientName || !projectAddress;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background max-w-full">
      {!isMobile ? (
        <DesignBriefSidebar />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[80%] max-w-[280px]">
            <DesignBriefSidebar showLastSaved={true} lastSavedFormatted={lastSavedFormatted} />
          </SheetContent>
        </Sheet>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-center px-4 bg-background z-10 w-full ${isMobile ? 'sticky top-0' : ''}`}>
          <div className={`flex-1 flex justify-start items-center ${isMobile ? 'ml-8' : ''}`}>
            {/* Empty div to balance the layout */}
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <AppLogo size="small" />
          </div>
          
          <div className="flex-1 flex justify-end items-center">
            {!isMobile && (
              <span className="text-xs text-muted-foreground mr-2 truncate max-w-[150px]">
                Last saved {lastSavedFormatted}
              </span>
            )}
            {/* Removed ThemeToggle since we've removed dark mode */}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto w-full">
          <Form {...formMethods}>
            <div className="responsive-container">
              {children}
            </div>
          </Form>
        </main>
        
        <footer className="h-16 border-t flex flex-col justify-between px-4 py-2 text-xs text-muted-foreground w-full">
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex justify-between items-center w-full max-w-full mx-auto px-2">
              <span className="truncate">Overall Progress: {overallProgress}%</span>
              {isMobile && (
                <span className="text-xs truncate max-w-[50%]">
                  Last saved {lastSavedFormatted}
                </span>
              )}
            </div>
            <Progress value={overallProgress} className="h-2 w-full" />
            <div className="text-center mt-1 pb-2 truncate w-full">
              © 2025 Northstar by www.nickharrison.co
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
