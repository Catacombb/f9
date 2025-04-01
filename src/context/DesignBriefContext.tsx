
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ProjectData, SectionKey } from '@/types';

const initialProjectData: ProjectData = {
  formData: {
    projectInfo: {
      clientName: '',
      projectAddress: '',
      contactEmail: '',
      contactPhone: '',
      projectType: '',
      projectDescription: '',
    },
    budget: {
      budgetRange: '',
      flexibilityNotes: '',
      priorityAreas: '',
      timeframe: '',
    },
    lifestyle: {
      occupants: '',
      occupationDetails: '',
      dailyRoutine: '',
      entertainmentStyle: '',
      specialRequirements: '',
    },
    site: {
      existingConditions: '',
      siteFeatures: '',
      viewsOrientations: '',
      accessConstraints: '',
      neighboringProperties: '',
      topographicSurvey: '',
      existingHouseDrawings: '',
      septicDesign: '',
      certificateOfTitle: '',
      covenants: '',
    },
    spaces: {
      rooms: [],
      additionalNotes: '',
    },
    architecture: {
      stylePrefences: '',
      externalMaterials: '',
      internalFinishes: '',
      sustainabilityGoals: '',
      specialFeatures: '',
    },
    contractors: {
      preferredBuilder: '',
      goToTender: false,
      professionals: [],
      additionalNotes: '',
    },
    communication: {
      preferredMethods: [],
      bestTimes: [],
      availableDays: [],
      frequency: '',
      urgentContact: '',
      responseTime: '',
      additionalNotes: '',
    },
  },
  files: {
    uploadedFiles: [],
    uploadedInspirationImages: [],
    inspirationSelections: [],
  },
  summary: {
    generatedSummary: '',
    editedSummary: '',
  },
  lastSaved: new Date().toISOString(),
  currentSection: 'intro',
};

type UpdateFormData = <K extends keyof ProjectData['formData']>(
  section: K,
  updates: Partial<ProjectData['formData'][K]>
) => void;

interface DesignBriefContextType {
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
  generateSummary?: () => void;
  sendByEmail?: () => void;
  exportAsPDF?: () => void;
}

const updateCommunicationPreferences = (
  draft: ProjectData, 
  updates: { 
    preferredMethods?: string[], 
    bestTimes?: string[], 
    availableDays?: string[], 
    frequency?: string, 
    urgentContact?: string, 
    responseTime?: string, 
    additionalNotes?: string 
  }
) => {
  draft.formData.communication = {
    ...draft.formData.communication,
    ...updates
  };
};

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');

  // Generic update function for any section in formData
  const updateFormData: UpdateFormData = useCallback((section, updates) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData[section] = { 
        ...updatedDraft.formData[section], 
        ...updates 
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const addRoom = useCallback((room: { type: string; quantity: number; description: string; isCustom: boolean }) => {
    setProjectData(draft => {
      const newRoom = {
        ...room,
        id: crypto.randomUUID(),
      };
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms.push(newRoom);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const updateRoom = useCallback((room: ProjectData['formData']['spaces']['rooms'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const roomIndex = updatedDraft.formData.spaces.rooms.findIndex(r => r.id === room.id);
      if (roomIndex !== -1) {
        updatedDraft.formData.spaces.rooms[roomIndex] = room;
      }
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const removeRoom = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms = updatedDraft.formData.spaces.rooms.filter(room => room.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const addProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals.push(professional);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const updateProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const professionalIndex = updatedDraft.formData.contractors.professionals.findIndex(p => p.id === professional.id);
      if (professionalIndex !== -1) {
        updatedDraft.formData.contractors.professionals[professionalIndex] = professional;
      }
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const removeProfessional = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals = updatedDraft.formData.contractors.professionals.filter(p => p.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const saveProjectData = useCallback(() => {
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [projectData]);

  const value: DesignBriefContextType = {
    projectData,
    formData: projectData.formData,
    files: projectData.files,
    summary: projectData.summary,
    updateFormData,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional,
    currentSection,
    setCurrentSection,
    saveProjectData,
  };

  return (
    <DesignBriefContext.Provider value={value}>
      {children}
    </DesignBriefContext.Provider>
  );
};

export const useDesignBrief = () => {
  const context = useContext(DesignBriefContext);
  if (context === undefined) {
    throw new Error('useDesignBrief must be used within a DesignBriefProvider');
  }
  return context;
};
