
import { ProjectData, SectionKey } from '@/types';

export interface UpdateFormData {
  <K extends keyof ProjectData['formData']>(
    section: K,
    updates: Partial<ProjectData['formData'][K]>
  ) => void;
}

export interface DesignBriefContextType {
  projectData: ProjectData;
  formData: ProjectData['formData'];
  files: ProjectData['files'];
  summary: ProjectData['summary'];
  updateFormData: UpdateFormData;
  addRoom: (room: { type: string; quantity: number; description: string; isCustom: boolean }) => void;
  updateRoom: (room: ProjectData['formData']['spaces']['rooms'][0]) => void;
  removeRoom: (id: string) => void;
  addProfessional: (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
  updateProfessional: (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
  removeProfessional: (id: string) => void;
  currentSection: SectionKey;
  setCurrentSection: (section: SectionKey) => void;
  saveProjectData: () => void;
  updateFiles: (updates: Partial<ProjectData['files']>) => void;
  updateSummary: (updates: Partial<ProjectData['summary']>) => void;
  sendByEmail: (email: string) => Promise<boolean>;
  exportAsPDF: () => Promise<void>;
}
