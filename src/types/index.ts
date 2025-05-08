export interface SpaceRoom {
  id: string;
  type: string;
  quantity: number;
  description: string;
  isCustom: boolean;
  customName?: string;
  displayName?: string; // Added for naming individual rooms
  primaryUsers?: string[]; // Added for tracking who uses this room
  level?: string; // Added for tracking which level the room is on
}

export interface Professional {
  id: string;
  type: string;
  name: string;
  businessName?: string; // Added for business name
  email?: string; // Added for email
  phone?: string; // Added for phone
  website?: string; // Added for website
  contact?: string; // Kept for backward compatibility
  notes?: string;
  isCustom?: boolean;
}

export interface InspirationEntry {
  link: string;
  description: string;
}

export interface OccupantEntry {
  id: string;
  type: string; // 'adult', 'child', 'dog', 'cat', 'other'
  name: string;
  notes?: string;
}

export interface ProjectFiles {
  uploadedFiles: File[];
  uploadedInspirationImages: File[];
  inspirationSelections: string[];
  siteDocuments: File[]; 
  inspirationFiles: File[];
  supportingDocuments: File[]; // Add missing property
  sitePhotos: File[]; // Added site photos
  designFiles: File[];
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
    homeFeeling?: string; // Added missing property
    occupantEntries?: OccupantEntry[]; // New field for occupants with names and notes
  };
  site: {
    existingConditions: string;
    siteFeatures: string | string[] | undefined;
    viewsOrientations: string;
    accessConstraints: string;
    neighboringProperties: string;
    siteFeaturesAndViews?: string; // Added new combined field for site features and views
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
    inspirationEntries?: InspirationEntry[];
  };
  contractors: {
    preferredBuilder: string;
    goToTender: boolean;
    wantF9Build: boolean; // Changed from optional to required
    f9Build?: boolean; // Add this property for compatibility
    structuralEngineer?: string; // Add these new properties
    civilEngineer?: string;
    otherConsultants?: string;
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
    customVersionInterest?: string; // Interest in custom version (yes/no)
    customVersionDetails?: string;  // Added details field for custom version requirements
    userRole: string[];
    otherRoleSpecify?: string;
    teamSize: string;
    wouldRecommend: string;
    canContact: string;
    contactInfo?: string;
    feedbackComments?: string;
    callAvailability?: string; // Added missing property
  };
}

export interface ProjectData {
  formData: FormData;
  files: ProjectFiles;
  summary: BriefSummary;
  lastSaved?: string;
  currentSection?: string;
  projectId?: string; // Added to store the project ID directly in the project data
}

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'spaces' | 'architecture' | 'contractors' | 'communication' | 'uploads' | 'summary' | 'feedback';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
