
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
  };
  
  // Architecture
  architecture: {
    stylePrefences: string;
    externalMaterials: string;
    internalFinishes: string;
    sustainabilityGoals: string;
    specialFeatures: string;
  };
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

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'architecture' | 'inspiration' | 'uploads' | 'summary';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
