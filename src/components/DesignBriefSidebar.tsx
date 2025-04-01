
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { ChevronRight, Info, Home, PiggyBank, Users, MapPin, Layout, Building, Image, Upload, FileText, ChevronLeft, HelpCircle, Briefcase } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define all sections with their icons and titles
const sections = [
  { id: 'intro', title: 'Introduction', icon: <Info className="h-5 w-5" /> },
  { id: 'projectInfo', title: 'Project Info', icon: <Home className="h-5 w-5" /> },
  { id: 'budget', title: 'Budget', icon: <PiggyBank className="h-5 w-5" /> },
  { id: 'lifestyle', title: 'Lifestyle', icon: <Users className="h-5 w-5" /> },
  { id: 'site', title: 'Site', icon: <MapPin className="h-5 w-5" /> },
  { id: 'spaces', title: 'Spaces', icon: <Layout className="h-5 w-5" /> },
  { id: 'architecture', title: 'Architecture', icon: <Building className="h-5 w-5" /> },
  { id: 'contractors', title: 'Contractors', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'inspiration', title: 'Inspiration', icon: <Image className="h-5 w-5" /> },
  { id: 'uploads', title: 'Uploads', icon: <Upload className="h-5 w-5" /> },
  { id: 'summary', title: 'Summary', icon: <FileText className="h-5 w-5" /> },
];

export function DesignBriefSidebar() {
  const { currentSection, setCurrentSection, formData } = useDesignBrief();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Initially collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const navigateToSection = (sectionId: SectionKey) => {
    setCurrentSection(sectionId);
    if (isMobile) {
      setIsCollapsed(true);
    }
  };
  
  // Calculate progress for each section (simplified for MVP)
  const getSectionProgress = (sectionId: SectionKey): number => {
    // Skip progress for intro and summary sections
    if (sectionId === 'intro' || sectionId === 'summary') return 0;
    
    // Make sure formData is defined before accessing properties
    if (!formData) return 0;
    
    // Calculate based on filled fields for each section
    switch (sectionId) {
      case 'projectInfo':
        return calculateProgress(formData.projectInfo);
      case 'budget':
        return calculateProgress(formData.budget);
      case 'lifestyle':
        return calculateProgress(formData.lifestyle);
      case 'site':
        return calculateProgress(formData.site);
      case 'spaces':
        return formData.spaces && formData.spaces.rooms && formData.spaces.rooms.length > 0 ? 
          Math.min(100, Math.round((formData.spaces.rooms.length / 4) * 100)) : 0;
      case 'architecture':
        return calculateProgress(formData.architecture);
      case 'contractors':
        return formData.contractors && 
          (formData.contractors.preferredBuilder || 
           formData.contractors.professionals && formData.contractors.professionals.length > 0) ? 
          Math.min(100, formData.contractors.professionals ? 
            Math.round((formData.contractors.professionals.length / 3) * 50) + 
            (formData.contractors.preferredBuilder ? 50 : 0) : 
            (formData.contractors.preferredBuilder ? 50 : 0)) : 0;
      case 'inspiration':
      case 'uploads':
        return 0; // Will implement when files are handled
      default:
        return 0;
    }
  };
  
  // Helper to calculate progress based on filled fields
  const calculateProgress = (sectionData: Record<string, any> | undefined): number => {
    if (!sectionData) return 0;
    const totalFields = Object.keys(sectionData).length;
    if (totalFields === 0) return 0;
    
    const filledFields = Object.values(sectionData).filter(val => 
      val !== undefined && val !== null && val !== ''
    ).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div 
      className={cn(
        "h-screen border-r bg-sidebar transition-all duration-300 relative",
        isCollapsed ? "w-2 md:w-12" : "w-64"
      )}
    >
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 transition-all duration-300 z-10",
          isCollapsed ? "right-0 -mr-10" : "right-2"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className={cn("h-full", isCollapsed ? "hidden" : "block")}>
        <div className="py-6 px-4">
          <h2 className="text-xl font-semibold text-sidebar-foreground">Design Brief</h2>
          <p className="text-sm text-sidebar-foreground/70">Create your project brief</p>
        </div>
        
        <Separator className="mb-2 bg-sidebar-border" />
        
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="px-2 py-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1 relative",
                  currentSection === section.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                )}
                onClick={() => navigateToSection(section.id as SectionKey)}
              >
                <div className="flex items-center w-full">
                  <span className="mr-2">{section.icon}</span>
                  <span>{section.title}</span>
                  
                  {/* Progress indicator (only show for sections that can have progress) */}
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
        
        <div className="absolute bottom-0 w-full p-4 border-t bg-sidebar border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="#help" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Need help?</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
