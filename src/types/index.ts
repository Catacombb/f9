export interface FormData {
  // Project Info
  projectInfo: {
    clientName: string;
    projectAddress: string;
    contactEmail: string;
    contactPhone: string;
    projectType: string;
    projectDescription: string;
  };
  
  // Budget
  budget: {
    budgetRange: string;
    flexibilityNotes: string;
    priorityAreas: string;
    timeframe: string;
  };
  
  // Lifestyle
  lifestyle: {
    occupants: string;
    occupationDetails: string;
    dailyRoutine: string;
    entertainmentStyle: string;
    specialRequirements: string;
  };
  
  // Site
  site: {
    existingConditions: string;
    siteFeatures: string;
    viewsOrientations: string;
    accessConstraints: string;
    neighboringProperties: string;
    topographicSurvey: string;
    existingHouseDrawings: string;
    septicDesign: string;
    certificateOfTitle: string;
    covenants: string;
  };
  
  // Spaces
  spaces: {
    rooms: SpaceRoom[];
    additionalNotes: string;
  };
  
  // Architecture
  architecture: {
    stylePrefences: string;
    externalMaterials: string;
    internalFinishes: string;
    sustainabilityGoals: string;
    specialFeatures: string;
  };

  // Contractors
  contractors: {
    preferredBuilder: string;
    goToTender: boolean;
    professionals: Professional[];
    additionalNotes: string;
  };

  // Communication Preferences
  communication: {
    preferredMethod: string;
    bestTimes: string[];
    availableDays: string[];
    frequency: string;
    urgentContact: string;
    responseTime: string;
    additionalNotes: string;
  };
}

export interface SpaceRoom {
  id: string;
  type: string;
  quantity: number;
  description: string;
  isCustom?: boolean;
}

export interface Professional {
  id: string;
  type: string;
  name: string;
  contact?: string;
  notes?: string;
  isCustom?: boolean;
}

export interface ProjectFiles {
  uploadedFiles: File[];
  inspirationSelections: string[];
}

export interface BriefSummary {
  generatedSummary: string;
  editedSummary: string;
}

export interface ProjectData {
  formData: FormData;
  files: ProjectFiles;
  summary: BriefSummary;
  lastSaved?: string;
  currentSection?: string;
}

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'spaces' | 'architecture' | 'contractors' | 'communication' | 'inspiration' | 'uploads' | 'summary';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
