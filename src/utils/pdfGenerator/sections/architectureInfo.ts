
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';

export const renderArchitectureInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Architecture Preferences');
  
  if (projectData.formData.architecture.stylePrefences) {
    addText(ctx, 'Style Preferences', '');
    addMultiLineText(ctx, projectData.formData.architecture.stylePrefences);
  }
  
  if (projectData.formData.architecture.externalMaterials) {
    addText(ctx, 'External Materials', '');
    addMultiLineText(ctx, projectData.formData.architecture.externalMaterials);
  }
  
  if (projectData.formData.architecture.internalFinishes) {
    addText(ctx, 'Internal Finishes', '');
    addMultiLineText(ctx, projectData.formData.architecture.internalFinishes);
  }
  
  if (projectData.formData.architecture.sustainabilityGoals) {
    addText(ctx, 'Sustainability Goals', '');
    addMultiLineText(ctx, projectData.formData.architecture.sustainabilityGoals);
  }
  
  if (projectData.formData.architecture.specialFeatures) {
    addText(ctx, 'Special Features', '');
    addMultiLineText(ctx, projectData.formData.architecture.specialFeatures);
  }
  
  // Render inspiration link entries if they exist
  if (projectData.formData.architecture.inspirationEntries && 
      projectData.formData.architecture.inspirationEntries.length > 0) {
    
    addText(ctx, 'Inspiration References', '');
    
    projectData.formData.architecture.inspirationEntries.forEach((entry, index) => {
      addText(ctx, `Reference ${index + 1}`, entry.link || '');
      if (entry.description) {
        addMultiLineText(ctx, entry.description);
      }
      addSpace(ctx, 2);
    });
  }
  
  addSpace(ctx, 8);
};
