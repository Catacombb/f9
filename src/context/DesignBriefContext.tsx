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

type UpdateProjectInfo = (
  updates: Partial<ProjectData['formData']['projectInfo']>
) => void;

type UpdateBudget = (
  updates: Partial<ProjectData['formData']['budget']>
) => void;

type UpdateLifestyle = (
  updates: Partial<ProjectData['formData']['lifestyle']>
) => void;

type UpdateSite = (
  updates: Partial<ProjectData['formData']['site']>
) => void;

type UpdateSpaces = (
  updates: Partial<ProjectData['formData']['spaces']>
) => void;

type UpdateArchitecture = (
  updates: Partial<ProjectData['formData']['architecture']>
) => void;

type UpdateContractors = (
  updates: Partial<ProjectData['formData']['contractors']>
) => void;

type UpdateCommunication = (
    updates: {
        preferredMethods?: string[],
        bestTimes?: string[],
        availableDays?: string[],
        frequency?: string,
        urgentContact?: string,
        responseTime?: string,
        additionalNotes?: string
    }
) => void;

type UpdateFiles = (
  updates: Partial<ProjectData['files']>
) => void;

type UpdateSummary = (
  updates: Partial<ProjectData['summary']>
) => void;

type AddRoom = (room: ProjectData['formData']['spaces']['rooms'][0]) => void;
type UpdateRoom = (room: ProjectData['formData']['spaces']['rooms'][0]) => void;
type DeleteRoom = (id: string) => void;

type AddProfessional = (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
type UpdateProfessional = (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
type DeleteProfessional = (id: string) => void;

type SetCurrentSection = (section: SectionKey) => void;

interface DesignBriefContextType {
  projectData: ProjectData;
  updateProjectInfo: UpdateProjectInfo;
  updateBudget: UpdateBudget;
  updateLifestyle: UpdateLifestyle;
  updateSite: UpdateSite;
  updateSpaces: UpdateSpaces;
  updateArchitecture: UpdateArchitecture;
  updateContractors: UpdateContractors;
  updateCommunication: UpdateCommunication;
  updateFiles: UpdateFiles;
  updateSummary: UpdateSummary;
  addRoom: AddRoom;
  updateRoom: UpdateRoom;
  deleteRoom: DeleteRoom;
  addProfessional: AddProfessional;
  updateProfessional: UpdateProfessional;
  deleteProfessional: DeleteProfessional;
  currentSection: SectionKey;
  setCurrentSection: SetCurrentSection;
  saveProjectData: () => void;
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

  const updateProjectInfo = useCallback((updates: Partial<ProjectData['formData']['projectInfo']>) => {
    setProjectData(draft => {
      draft.formData.projectInfo = { ...draft.formData.projectInfo, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateBudget = useCallback((updates: Partial<ProjectData['formData']['budget']>) => {
    setProjectData(draft => {
      draft.formData.budget = { ...draft.formData.budget, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateLifestyle = useCallback((updates: Partial<ProjectData['formData']['lifestyle']>) => {
    setProjectData(draft => {
      draft.formData.lifestyle = { ...draft.formData.lifestyle, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateSite = useCallback((updates: Partial<ProjectData['formData']['site']>) => {
    setProjectData(draft => {
      draft.formData.site = { ...draft.formData.site, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateSpaces = useCallback((updates: Partial<ProjectData['formData']['spaces']>) => {
    setProjectData(draft => {
      draft.formData.spaces = { ...draft.formData.spaces, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateArchitecture = useCallback((updates: Partial<ProjectData['formData']['architecture']>) => {
    setProjectData(draft => {
      draft.formData.architecture = { ...draft.formData.architecture, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateContractors = useCallback((updates: Partial<ProjectData['formData']['contractors']>) => {
    setProjectData(draft => {
      draft.formData.contractors = { ...draft.formData.contractors, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateCommunication = useCallback((updates: {
        preferredMethods?: string[];
        bestTimes?: string[];
        availableDays?: string[];
        frequency?: string;
        urgentContact?: string;
        responseTime?: string;
        additionalNotes?: string;
    }) => {
    setProjectData(draft => {
      updateCommunicationPreferences(draft, updates);
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateFiles = useCallback((updates: Partial<ProjectData['files']>) => {
    setProjectData(draft => {
      draft.files = { ...draft.files, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateSummary = useCallback((updates: Partial<ProjectData['summary']>) => {
    setProjectData(draft => {
      draft.summary = { ...draft.summary, ...updates };
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const addRoom = useCallback((room: ProjectData['formData']['spaces']['rooms'][0]) => {
    setProjectData(draft => {
      draft.formData.spaces.rooms.push(room);
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateRoom = useCallback((room: ProjectData['formData']['spaces']['rooms'][0]) => {
    setProjectData(draft => {
      const roomIndex = draft.formData.spaces.rooms.findIndex(r => r.id === room.id);
      if (roomIndex !== -1) {
        draft.formData.spaces.rooms[roomIndex] = room;
      }
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setProjectData(draft => {
      draft.formData.spaces.rooms = draft.formData.spaces.rooms.filter(room => room.id !== id);
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const addProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      draft.formData.contractors.professionals.push(professional);
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const updateProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const professionalIndex = draft.formData.contractors.professionals.findIndex(p => p.id === professional.id);
      if (professionalIndex !== -1) {
        draft.formData.contractors.professionals[professionalIndex] = professional;
      }
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const deleteProfessional = useCallback((id: string) => {
    setProjectData(draft => {
      draft.formData.contractors.professionals = draft.formData.contractors.professionals.filter(professional => professional.id !== id);
      draft.lastSaved = new Date().toISOString();
      return { ...draft };
    });
  }, []);

  const saveProjectData = useCallback(() => {
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [projectData]);

  const value: DesignBriefContextType = {
    projectData,
    updateProjectInfo,
    updateBudget,
    updateLifestyle,
    updateSite,
    updateSpaces,
    updateArchitecture,
    updateContractors,
    updateCommunication,
    updateFiles,
    updateSummary,
    addRoom,
    updateRoom,
    deleteRoom,
    addProfessional,
    updateProfessional,
    deleteProfessional,
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
