
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';

export const renderSiteInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Site Information');
  
  // First check if we have the combined field
  if (projectData.formData.site.siteFeaturesAndViews) {
    addText(ctx, 'Site Features & Views', '');
    addMultiLineText(ctx, projectData.formData.site.siteFeaturesAndViews);
  } else {
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
  }
  
  if (projectData.formData.site.accessConstraints) {
    addText(ctx, 'Access Constraints', '');
    addMultiLineText(ctx, projectData.formData.site.accessConstraints);
  }
  
  if (projectData.formData.site.neighboringProperties) {
    addText(ctx, 'Neighboring Properties', '');
    addMultiLineText(ctx, projectData.formData.site.neighboringProperties);
  }
  
  if (projectData.formData.site.siteNotes) {
    addText(ctx, 'Additional Site Notes', '');
    addMultiLineText(ctx, projectData.formData.site.siteNotes);
  }
  
  // Add site documents information
  if (projectData.files.siteDocuments && projectData.files.siteDocuments.length > 0) {
    addText(ctx, 'Site Documents', '');
    ctx.pdf.setFontSize(10);
    ctx.pdf.setTextColor(ctx.colors.secondary);
    
    projectData.files.siteDocuments.forEach((file) => {
      addText(ctx, '', `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, true);
    });
  }
  
  addSpace(ctx, 8);
};
