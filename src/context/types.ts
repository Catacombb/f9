import { ProjectData, FormData, SectionKey, SpaceRoom, Professional } from '@/types';

export interface DesignBriefContextType {
  projectData: ProjectData;
  formData: FormData;
  files: ProjectData['files'];
  currentBriefId: string | null;
  updateFormData: (section: string, updates: Record<string, any>) => void;
  updateFiles: (updates: Partial<ProjectData['files']>) => void;
  addRoom: (room: SpaceRoom) => void;
  updateRoom: (room: SpaceRoom) => void;
  removeRoom: (roomId: string) => void;
  addProfessional: (professional: Professional) => void;
  updateProfessional: (professional: Professional) => void;
  removeProfessional: (professionalId: string) => void;
  currentSection: SectionKey;
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionKey>>;
  saveProjectData: () => Promise<any>;
  loadProjectData: (briefId: string) => Promise<boolean>;
  exportAsPDF: () => Promise<Blob>;
  isLoading: boolean;
  error: string | null;
  sendByEmail: (email: string) => Promise<boolean>;
  isNewProject: boolean;
}
