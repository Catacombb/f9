
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addSpace } from '../layout';

export const renderInspirationInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  if (!projectData.files.inspirationSelections || projectData.files.inspirationSelections.length === 0) {
    return;
  }
  
  addSectionTitle(ctx, 'Inspiration Gallery');
  
  // Display information about selected inspiration images
  addText(ctx, 'Selected Inspiration Images', `${projectData.files.inspirationSelections.length} images selected for design reference`);
  
  // Note about inspiration images
  addText(ctx, '', 'These images were selected to convey the desired aesthetic, architectural style, and design elements.');
  
  // List image descriptions if available (this would be enhanced with actual image thumbnails in a real PDF)
  if (projectData.files.inspirationSelections.length > 0) {
    ctx.pdf.setFontSize(10);
    ctx.pdf.setTextColor(ctx.colors.secondary);
    
    projectData.files.inspirationSelections.forEach((id, index) => {
      const imgNum = index + 1;
      addText(ctx, '', `Image ${imgNum}: Reference image for design inspiration`, true);
    });
  }
  
  // Add space after the section
  addSpace(ctx, 8);
};
