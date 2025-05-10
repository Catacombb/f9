import { ProjectData, FormData, SectionKey, SpaceRoom, Professional } from '@/types';
import { UploadedFile, FileUploadResult, FileDeleteResult } from '@/lib/supabase/services/fileService';

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
  sendByEmail: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isNewProject: boolean;
  
  // File management methods
  uploadFile: (category: string, file: File) => Promise<FileUploadResult>;
  deleteFile: (fileId: string) => Promise<FileDeleteResult>;
  uploadedFiles: Record<string, UploadedFile[]>;
  loadFilesForBrief: (briefId: string) => Promise<void>;
}
