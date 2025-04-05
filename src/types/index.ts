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
  siteDocuments?: File[]; 
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

export type SectionKey = 'intro' | 'projectInfo' | 'budget' | 'lifestyle' | 'site' | 'spaces' | 'architecture' | 'contractors' | 'communication' | 'uploads' | 'summary';

export interface Section {
  id: SectionKey;
  title: string;
  description: string;
  icon: string;
}
