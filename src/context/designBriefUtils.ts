
import { ProjectData } from '@/types';

export const updateCommunicationPreferences = (
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
