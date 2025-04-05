
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';
import { formatCodedValue } from '../helpers';

export const renderBudgetInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Budget Information');
  
  const budgetRangeMappings = {
    '250k_500k': '$250,000 - $500,000',
    '500k_750k': '$500,000 - $750,000',
    '750k_1m': '$750,000 - $1,000,000',
    '1m_1.5m': '$1,000,000 - $1,500,000',
    '1.5m_2m': '$1,500,000 - $2,000,000',
    'above_2m': 'Above $2,000,000',
    'tbd': 'To be determined'
  };
  
  const budgetRange = formatCodedValue(
    projectData.formData.budget.budgetRange, 
    budgetRangeMappings
  );
  
  addText(ctx, 'Budget Range', budgetRange);
  
  if (projectData.formData.budget.flexibilityNotes) {
    addText(ctx, 'Budget Flexibility', '');
    addMultiLineText(ctx, projectData.formData.budget.flexibilityNotes);
  }
  
  if (projectData.formData.budget.priorityAreas) {
    addText(ctx, 'Priority Areas', '');
    addMultiLineText(ctx, projectData.formData.budget.priorityAreas);
  }
  
  const timeframeMappings = {
    'flexible': 'Flexible / No specific timeline',
    'under_6months': 'Less than 6 months',
    '6months_1year': '6 months to 1 year',
    '1year_2years': '1-2 years',
    'over_2years': 'More than 2 years'
  };
  
  const timeframe = formatCodedValue(
    projectData.formData.budget.timeframe,
    timeframeMappings
  );
  
  addText(ctx, 'Project Timeframe', timeframe);
  
  addSpace(ctx, 8);
};
