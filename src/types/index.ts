
export interface FormData {
  // Project Info
  projectInfo: {
    clientName: string;
    projectAddress: string;
    contactEmail: string;
    contactPhone: string;
    projectType: string;
    projectDescription: string;
    projectGoals?: string;
    coordinates?: [number, number]; // Longitude, Latitude
  };
  
  // Budget
  budget: {
    budgetRange: string;
    flexibilityNotes: string;
    priorityAreas: string;
    timeframe: string;
    budgetFlexibility?: string;
    budgetPriorities?: string[];
    budgetNotes?: string;
  };
  
  // Lifestyle
  lifestyle: {
    occupants: string; // JSON string containing family members and pets
    projectTimeframe: string; // JSON string containing timeframe details
    occupationDetails: string;
    dailyRoutine: string;
    entertainmentStyle: string;
    specialRequirements: string;
    pets?: string;
    specialNeeds?: string;
    hobbies?: string[];
    entertaining?: string;
    workFromHome?: string;
    lifestyleNotes?: string;
  };
  
  // Site
  site: {
    existingConditions: string;
    siteFeatures: string | string[];
    viewsOrientations: string;
    accessConstraints: string;
    neighboringProperties: string;
    topographicSurvey: string;
    existingHouseDrawings: string;
    septicDesign: string;
    certificateOfTitle: string;
    covenants: string;
    siteConstraints?: string[];
    siteAccess?: string;
    siteViews?: string;
    outdoorSpaces?: string[];
    siteNotes?: string;
  };
  
  // Spaces
  spaces: {
    rooms: SpaceRoom[];
    additionalNotes: string;
    eliminableSpaces?: string;
    homeSize?: string;
    roomArrangement?: string;
    roomTypes?: string[];
    specialSpaces?: string[];
    storageNeeds?: string;
    spatialRelationships?: string;
    accessibilityNeeds?: string;
    spacesNotes?: string;
    homeLevelType?: string;
    levelAssignments?: Record<string, string>;
    levelAssignmentNotes?: string;
  };
  
  // Architecture
  architecture: {
    stylePrefences: string;
    externalMaterials: string;
    internalFinishes: string;
    sustainabilityGoals: string;
    specialFeatures: string;
    preferredStyles?: string[];
    materialPreferences?: string[];
    sustainabilityFeatures?: string[];
    technologyRequirements?: string[];
    architectureNotes?: string;
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
    preferredMethods: string[]; 
    bestTimes: string[];
    availableDays: string[];
    frequency: string;
    urgentContact: string;
    responseTime: string;
    additionalNotes: string;
    communicationNotes?: string;
  };
  
  // Inspiration
  inspiration?: {
    inspirationNotes?: string;
  };
}

export interface SpaceRoom {
  id: string;
  type: string;
  quantity: number;
  description: string;
  isCustom?: boolean;
  customName?: string;
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
  uploadedInspirationImages: File[];
  inspirationSelections: string[];
  siteDocuments?: File[]; // Added this new property
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
