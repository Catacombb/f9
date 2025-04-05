
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';
import { formatOccupants } from '../helpers';

export const renderLifestyleInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Lifestyle Information');
  
  if (projectData.formData.lifestyle.occupants) {
    const formattedOccupants = formatOccupants(projectData.formData.lifestyle.occupants);
    addText(ctx, 'Occupants', formattedOccupants);
  }
  
  if (projectData.formData.lifestyle.occupationDetails) {
    addText(ctx, 'Occupation Details', '');
    addMultiLineText(ctx, projectData.formData.lifestyle.occupationDetails);
  }
  
  if (projectData.formData.lifestyle.dailyRoutine) {
    addText(ctx, 'Daily Routine', '');
    addMultiLineText(ctx, projectData.formData.lifestyle.dailyRoutine);
  }
  
  if (projectData.formData.lifestyle.entertainmentStyle) {
    addText(ctx, 'Entertainment Style', '');
    addMultiLineText(ctx, projectData.formData.lifestyle.entertainmentStyle);
  }
  
  if (projectData.formData.lifestyle.specialRequirements) {
    addText(ctx, 'Special Requirements', '');
    addMultiLineText(ctx, projectData.formData.lifestyle.specialRequirements);
  }
  
  addSpace(ctx, 8);
};
