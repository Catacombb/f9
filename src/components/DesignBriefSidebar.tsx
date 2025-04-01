
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { ChevronRight, Info, Home, PiggyBank, Users, MapPin, Layout, Building, Image, Upload, FileText, ChevronLeft, HelpCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Define all sections with their icons and titles
const sections = [
  { id: 'intro', title: 'Introduction', icon: <Info className="h-5 w-5" /> },
  { id: 'projectInfo', title: 'Project Info', icon: <Home className="h-5 w-5" /> },
  { id: 'contractors', title: 'Project Team', icon: <Users className="h-5 w-5" /> },
  { id: 'budget', title: 'Budget', icon: <PiggyBank className="h-5 w-5" /> },
  { id: 'lifestyle', title: 'Lifestyle', icon: <Users className="h-5 w-5" /> },
  { id: 'spaces', title: 'Spaces', icon: <Layout className="h-5 w-5" /> },
  { id: 'site', title: 'Site', icon: <MapPin className="h-5 w-5" /> },
  { id: 'architecture', title: 'Architecture', icon: <Building className="h-5 w-5" /> },
  { id: 'inspiration', title: 'Inspiration', icon: <Image className="h-5 w-5" /> },
  { id: 'uploads', title: 'Uploads', icon: <Upload className="h-5 w-5" /> },
  { id: 'communication', title: 'Communication', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'summary', title: 'Summary', icon: <FileText className="h-5 w-5" /> },
];

export function DesignBriefSidebar() {
  const { currentSection, setCurrentSection, projectData } = useDesignBrief();
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
  
  // Calculate progress for each section - only count required fields
  const getSectionProgress = (sectionId: SectionKey): number => {
    // Skip progress for intro and summary sections
    if (sectionId === 'intro' || sectionId === 'summary') return 0;
    
    // Make sure projectData is defined before accessing properties
    if (!projectData || !projectData.formData) return 0;
    
    // Define required fields for each section
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
    
    // Calculate based on filled required fields for each section
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

  // Get client name and address from the project info
  const clientName = projectData?.formData?.projectInfo?.clientName || '';
  const clientAddress = projectData?.formData?.projectInfo?.projectAddress || '';

  // Create dynamic title and subtitle
  const briefTitle = clientName ? `${clientName} Brief` : 'Design Brief';
  const briefSubtitle = clientAddress ? `Create your project brief for ${clientAddress}` : 'Create your project brief';

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

      <div className={cn("h-full flex flex-col", isCollapsed ? "hidden" : "block")}>
        <div className="py-6 px-4">
          <h2 className="text-xl font-semibold text-sidebar-foreground truncate">{briefTitle}</h2>
          <p className="text-sm text-sidebar-foreground/70 truncate">{briefSubtitle}</p>
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
        
        <div className="p-4 border-t bg-sidebar border-sidebar-border">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/about" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>About Us</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#help" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Need help?</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
