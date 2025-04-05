
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';

export const renderProjectInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Project Information');
  
  addText(ctx, 'Client Name', projectData.formData.projectInfo.clientName || 'Not specified');
  addText(ctx, 'Project Address', projectData.formData.projectInfo.projectAddress || 'Not specified');
  addText(ctx, 'Contact Email', projectData.formData.projectInfo.contactEmail || 'Not specified');
  addText(ctx, 'Contact Phone', projectData.formData.projectInfo.contactPhone || 'Not specified');
  
  let projectType = 'Not specified';
  if (projectData.formData.projectInfo.projectType) {
    // Format project type (convert new_build to "New Build")
    projectType = projectData.formData.projectInfo.projectType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  addText(ctx, 'Project Type', projectType);
  
  if (projectData.formData.projectInfo.projectDescription) {
    addSpace(ctx);
    addText(ctx, 'Project Description', '');
    addMultiLineText(ctx, projectData.formData.projectInfo.projectDescription);
  }
  
  addSpace(ctx, 8);
};
