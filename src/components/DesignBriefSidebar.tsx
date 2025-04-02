
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
    if (sectionId === 'intro' || sectionId === 'summary' || sectionId === 'inspiration' || sectionId === 'uploads') return 0;
    
    if (!projectData || !projectData.formData) return 0;
    
    // Define required fields for each section - only these count toward completion
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
    
    const section = projectData.formData[sectionId];
    if (!section) return 0;
    
    const fields = requiredFields[sectionId];
    if (!fields || fields.length === 0) return 0;
    
    let completed = 0;
    fields.forEach(field => {
      if (field === 'preferredMethods' || field === 'availableDays' || field === 'bestTimes') {
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
    
    return Math.round((completed / fields.length) * 100);
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
                    
                    {!(section.id === 'intro' || section.id === 'summary' || section.id === 'inspiration' || section.id === 'uploads') && (
                      <div className="ml-auto">
                        {progress > 0 && (
                          <span className="text-xs text-sidebar-foreground/70">
                            {progress}%
                          </span>
                        )}
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
