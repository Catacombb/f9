
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { ChevronRight, Info, Home, PiggyBank, Users, MapPin, Layout, Building, Image, Upload, FileText, ExternalLink } from 'lucide-react';
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
  { id: 'inspiration', title: 'Inspiration', icon: <Image className="h-5 w-5" /> },
  { id: 'uploads', title: 'Uploads', icon: <Upload className="h-5 w-5" /> },
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
        'technologyRequirements', 'architectureNotes'
      ],
      inspiration: [
        'inspirationNotes'
      ],
      uploads: [],
      communication: [
        'preferredMethods', 'responseTime', 'availableDays', 'bestTimes',
        'communicationNotes'
      ]
    };
    
    const section = projectData.formData[sectionId];
    if (!section) return 0;
    
    const fields = sectionFields[sectionId];
    if (!fields || fields.length === 0) {
      // For sections like inspiration and uploads, handle specially
      if (sectionId === 'inspiration') {
        // Check if there are any selected inspiration images
        const hasInspiration = projectData.files?.inspirationSelections && 
                             Object.keys(projectData.files.inspirationSelections).length > 0;
        const hasNotes = section.inspirationNotes && section.inspirationNotes.trim() !== '';
        
        if (hasInspiration && hasNotes) return 100;
        if (hasInspiration || hasNotes) return 50;
        return 0;
      }
      
      if (sectionId === 'uploads') {
        // Check if there are any uploaded files
        return projectData.files?.uploadedFiles && projectData.files.uploadedFiles.length > 0 ? 100 : 0;
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
          // Only count actively added professionals
          const activeProfessionals = section[field].filter(p => 
            p.name && p.name.trim() !== '' && 
            // Don't count professionals with default "no" selection
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
        // For boolean fields, it's considered filled if it's explicitly true or false
        if (section[field] !== undefined) {
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
