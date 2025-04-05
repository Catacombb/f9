
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addBulletPoints, addSpace } from '../layout';

export const renderContractorsInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Project Team');
  
  addText(ctx, 'Preferred Builder', projectData.formData.contractors.preferredBuilder || 'Not specified');
  addText(ctx, 'Go To Tender', projectData.formData.contractors.goToTender ? 'Yes' : 'No');
  
  if (projectData.formData.contractors.professionals.length > 0) {
    addSpace(ctx);
    addText(ctx, 'Professionals', '');
    addSpace(ctx, 2);
    
    // Group professionals by type
    const professionalsByType = new Map();
    projectData.formData.contractors.professionals.forEach(professional => {
      if (!professionalsByType.has(professional.type)) {
        professionalsByType.set(professional.type, []);
      }
      professionalsByType.get(professional.type).push(professional);
    });
    
    // Format as a bullet list
    const professionalsList: string[] = [];
    professionalsByType.forEach((professionals, type) => {
      professionals.forEach(professional => {
        let profInfo = `${type}: ${professional.name}`;
        if (professional.contact) profInfo += `, ${professional.contact}`;
        if (professional.notes) profInfo += ` - ${professional.notes}`;
        professionalsList.push(profInfo);
      });
    });
    
    addBulletPoints(ctx, professionalsList);
  }
  
  if (projectData.formData.contractors.additionalNotes) {
    addSpace(ctx);
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.contractors.additionalNotes);
  }
  
  addSpace(ctx, 8);
};
