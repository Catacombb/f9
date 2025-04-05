
export interface SpaceRoom {
  id: string;
  type: string;
  quantity: number;
  description: string;
  isCustom: boolean;
  customName?: string;
  displayName?: string; // Added for naming individual rooms
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
  siteDocuments: File[]; 
}

export interface BriefSummary {
  generatedSummary: string;
  editedSummary: string;
}

// Define the form data sections with their respective properties
export interface FormData {
  projectInfo: {
    clientName: string;
    projectAddress: string;
    contactEmail: string;
    contactPhone: string;
    projectType: string;
    projectDescription: string;
    moveInPreference: string;
    projectGoals?: string;
    moveInDate?: string;
    coordinates?: [number, number];
  };
  budget: {
    budgetRange: string;
    flexibilityNotes: string;
    priorityAreas: string;
    timeframe: string;
    budgetFlexibility?: string;
    budgetPriorities?: string[];
    budgetNotes?: string;
  };
  lifestyle: {
    occupants: string;
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
    homeFeeling?: string;
  };
  site: {
    existingConditions: string;
    siteFeatures: string | string[] | undefined;
    viewsOrientations: string;
    accessConstraints: string;
    neighboringProperties: string;
    topographicSurvey?: string;
    existingHouseDrawings?: string;
    septicDesign?: string;
    certificateOfTitle?: string;
    covenants?: string;
    siteConstraints?: string[];
    siteAccess?: string;
    siteViews?: string;
    outdoorSpaces?: string[];
    siteNotes?: string;
  };
  spaces: {
    rooms: SpaceRoom[];
    additionalNotes: string;
    roomTypes?: string[];
    specialSpaces?: string[];
    storageNeeds?: string;
    spatialRelationships?: string;
    accessibilityNeeds?: string;
    spacesNotes?: string;
    homeLevelType?: string;
    levelAssignmentNotes?: string;
    homeSize?: string;
    eliminableSpaces?: string;
    roomArrangement?: string;
  };
  architecture: {
    stylePrefences: string;
    externalMaterials: string;
    internalFinishes: string;
    sustainabilityGoals: string;
    specialFeatures: string;
    inspirationNotes: string;
    preferredStyles?: string[];
    materialPreferences?: string[];
    sustainabilityFeatures?: string[];
    technologyRequirements?: string[];
    architectureNotes?: string;
    externalMaterialsSelected?: string[];
    internalMaterialsSelected?: string[];
    inspirationLinks?: string;
    inspirationComments?: string;
  };
  contractors: {
    preferredBuilder: string;
    goToTender: boolean;
    professionals: Professional[];
    additionalNotes: string;
  };
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
  feedback: {
    usabilityRating: number;
    performanceRating: number;
    functionalityRating: number;
    designRating: number;
    likeMost: string;
    improvements: string;
    nextFeature: string;
    additionalFeedback: string;
    customVersionInterest: string;
    userRole: string[];
    otherRoleSpecify?: string;
    teamSize: string;
    wouldRecommend: string;
    canContact: string;
    contactInfo?: string;
    feedbackComments?: string; // Keep for backward compatibility
  };
}

export interface ProjectData {
  formData: FormData;
  files: ProjectFiles;
  summary: BriefSummary;
  lastSaved?: string;
  currentSection?: string;
}

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'spaces' | 'architecture' | 'contractors' | 'communication' | 'uploads' | 'summary' | 'feedback';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
