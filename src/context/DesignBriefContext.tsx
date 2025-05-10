import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, SectionKey } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';
import { briefService } from '@/lib/supabase/services/briefService';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ 
  children: React.ReactNode;
  briefId?: string; // Optional prop to load a specific brief
}> = ({ children, briefId }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [currentBriefId, setCurrentBriefId] = useState<string | null>(briefId || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load project data if briefId is provided
  useEffect(() => {
    if (briefId) {
      loadProjectData(briefId);
    }
  }, [briefId]);

  const updateFormData: DesignBriefContextType['updateFormData'] = useCallback((section, updates) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData = {
        ...updatedDraft.formData,
        [section]: { 
          ...updatedDraft.formData[section], 
          ...updates 
        }
      };
      return updatedDraft;
    });
  }, []);

  const { addRoom, updateRoom, removeRoom } = useRoomsManagement(projectData, setProjectData);
  const { addProfessional, updateProfessional, removeProfessional } = useProfessionalsManagement(projectData, setProjectData);
  
  const { updateFiles } = useFileAndSummaryManagement(projectData, setProjectData);

  // Load project data from Supabase
  const loadProjectData = async (briefId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await briefService.getBriefById(briefId);
      
      if (error) {
        console.error('Error loading brief:', error);
        setError('Failed to load brief data');
        setIsLoading(false);
        return false;
      }
      
      if (data) {
        // Update project data with data from the brief
        setProjectData(prevData => ({
          ...prevData,
          formData: data, // BriefDataType is FormData
          lastSaved: new Date().toISOString()
        }));
        
        setCurrentBriefId(briefId);
        setIsLoading(false);
        return true;
      } else {
        setError('Brief not found');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Error in loadProjectData:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      return false;
    }
  };

  // Save project data to Supabase
  const saveProjectData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentBriefId) {
        // Update existing brief
        const { error } = await briefService.updateBriefData(currentBriefId, projectData.formData);
        
        if (error) {
          console.error('Error saving brief:', error);
          setError('Failed to save brief data');
          setIsLoading(false);
          return { success: false, error };
        }

        setIsLoading(false);
        return { success: true, projectId: currentBriefId, projectData };
      } else {
        // Create new brief
        const title = projectData.formData.projectInfo.clientName || 'Untitled Brief';
        const { id, error } = await briefService.createBrief(title);
        
        if (error || !id) {
          console.error('Error creating brief:', error);
          setError('Failed to create new brief');
          setIsLoading(false);
          return { success: false, error };
        }
        
        // Now update the brief with the form data
        const updateResult = await briefService.updateBriefData(id, projectData.formData);
        
        if (updateResult.error) {
          console.error('Error updating new brief:', updateResult.error);
          setError('Failed to save brief data');
          setIsLoading(false);
          return { success: false, error: updateResult.error };
        }
        
        setCurrentBriefId(id);
        setIsLoading(false);
        return { success: true, projectId: id, projectData };
      }
    } catch (err) {
      console.error('Error in saveProjectData:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      return { success: false, error: err };
    }
  };

  const value: DesignBriefContextType = {
    projectData,
    formData: projectData.formData,
    files: projectData.files,
    currentBriefId,
    updateFormData,
    updateFiles,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional,
    currentSection,
    setCurrentSection,
    saveProjectData,
    loadProjectData,
    exportAsPDF: async () => { 
      console.warn('exportAsPDF called but is no-op in client-only mode');
      return new Blob();
    },
    sendByEmail: async () => { 
      console.warn('sendByEmail called but is no-op in client-only mode');
      return false;
    },
    isLoading,
    error,
    isNewProject: !currentBriefId,
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

// Function to set the force creation flag - call this before redirecting to design-brief
export const setForceProjectCreation = () => {
  sessionStorage.setItem('force_project_creation', 'true');
};

const FORCE_CREATION_KEY = 'force_project_creation';
