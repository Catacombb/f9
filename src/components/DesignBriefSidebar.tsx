
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { ChevronRight, Info, Home, PiggyBank, Users, MapPin, Layout, Building, Image, Upload, FileText, HelpCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/AppLogo';

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
  { id: 'communication', title: 'Communication', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'summary', title: 'Summary', icon: <FileText className="h-5 w-5" /> },
];

export function DesignBriefSidebar() {
  const { currentSection, setCurrentSection, projectData } = useDesignBrief();
  const isMobile = useIsMobile();

  const navigateToSection = (sectionId: SectionKey) => {
    setCurrentSection(sectionId);
  };
  
  const getSectionProgress = (sectionId: SectionKey): number => {
    if (sectionId === 'intro' || sectionId === 'summary') return 0;
    
    if (!projectData || !projectData.formData) return 0;
    
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
    
    const section = projectData.formData[sectionId];
    if (!section) return 0;
    
    const fields = requiredFields[sectionId];
    if (!fields || fields.length === 0) return 0;
    
    let completed = 0;
    fields.forEach(field => {
      if (section[field] && section[field] !== '' && section[field] !== undefined) {
        completed++;
      }
    });
    
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className={`h-full border-r bg-sidebar transition-all duration-300 relative ${isMobile ? 'w-full' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 flex flex-col items-center">
          <AppLogo size="large" />
          <span className="text-xs text-muted-foreground mt-2">Guiding Your Vision</span>
        </div>
        
        <Separator className="mb-2 bg-sidebar-border" />
        
        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {sections.map((section) => (
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
                  <span>{section.title}</span>
                  
                  {section.id !== 'intro' && section.id !== 'summary' && (
                    <div className="ml-auto flex items-center space-x-1">
                      {getSectionProgress(section.id as SectionKey) > 0 && (
                        <span className="text-xs text-sidebar-foreground/70">
                          {getSectionProgress(section.id as SectionKey)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-sidebar border-sidebar-border mt-auto">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#help" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Need help?</span>
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/about" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>About Northstar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
