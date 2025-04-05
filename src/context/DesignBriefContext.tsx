
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, SectionKey } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'design_brief_data';
const TEST_DATA_FLAG = 'is_test_data';

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>(() => {
    // Try to get saved data from localStorage
    try {
      // Check if the current page load is a refresh
      const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance.getEntriesByType('navigation').map((nav) => (nav as PerformanceNavigationTiming).type).includes('reload')
      );
      
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const isTestData = localStorage.getItem(TEST_DATA_FLAG);
      
      // If this is a page refresh AND the saved data was test data, don't use it
      if (pageAccessedByReload && isTestData === 'true') {
        console.log('Page refreshed - clearing test data');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(TEST_DATA_FLAG);
        return initialProjectData;
      }
      
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    return initialProjectData;
  });
  
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');

  // Auto-save to localStorage whenever projectData changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectData));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [projectData]);

  // Form data update functions
  const updateFormData: DesignBriefContextType['updateFormData'] = useCallback((section, updates) => {
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

  // Room management hooks
  const { addRoom, updateRoom, removeRoom } = useRoomsManagement(projectData, setProjectData);
  
  // Professional management hooks
  const { addProfessional, updateProfessional, removeProfessional } = useProfessionalsManagement(projectData, setProjectData);
  
  // File and summary management hooks
  const { updateFiles, updateSummary, saveProjectData, exportAsPDF } = useFileAndSummaryManagement(projectData, setProjectData);

  // Function to flag data as test data
  const markAsTestData = useCallback(() => {
    localStorage.setItem(TEST_DATA_FLAG, 'true');
  }, []);

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
    markAsTestData,
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
