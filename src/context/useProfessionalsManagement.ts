import { useCallback } from 'react';
import { ProjectData, Professional } from '@/types';

// Simple random ID generator function compatible with all browsers
const generateUniqueId = () => {
  return 'prof-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useProfessionalsManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const addProfessional = useCallback((professional: Omit<Professional, 'id'> & { id?: string }) => {
    setProjectData(draft => {
      const newProfessional = {
        ...professional,
        id: professional.id || generateUniqueId(),
      };
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals = [
        ...updatedDraft.formData.contractors.professionals,
        newProfessional,
      ];
      return updatedDraft;
    });
  }, [setProjectData]);

  const updateProfessional = useCallback((updatedProfessional: Professional) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const professionalIndex = updatedDraft.formData.contractors.professionals.findIndex(p => p.id === updatedProfessional.id);
      if (professionalIndex !== -1) {
        updatedDraft.formData.contractors.professionals[professionalIndex] = updatedProfessional;
      }
      return updatedDraft;
    });
  }, [setProjectData]);

  const removeProfessional = useCallback((professionalId: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals = 
        updatedDraft.formData.contractors.professionals.filter(p => p.id !== professionalId);
      return updatedDraft;
    });
  }, [setProjectData]);

  return { addProfessional, updateProfessional, removeProfessional };
};
