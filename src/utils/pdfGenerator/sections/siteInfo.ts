
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';

export const renderSiteInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Site Information');
  
  if (projectData.formData.site.existingConditions) {
    addText(ctx, 'Existing Conditions', '');
    addMultiLineText(ctx, projectData.formData.site.existingConditions);
  }
  
  // Handle both string and string[] types for siteFeatures
  if (projectData.formData.site.siteFeatures) {
    addText(ctx, 'Site Features', '');
    
    // If siteFeatures is an array, convert to string first
    if (Array.isArray(projectData.formData.site.siteFeatures)) {
      // Format the array into a readable string
      const featuresString = projectData.formData.site.siteFeatures.join(', ');
      addMultiLineText(ctx, featuresString);
    } else {
      // It's already a string, pass directly
      addMultiLineText(ctx, projectData.formData.site.siteFeatures);
    }
  }
  
  if (projectData.formData.site.viewsOrientations) {
    addText(ctx, 'Views/Orientations', '');
    addMultiLineText(ctx, projectData.formData.site.viewsOrientations);
  }
  
  if (projectData.formData.site.accessConstraints) {
    addText(ctx, 'Access Constraints', '');
    addMultiLineText(ctx, projectData.formData.site.accessConstraints);
  }
  
  if (projectData.formData.site.neighboringProperties) {
    addText(ctx, 'Neighboring Properties', '');
    addMultiLineText(ctx, projectData.formData.site.neighboringProperties);
  }
  
  // Add site photos information
  if (projectData.files.sitePhotos && projectData.files.sitePhotos.length > 0) {
    addText(ctx, 'Site Photos', '');
    addMultiLineText(ctx, `${projectData.files.sitePhotos.length} photos uploaded`);
  }
  
  // Add site notes if available
  if (projectData.formData.site.siteNotes) {
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.site.siteNotes);
  }
  
  addSpace(ctx, 8);
};
