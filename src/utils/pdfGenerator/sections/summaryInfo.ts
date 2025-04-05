
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addMultiLineText } from '../layout';

export const renderSummaryInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  if (!projectData.summary.editedSummary) {
    return;
  }
  
  addSectionTitle(ctx, 'Project Summary');
  // Apply formatting to the summary text
  addMultiLineText(ctx, projectData.summary.editedSummary);
  
  // Add architect information if available
  if (projectData.formData.contractors.professionals) {
    const architect = projectData.formData.contractors.professionals.find(
      prof => prof.type === 'Architect'
    );
    
    if (architect) {
      ctx.yPosition += 5;
      addSectionTitle(ctx, 'Architect Information');
      addMultiLineText(ctx, `Name: ${architect.name || 'Not specified'}`);
      addMultiLineText(ctx, `Contact: ${architect.contact || 'Not specified'}`);
      if (architect.notes) {
        addMultiLineText(ctx, `Notes: ${architect.notes}`);
      }
    }
  }
};
