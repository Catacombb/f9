import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, SectionKey, FormData as LocalFormData } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';
import { briefService } from '@/lib/supabase/services/briefService';
import { fileService, UploadedFile } from '@/lib/supabase/services/fileService';
import { useAutosave } from '@/hooks/useAutosave';
import { generatePDF } from '@/utils/pdfGenerator';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ 
  children: React.ReactNode;
  briefId?: string; // Optional prop to load a specific brief
}> = ({ children, briefId }) => {
  console.log('[DesignBriefProvider] Initializing. Prop briefId:', briefId);

  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [currentBriefId, setCurrentBriefId] = useState<string | null>(briefId || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});
  
  useAutosave(projectData.formData, {
    briefId: currentBriefId,
  });

  useEffect(() => {
    console.log('[DesignBriefProvider] isLoading state changed:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('[DesignBriefProvider] useEffect for loading based on prop briefId. Prop briefId:', briefId);
    if (briefId) {
      console.log('[DesignBriefProvider] briefId prop is present, calling loadProjectData.');
      loadProjectData(briefId);
      
      // Also load the files for this brief
      loadFilesForBrief(briefId).catch(err => {
        console.error('[DesignBriefProvider] Error loading files for brief:', err);
      });
    } else {
      console.log('[DesignBriefProvider] briefId prop is NOT present, resetting state for new brief.');
      setProjectData(initialProjectData); // Reset to initial state for a new brief
      setCurrentBriefId(null);           // Ensure no old briefId lingers
      setIsLoading(false);               // Explicitly ensure loading is false for a new brief
      setError(null);                    // Clear any previous errors
      setUploadedFiles({});              // Clear uploaded files state
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
    console.log('[DesignBriefProvider] loadProjectData called for briefId:', briefId);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: briefFullData, error: fetchError } = await briefService.getBriefById(briefId);
      
      if (fetchError) {
        console.error('Error loading brief:', fetchError);
        setError('Failed to load brief data');
        setIsLoading(false);
        return false;
      }
      
      if (briefFullData && briefFullData.data) {
        // Assuming briefFullData.data (which is Json) is structurally compatible with LocalFormData
        const loadedFormData = briefFullData.data as unknown as LocalFormData;

        setProjectData(prevData => {
          // Create a new object for projectData to ensure no stale references from prevData.formData
          const newProjectData: ProjectData = {
            ...prevData,
            formData: loadedFormData, // Assign the loaded and casted form data
            lastSaved: new Date().toISOString(),
            projectId: briefFullData.id,
            // Ensure other fields of ProjectData are preserved or updated as needed
            files: prevData.files, // Preserve existing files state
            currentSection: prevData.currentSection, // Preserve currentSection
            version: prevData.version, // Preserve version
          };
          return newProjectData;
        });
        
        setCurrentBriefId(briefId);
        setIsLoading(false);
        console.log('[DesignBriefProvider] Brief data loaded successfully for:', briefId);
        return true;
      } else {
        setError('Brief not found or data field is missing');
        setIsLoading(false);
        console.log('[DesignBriefProvider] Brief not found or data field missing for:', briefId);
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

  // File management functions
  
  // Load all files for a brief
  const loadFilesForBrief = async (briefId: string) => {
    console.log('[DesignBriefProvider] loadFilesForBrief called for:', briefId);
    if (!briefId) return;
    
    try {
      setIsLoading(true);
      const { files, error } = await fileService.getFilesForBrief(briefId);
      
      if (error) {
        console.error('[DesignBriefProvider] Error loading files:', error);
        return;
      }
      
      // Group files by category
      const filesByCategory: Record<string, UploadedFile[]> = {};
      files.forEach(file => {
        if (!filesByCategory[file.category]) {
          filesByCategory[file.category] = [];
        }
        filesByCategory[file.category].push(file);
      });
      
      setUploadedFiles(filesByCategory);
      console.log('[DesignBriefProvider] Files loaded and grouped by category:', filesByCategory);
    } catch (err) {
      console.error('[DesignBriefProvider] Error in loadFilesForBrief:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Upload a file
  const uploadFile = async (category: string, file: File) => {
    console.log('[DesignBriefProvider] uploadFile called for category:', category);
    if (!currentBriefId) {
      console.error('[DesignBriefProvider] Cannot upload file without a current brief ID');
      return { success: false, error: new Error('No current brief ID') };
    }
    
    try {
      setIsLoading(true);
      const result = await fileService.uploadFile(currentBriefId, category, file);
      
      if (result.success && result.file) {
        // Update uploadedFiles state
        setUploadedFiles(prev => {
          const updated = { ...prev };
          if (!updated[category]) {
            updated[category] = [];
          }
          updated[category] = [...updated[category], result.file!];
          return updated;
        });
        
        console.log('[DesignBriefProvider] File uploaded successfully:', result.file);
      } else {
        console.error('[DesignBriefProvider] File upload failed:', result.error);
      }
      
      return result;
    } catch (err) {
      console.error('[DesignBriefProvider] Error in uploadFile:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a file
  const deleteFile = async (fileId: string) => {
    console.log('[DesignBriefProvider] deleteFile called for ID:', fileId);
    
    try {
      setIsLoading(true);
      const result = await fileService.deleteFile(fileId);
      
      if (result.success) {
        // Update uploadedFiles state by removing the deleted file
        setUploadedFiles(prev => {
          const updated = { ...prev };
          // Look through all categories
          Object.keys(updated).forEach(category => {
            updated[category] = updated[category].filter(file => file.id !== fileId);
          });
          return updated;
        });
        
        console.log('[DesignBriefProvider] File deleted successfully');
      } else {
        console.error('[DesignBriefProvider] File deletion failed:', result.error);
      }
      
      return result;
    } catch (err) {
      console.error('[DesignBriefProvider] Error in deleteFile:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
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
      try {
        console.log('[DesignBriefContext] Exporting PDF for project');
        // Make sure we have the latest data saved before generating PDF
        await saveProjectData();
        // Use the PDF generator utility to create the PDF
        return await generatePDF(projectData);
      } catch (error) {
        console.error('[DesignBriefContext] Error generating PDF:', error);
        throw error;
      }
    },
    sendByEmail: async () => { 
      console.warn('sendByEmail called but is no-op in client-only mode');
      return false;
    },
    isLoading,
    error,
    isNewProject: !currentBriefId,
    uploadFile,
    deleteFile,
    uploadedFiles,
    loadFilesForBrief
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

// Global flag to control new project creation if navigating to /design-brief directly without an ID
let forceProjectCreation = false;

export const getForceProjectCreation = () => forceProjectCreation;
export const setForceProjectCreation = () => { forceProjectCreation = true; };
export const clearForceProjectCreation = () => { forceProjectCreation = false; };
