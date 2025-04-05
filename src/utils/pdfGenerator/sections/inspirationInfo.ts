
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addSpace } from '../layout';

export const renderInspirationInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  const hasInspirationSelections = projectData.files.inspirationSelections && 
                                  projectData.files.inspirationSelections.length > 0;
  const hasInspirationFiles = projectData.files.inspirationFiles && 
                             projectData.files.inspirationFiles.length > 0;
                             
  if (!hasInspirationSelections && !hasInspirationFiles) {
    return;
  }
  
  addSectionTitle(ctx, 'Inspiration Gallery');
  
  // Display information about selected inspiration images
  if (hasInspirationSelections) {
    addText(ctx, 'Selected Inspiration Images', `${projectData.files.inspirationSelections.length} images selected for design reference`);
    
    // Note about inspiration images
    addText(ctx, '', 'These images were selected to convey the desired aesthetic, architectural style, and design elements.');
    
    // List image descriptions if available
    ctx.pdf.setFontSize(10);
    ctx.pdf.setTextColor(ctx.colors.secondary);
    
    projectData.files.inspirationSelections.forEach((id, index) => {
      const imgNum = index + 1;
      addText(ctx, '', `Image ${imgNum}: Reference image for design inspiration`, true);
    });
  }
  
  // Display information about uploaded inspiration files
  if (hasInspirationFiles) {
    addText(ctx, 'Uploaded Inspiration Files', `${projectData.files.inspirationFiles.length} inspiration files uploaded`);
    
    ctx.pdf.setFontSize(10);
    ctx.pdf.setTextColor(ctx.colors.secondary);
    
    projectData.files.inspirationFiles.forEach((file, index) => {
      addText(ctx, '', `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, true);
    });
  }
  
  // Add space after the section
  addSpace(ctx, 8);
};
