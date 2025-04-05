
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { ChevronRight, Info, Home, PiggyBank, Users, MapPin, Layout, Building, Image, Upload, FileText, ExternalLink, MessageSquare, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/AppLogo';

interface DesignBriefSidebarProps {
  showLastSaved?: boolean;
  lastSavedFormatted?: string;
}

const sections = [
  { id: 'intro', title: 'Introduction', icon: <Info className="h-5 w-5" /> },
  { id: 'projectInfo', title: 'Project Info', icon: <Home className="h-5 w-5" /> },
  { id: 'contractors', title: 'Project Team', icon: <Users className="h-5 w-5" /> },
  { id: 'budget', title: 'Budget', icon: <PiggyBank className="h-5 w-5" /> },
  { id: 'lifestyle', title: 'Lifestyle', icon: <Users className="h-5 w-5" /> },
  { id: 'site', title: 'Site', icon: <MapPin className="h-5 w-5" /> },
  { id: 'spaces', title: 'Spaces', icon: <Layout className="h-5 w-5" /> },
  { id: 'architecture', title: 'Architecture', icon: <Building className="h-5 w-5" /> },
  { id: 'uploads', title: 'Uploads', icon: <Upload className="h-5 w-5" /> },
  { id: 'communication', title: 'Communication', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'feedback', title: 'Feedback', icon: <Star className="h-5 w-5" /> },
  { id: 'summary', title: 'Summary', icon: <FileText className="h-5 w-5" /> },
];

export function DesignBriefSidebar({ showLastSaved = false, lastSavedFormatted = '' }: DesignBriefSidebarProps) {
  const { currentSection, setCurrentSection, projectData } = useDesignBrief();
  const isMobile = useIsMobile();

  const navigateToSection = (sectionId: SectionKey) => {
    setCurrentSection(sectionId);
  };
  
  const getSectionProgress = (sectionId: SectionKey): number => {
    // For intro and summary sections, always return 0 as they don't have inputs to track
    if (sectionId === 'intro' || sectionId === 'summary') return 0;
    
    if (!projectData || !projectData.formData) return 0;
    
    // Define fields for each section that should be tracked for progress
    const sectionFields = {
      projectInfo: [
        'clientName', 'projectAddress', 'contactEmail', 'contactPhone', 
        'projectType', 'projectDescription', 'projectGoals'
      ],
      contractors: [
        'preferredBuilder', 'goToTender', 'professionals'
      ],
      budget: [
        'budgetRange', 'timeframe', 'budgetPriorities', 'budgetFlexibility',
        'budgetNotes'
      ],
      lifestyle: [
        'occupants', 'pets', 'specialNeeds', 'hobbies', 'entertaining',
        'workFromHome', 'lifestyleNotes'
      ],
      site: [
        'siteFeatures', 'siteConstraints', 'siteAccess', 'siteViews',
        'outdoorSpaces', 'siteNotes'
      ],
      spaces: [
        'roomTypes', 'specialSpaces', 'storageNeeds', 'spatialRelationships',
        'accessibilityNeeds', 'spacesNotes'
      ],
      architecture: [
        'preferredStyles', 'materialPreferences', 'sustainabilityFeatures',
        'technologyRequirements', 'architectureNotes', 'inspirationNotes' 
      ],
      uploads: [],
      communication: [
        'preferredMethods', 'responseTime', 'availableDays', 'bestTimes',
        'communicationNotes'
      ]
    };
    
    const section = projectData.formData[sectionId];
    if (!section) return 0;
    
    // Special handling for contractors section
    if (sectionId === 'contractors') {
      // Professionals array should only count if they have explicit values
      const professionals = section.professionals || [];
      let completedCount = 0;
      let totalCount = 1; // Start with 1 for preferredBuilder field
      
      // Count preferredBuilder field
      if (section.preferredBuilder && section.preferredBuilder.trim() !== '') {
        completedCount++;
      }
      
      // Count goToTender field only if explicitly set (not using default value)
      totalCount++;
      if (section.goToTender === true || section.goToTender === false) {
        completedCount++;
      }
      
      // Count professional preferences - only if they have explicit values
      // Each predefined professional adds to total count
      const predefinedProfsCount = 4; // From the predefined list in ContractorsSection
      totalCount += predefinedProfsCount;
      
      // Calculate how many professionals have been explicitly set
      const explicitProfessionals = professionals.filter(p => 
        p.name && p.name.trim() !== ''
      );
      
      completedCount += Math.min(explicitProfessionals.length, predefinedProfsCount);
      
      // Count additional notes
      totalCount++;
      if (section.additionalNotes && section.additionalNotes.trim() !== '') {
        completedCount++;
      }
      
      return Math.round((completedCount / totalCount) * 100);
    }
    
    
    const fields = sectionFields[sectionId];
    if (!fields || fields.length === 0) {
      // For special sections like uploads and site
      if (sectionId === 'uploads') {
        // Check if there are any uploaded files
        const hasUploads = projectData.files?.uploadedFiles && projectData.files.uploadedFiles.length > 0;
        return hasUploads ? 100 : 0;
      }
      
      if (sectionId === 'site') {
        // Calculate site section progress including form fields and uploads
        let siteProgress = 0;
        const formFields = Object.keys(section).filter(key => 
          section[key] && 
          section[key] !== '' && 
          section[key] !== undefined
        ).length;
        
        // Count form fields (up to 50%)
        const totalFormFields = 10; // Approximate number of fields in the site section
        const formProgress = Math.min(50, Math.round((formFields / totalFormFields) * 50));
        siteProgress += formProgress;
        
        // Check for site photos and documents (up to 50%)
        const hasSitePhotos = projectData.files?.uploadedFiles && projectData.files.uploadedFiles.length > 0;
        const hasSiteDocuments = projectData.files?.siteDocuments && projectData.files.siteDocuments.length > 0;
        
        if (hasSitePhotos) siteProgress += 25;
        if (hasSiteDocuments) siteProgress += 25;
        
        return siteProgress;
      }
      
      return 0;
    }
    
    let completed = 0;
    let total = 0;
    
    fields.forEach(field => {
      // Skip fields that shouldn't count toward progress calculation
      if (field === 'professionals') {
        // Handle professionals array specially
        if (section[field] && Array.isArray(section[field])) {
          // Only count actively added professionals with explicit user input
          const activeProfessionals = section[field].filter(p => 
            p.name && p.name.trim() !== '' && 
            // Don't count professionals with default selection
            !(p.defaultSelection === false || p.defaultSelection === 'no')
          );
          
          if (activeProfessionals.length > 0) {
            total++;
            completed++;
          }
        }
        return;
      }
      
      total++;
      
      if (field === 'preferredMethods' || field === 'availableDays' || field === 'bestTimes' || 
          field === 'roomTypes' || field === 'specialSpaces' || field === 'siteFeatures' ||
          field === 'preferredStyles' || field === 'materialPreferences' || field === 'sustainabilityFeatures') {
        // For array fields, check if there's at least one item
        if (section[field] && Array.isArray(section[field]) && section[field].length > 0) {
          completed++;
        }
      } else if (field === 'goToTender') {
        // For boolean fields, it's considered filled if it's explicitly true or false (not undefined)
        if (section[field] === true || section[field] === false) {
          completed++;
        }
      } else {
        // For regular fields, check if not empty
        if (section[field] && section[field] !== '' && section[field] !== undefined) {
          completed++;
        }
      }
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className={`h-full border-r bg-sidebar transition-all duration-300 relative ${isMobile ? 'w-full' : 'w-64'} overflow-hidden`}>
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 flex flex-col items-center">
          <AppLogo size="large" />
          <span className="text-xs text-muted-foreground mt-2 mb-3">Guiding Your Vision</span>
          
          {showLastSaved && lastSavedFormatted && (
            <div className="mt-1 text-xs text-muted-foreground text-center pb-2 border-b border-sidebar-border w-full">
              Last saved {lastSavedFormatted}
            </div>
          )}
        </div>
        
        {!showLastSaved && <Separator className="mb-2 bg-sidebar-border" />}
        
        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {sections.map((section) => {
              const progress = getSectionProgress(section.id as SectionKey);
              return (
                <Button
                  key={section.id}
                  variant={currentSection === section.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1 relative",
                    currentSection === section.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
                    isMobile ? "text-sm py-2" : ""
                  )}
                  onClick={() => navigateToSection(section.id as SectionKey)}
                >
                  <div className="flex items-center w-full">
                    <span className="mr-2">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                    
                    {!(section.id === 'intro' || section.id === 'summary') && (
                      <div className="ml-auto">
                        <span className="text-xs text-sidebar-foreground/70">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-sidebar-accent/10 border-sidebar-border mt-auto">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start truncate bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground font-medium text-sm" 
              asChild
            >
              <Link to="/about" className="flex items-center">
                <ExternalLink className="mr-2 h-5 w-5 shrink-0 text-accent" />
                <span className="truncate">About Northstar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
