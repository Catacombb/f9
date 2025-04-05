import React, { useMemo } from 'react';
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
  const { currentSection, setCurrentSection, formData, files } = useDesignBrief();

  const completionStatus = useMemo(() => {
    return {
      intro: 100,
      projectInfo: calculateProjectInfoCompletion(formData.projectInfo),
      site: calculateSiteCompletion(formData.site),
      lifestyle: calculateLifestyleCompletion(formData.lifestyle),
      spaces: calculateSpacesCompletion(formData.spaces),
      architecture: calculateArchitectureCompletion(formData.architecture),
      contractors: calculateContractorsCompletion(formData.contractors),
      budget: calculateBudgetCompletion(formData.budget),
      communication: calculateCommunicationCompletion(formData.communication),
      uploads: calculateUploadsCompletion(files),
      feedback: calculateFeedbackCompletion(formData.feedback),
      summary: 100
    };
  }, [formData, files]);

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
            const completion = completionStatus[sectionKey];
            
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
                  
                  <div className="ml-auto flex items-center">
                    {!(sectionKey === 'intro' || sectionKey === 'summary' || sectionKey === 'feedback') && (
                      <div className="relative h-5 w-5 ml-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <circle 
                            className="text-slate-200 dark:text-slate-700" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            fill="none" 
                            strokeWidth="2" 
                          />
                          <circle 
                            className="text-primary" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            fill="none"
                            strokeWidth="2" 
                            strokeDasharray={`${completion * 62.831853 / 100} 62.831853`} 
                            strokeDashoffset="0" 
                            strokeLinecap="round" 
                            transform="rotate(-90, 12, 12)" 
                          />
                        </svg>
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-medium">
                          {completion}%
                        </span>
                      </div>
                    )}
                  </div>
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

function calculateProjectInfoCompletion(data: any): number {
  let completed = 0;
  let total = 8;
  
  if (data.clientName) completed++;
  if (data.projectAddress) completed++;
  if (data.contactEmail) completed++;
  if (data.contactPhone) completed++;
  if (data.projectType) completed++;
  if (data.projectDescription) completed++;
  if (data.projectGoals) completed++;
  if (data.moveInPreference) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateSiteCompletion(data: any): number {
  let completed = 0;
  let total = 6;
  
  if (data.existingConditions) completed++;
  if (data.siteFeatures) completed++;
  if (data.viewsOrientations) completed++;
  if (data.accessConstraints) completed++;
  if (data.neighboringProperties) completed++;
  if (data.siteNotes) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateLifestyleCompletion(data: any): number {
  let completed = 0;
  let total = 7;
  
  if (data.occupants) completed++;
  if (data.occupationDetails) completed++;
  if (data.dailyRoutine) completed++;
  if (data.entertainmentStyle) completed++;
  if (data.specialRequirements) completed++;
  if (data.pets) completed++;
  if (data.lifestyleNotes) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateSpacesCompletion(data: any): number {
  let completed = 0;
  let total = 6;
  
  if (data.rooms && data.rooms.length > 0) completed++;
  
  if (data.homeLevelType) completed++;
  if (data.homeSize) completed++;
  if (data.roomArrangement) completed++;
  if (data.eliminableSpaces) completed++;
  if (data.additionalNotes) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateArchitectureCompletion(data: any): number {
  let completed = 0;
  let total = 6;
  
  if (data.stylePrefences) completed++;
  if (data.externalMaterials) completed++;
  if (data.internalFinishes) completed++;
  if (data.sustainabilityGoals) completed++;
  if (data.specialFeatures) completed++;
  if (data.inspirationNotes) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateContractorsCompletion(data: any): number {
  let completed = 0;
  let total = 2;
  
  if (data.professionals && data.professionals.length > 0) completed++;
  
  if (data.goToTender === true || data.goToTender === false) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateBudgetCompletion(data: any): number {
  let completed = 0;
  let total = 5;
  
  if (data.budgetRange) completed++;
  if (data.flexibilityNotes) completed++;
  if (data.priorityAreas) completed++;
  if (data.timeframe) completed++;
  if (data.budgetNotes) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateCommunicationCompletion(data: any): number {
  let completed = 0;
  let total = 5;
  
  if (data.preferredMethods && data.preferredMethods.length) completed++;
  if (data.bestTimes && data.bestTimes.length) completed++;
  if (data.availableDays && data.availableDays.length) completed++;
  if (data.frequency) completed++;
  if (data.urgentContact) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateUploadsCompletion(files: any): number {
  let completed = 0;
  let total = 2;
  
  if (files?.uploadedFiles && files.uploadedFiles.length > 0) completed++;
  if (files?.siteDocuments && files.siteDocuments.length > 0) completed++;
  
  return Math.round((completed / total) * 100);
}

function calculateFeedbackCompletion(data: any): number {
  let completed = 0;
  let total = 5; // 4 ratings + comments
  
  if (data?.usabilityRating > 0) completed++;
  if (data?.performanceRating > 0) completed++;
  if (data?.functionalityRating > 0) completed++;
  if (data?.designRating > 0) completed++;
  if (data?.feedbackComments) completed++;
  
  return Math.round((completed / total) * 100);
}
