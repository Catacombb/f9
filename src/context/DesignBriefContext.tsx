import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, SectionKey } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';
import { useSupabase } from '@/hooks/useSupabase';
import { loadProject } from '@/lib/supabase/services/projectService';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default empty state
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get authentication from useSupabase hook
  const { user, session } = useSupabase();

  // Load project data when user authenticates
  useEffect(() => {
    async function fetchProjectData() {
      if (!user) {
        // No authenticated user, use empty state
        return;
      }

      // Check if there's a current project id stored
      // This can be enhanced with navigation/URL parameters later
      try {
        setIsLoading(true);
        setError(null);

        // In a more complete implementation, we would query for the user's projects
        // and select the most recent one, or use URL params to determine which
        // project to load. For now, this is a placeholder.
        
        // Get the current project ID (this could come from URL or elsewhere)
        const currentProjectId = projectData.projectId;

        if (currentProjectId) {
          const result = await loadProject(currentProjectId);
          
          if (result.success && result.projectData) {
            setProjectData(result.projectData);
          } else if (result.error) {
            console.error('Error loading project:', result.error);
            setError('Failed to load project data');
          }
        }
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('An unexpected error occurred while loading project data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [user, session]); // Re-fetch when user or session changes

  // Form data update functions
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
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  // Room management hooks
  const { addRoom, updateRoom, removeRoom } = useRoomsManagement(projectData, setProjectData);
  
  // Professional management hooks
  const { addProfessional, updateProfessional, removeProfessional } = useProfessionalsManagement(projectData, setProjectData);
  
  // File and summary management hooks
  const { updateFiles, updateSummary, saveProjectData, exportAsPDF, sendByEmail } = useFileAndSummaryManagement(projectData, setProjectData);

  // Auto-save to Supabase when data changes
  useEffect(() => {
    // Skip auto-save if not authenticated or if this is initial load
    if (!user || isLoading) return;
    
    // Use a debounce to avoid too many saves
    const timer = setTimeout(() => {
      saveProjectData().catch(err => {
        console.error('Auto-save failed:', err);
      });
    }, 2000); // 2 second debounce
    
    return () => clearTimeout(timer);
  }, [projectData, user, isLoading, saveProjectData]);

  const value: DesignBriefContextType = {
    projectData,
    formData: projectData.formData,
    files: projectData.files,
    summary: projectData.summary,
    updateFormData,
    updateFiles,
    updateSummary,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional,
    currentSection,
    setCurrentSection,
    saveProjectData,
    exportAsPDF,
    isLoading,
    error,
    sendByEmail
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
