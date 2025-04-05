
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';
import { formatCodedValue } from '../helpers';

export const renderCommunicationInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Communication Preferences');
  
  if (projectData.formData.communication.preferredMethods && projectData.formData.communication.preferredMethods.length > 0) {
    addText(ctx, 'Preferred Methods', projectData.formData.communication.preferredMethods.join(', '));
  }
  
  if (projectData.formData.communication.bestTimes && projectData.formData.communication.bestTimes.length > 0) {
    addText(ctx, 'Best Times', projectData.formData.communication.bestTimes.join(', '));
  }
  
  if (projectData.formData.communication.availableDays && projectData.formData.communication.availableDays.length > 0) {
    addText(ctx, 'Available Days', projectData.formData.communication.availableDays.join(', '));
  }
  
  if (projectData.formData.communication.frequency) {
    addText(ctx, 'Update Frequency', projectData.formData.communication.frequency);
  }
  
  if (projectData.formData.communication.urgentContact) {
    addText(ctx, 'Urgent Contact', projectData.formData.communication.urgentContact);
  }
  
  const responseTimeMappings = {
    'same_day': 'Same Day',
    '24_hours': 'Within 24 Hours',
    '48_hours': 'Within 48 Hours',
    'week': 'Within a Week'
  };
  
  if (projectData.formData.communication.responseTime) {
    const responseTime = formatCodedValue(
      projectData.formData.communication.responseTime,
      responseTimeMappings
    );
    
    addText(ctx, 'Expected Response Time', responseTime);
  }
  
  if (projectData.formData.communication.additionalNotes) {
    addSpace(ctx);
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.communication.additionalNotes);
  }
  
  addSpace(ctx, 8);
};
