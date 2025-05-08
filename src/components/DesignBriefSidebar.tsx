import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { SectionKey } from '@/types';
import { 
  Info, 
  Home, 
  Building, 
  PiggyBank, 
  Users, 
  MapPin, 
  Layout, 
  Upload, 
  FileText, 
  ExternalLink, 
  MessageSquare, 
  Star,
  DollarSign,
  Heart 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppLogo } from '@/components/AppLogo';
import { Badge } from '@/components/ui/badge';

interface DesignBriefSidebarProps {
  showLastSaved?: boolean;
  lastSavedFormatted?: string;
}

// Define section data with proper typing for better maintainability
const sectionData: Record<SectionKey, { icon: React.ReactNode, label: string, isTesterOnly?: boolean }> = {
  intro: { icon: <Info className="h-5 w-5" />, label: 'Introduction' },
  projectInfo: { icon: <Home className="h-5 w-5" />, label: 'Project Info' },
  site: { icon: <MapPin className="h-5 w-5" />, label: 'Site' },
  lifestyle: { icon: <Heart className="h-5 w-5" />, label: 'Lifestyle' },
  spaces: { icon: <Layout className="h-5 w-5" />, label: 'Spaces' },
  architecture: { icon: <Building className="h-5 w-5" />, label: 'Architecture' },
  contractors: { icon: <Users className="h-5 w-5" />, label: 'Project Team' },
  budget: { icon: <DollarSign className="h-5 w-5" />, label: 'Budget' },
  communication: { icon: <MessageSquare className="h-5 w-5" />, label: 'Communication' },
  uploads: { icon: <Upload className="h-5 w-5" />, label: 'Uploads' },
  summary: { icon: <FileText className="h-5 w-5" />, label: 'Summary' },
  feedback: { icon: <Star className="h-5 w-5" />, label: 'Feedback', isTesterOnly: true }
};

// Define section order for consistent navigation
const sectionOrder: SectionKey[] = [
  'intro', 
  'projectInfo', 
  'site', 
  'lifestyle', 
  'spaces', 
  'architecture', 
  'contractors', 
  'budget', 
  'communication', 
  'uploads', 
  'summary',
  'feedback'
];

export function DesignBriefSidebar({ showLastSaved = false, lastSavedFormatted = '' }: DesignBriefSidebarProps) {
  const { currentSection, setCurrentSection } = useDesignBrief();
  const isMobile = useIsMobile();

  const navigateToSection = (sectionId: SectionKey) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`h-full border-r bg-sidebar transition-all duration-300 relative ${isMobile ? 'w-full' : 'w-64'} overflow-hidden`}>
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 flex flex-col items-center">
          <AppLogo size="large" />
          <span className="text-xs text-muted-foreground mt-2 mb-3">Build your vision with F9 Productions</span>
          
          {showLastSaved && lastSavedFormatted && (
            <div className="mt-1 text-xs text-muted-foreground text-center pb-2 border-b border-sidebar-border w-full">
              Last saved {lastSavedFormatted}
            </div>
          )}
        </div>
        
        {!showLastSaved && <Separator className="mb-2 bg-sidebar-border" />}
        
        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {sectionOrder.map((sectionKey) => {
              const section = sectionData[sectionKey];
              const isActive = currentSection === sectionKey;
              
              // Skip the feedback section if it's not currently active
              // This keeps it hidden until explicitly navigated to
              if (section.isTesterOnly && currentSection !== sectionKey) {
                return null;
              }
              
              return (
                <Button
                  key={sectionKey}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1 relative group",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground animate-slide-in" 
                      : "hover:bg-sidebar-accent/20 transition-colors duration-200",
                    isMobile ? "text-sm py-2" : ""
                  )}
                  onClick={() => navigateToSection(sectionKey)}
                >
                  <div className="flex items-center w-full">
                    <span className={`mr-2 ${isActive !== true ? 'group-hover:text-primary group-hover:scale-110 transition-all duration-200' : ''}`}>
                      {section.icon}
                    </span>
                    <span className="truncate">{section.label}</span>
                    
                    {section.isTesterOnly && (
                      <Badge variant="outline" className="ml-2 text-[0.6rem] py-0 px-1.5 bg-purple-100 text-purple-800 border-purple-300">
                        Testers
                      </Badge>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r animate-fade-in" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-sidebar-accent/10 border-sidebar-border mt-auto">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start truncate bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground font-medium text-sm transition-all duration-200 group" 
              onClick={() => window.open('https://f9productions.com', '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5 shrink-0 text-accent group-hover:scale-110 transition-transform duration-200" />
              <span className="truncate">About F9 Productions</span>
            </Button>
          </div>
          
          <div className="mt-3 text-center text-xs text-muted-foreground">
            Design Brief Tool © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
