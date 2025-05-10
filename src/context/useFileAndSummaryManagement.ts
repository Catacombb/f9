import { useCallback } from 'react';
import { ProjectData } from '@/types';

export const useFileAndSummaryManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const updateFiles = useCallback((updates: Partial<ProjectData['files']>) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.files = {
        ...updatedDraft.files,
        ...updates
      };
      return updatedDraft;
    });
  }, [setProjectData]);

  return { 
    updateFiles, 
  };
};
