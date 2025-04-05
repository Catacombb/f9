
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import {
  ArchiveIcon,
  BedIcon,
  BriefcaseIcon,
  BuildingIcon,
  CameraIcon,
  CheckCircleIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LandmarkIcon,
  LayoutIcon,
  MessageSquareIcon,
  DollarSignIcon,
  HeartIcon,
  MapIcon,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionKey } from '@/types';

const sectionData: Record<SectionKey, { icon: React.ReactNode, label: string, isTesterOnly?: boolean }> = {
  intro: { icon: <InfoIcon className="h-5 w-5" />, label: 'Introduction' },
  projectInfo: { icon: <BuildingIcon className="h-5 w-5" />, label: 'Project Information' },
  site: { icon: <MapIcon className="h-5 w-5" />, label: 'Site' },
  lifestyle: { icon: <HeartIcon className="h-5 w-5" />, label: 'Lifestyle' },
  spaces: { icon: <LayoutIcon className="h-5 w-5" />, label: 'Spaces' },
  architecture: { icon: <HomeIcon className="h-5 w-5" />, label: 'Architecture' },
  contractors: { icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Project Team' },
  budget: { icon: <DollarSignIcon className="h-5 w-5" />, label: 'Budget' },
  communication: { icon: <MessageSquareIcon className="h-5 w-5" />, label: 'Communication' },
  uploads: { icon: <CameraIcon className="h-5 w-5" />, label: 'Uploads' },
  summary: { icon: <CheckCircleIcon className="h-5 w-5" />, label: 'Summary' },
  feedback: { icon: <Star className="h-5 w-5 text-purple-500" />, label: 'Feedback', isTesterOnly: true }
};

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

export function DesignBriefSidebar() {
  const { currentSection, setCurrentSection } = useDesignBrief();

  const handleSectionClick = (section: SectionKey) => {
    setCurrentSection(section);
    window.scrollTo(0, 0);
  };

  return (
    <aside className="bg-slate-50 dark:bg-slate-900 border-r min-h-screen flex flex-col w-[280px] flex-shrink-0">
      <div className="p-4 border-b">
        <AppLogo />
      </div>
      
      <div className="flex-grow overflow-auto p-4">
        <nav className="space-y-2">
          {sectionOrder.map((sectionKey) => {
            const section = sectionData[sectionKey];
            const isActive = currentSection === sectionKey;
            
            return (
              <Button
                key={sectionKey}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal relative h-auto py-2",
                  isActive ? "bg-primary text-primary-foreground" : "",
                  section.isTesterOnly ? "border-purple-300 hover:border-purple-400" : ""
                )}
                onClick={() => handleSectionClick(sectionKey)}
              >
                <div className="flex items-center w-full">
                  <div className="mr-2 h-5 w-5 shrink-0">{section.icon}</div>
                  <span>{section.label}</span>
                  
                  {section.isTesterOnly && (
                    <Badge variant="outline" className="ml-2 text-[0.6rem] py-0 px-1.5 bg-purple-100 text-purple-800 border-purple-300">
                      Testers
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t text-center text-xs text-muted-foreground">
        Design Brief Tool © {new Date().getFullYear()}<br />
        <span className="opacity-50">v1.0.0</span>
      </div>
    </aside>
  );
}
