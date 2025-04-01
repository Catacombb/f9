
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
    proximitySettings: ProximityPair[];
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
}

export interface SpaceRoom {
  id: string;
  type: string;
  quantity: number;
  description: string;
  isCustom?: boolean;
}

export interface ProximityPair {
  id: string;
  space1Id: string;
  space2Id: string;
  relation: 'close' | 'far';
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

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'spaces' | 'architecture' | 'inspiration' | 'uploads' | 'summary';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
