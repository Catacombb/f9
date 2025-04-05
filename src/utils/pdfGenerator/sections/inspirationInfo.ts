
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addSpace } from '../layout';

export const renderInspirationInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  if (!projectData.files.inspirationSelections || projectData.files.inspirationSelections.length === 0) {
    return;
  }
  
  addSectionTitle(ctx, 'Inspiration Gallery');
  addText(ctx, 'Selected Inspiration Images', `${projectData.files.inspirationSelections.length} images selected`);
  // Note: actual images would be included in a real implementation
  // but that requires different handling outside of this PDF generation
  
  addSpace(ctx, 8);
};
