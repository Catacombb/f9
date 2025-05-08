import { ProjectData, SectionKey, SpaceRoom, Professional, FormData } from '@/types';

export interface DesignBriefContextType {
  projectData: ProjectData;
  formData: FormData;
  files: ProjectData['files'];
  summary: ProjectData['summary'];
  updateFormData: (section: keyof FormData, updates: Partial<FormData[keyof FormData]>) => void;
  updateFiles: (updates: Partial<ProjectData['files']>) => void;
  updateSummary: (updates: Partial<ProjectData['summary']>) => void;
  addRoom: (room: Omit<SpaceRoom, 'id'>) => void;
  updateRoom: (room: SpaceRoom) => void;
  removeRoom: (roomId: string) => void;
  addProfessional: (professional: Omit<Professional, 'id'>) => void;
  updateProfessional: (professional: Professional) => void; 
  removeProfessional: (professionalId: string) => void;
  currentSection: SectionKey;
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionKey>>;
  saveProjectData: () => Promise<{ success: boolean; error?: any; projectId?: string; projectData?: ProjectData }>;
  exportAsPDF: () => Promise<Blob>;
  isLoading: boolean;
  error: string | null;
  sendByEmail: (email: string) => Promise<boolean>;
}
