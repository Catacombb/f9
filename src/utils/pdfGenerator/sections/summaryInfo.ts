
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
};
