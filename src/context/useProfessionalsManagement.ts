
import { useState, useCallback } from 'react';
import { ProjectData } from '@/types';

export const useProfessionalsManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const addProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals.push(professional);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

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
  }, [setProjectData]);

  const removeProfessional = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals = updatedDraft.formData.contractors.professionals.filter(p => p.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  return { addProfessional, updateProfessional, removeProfessional };
};
