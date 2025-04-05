
import { jsPDF } from 'jspdf';
import { formatDistanceToNow } from 'date-fns';
import { ProjectData } from '@/types';
import { PDFContext, COLORS } from './types';
import { addHeader, addFooter } from './layout';

// Import section renderers
import { renderProjectInfo } from './sections/projectInfo';
import { renderBudgetInfo } from './sections/budgetInfo';
import { renderLifestyleInfo } from './sections/lifestyleInfo';
import { renderSiteInfo } from './sections/siteInfo';
import { renderSpacesInfo } from './sections/spacesInfo';
import { renderArchitectureInfo } from './sections/architectureInfo';
import { renderContractorsInfo } from './sections/contractorsInfo';
import { renderCommunicationInfo } from './sections/communicationInfo';
import { renderInspirationInfo } from './sections/inspirationInfo';
import { renderSummaryInfo } from './sections/summaryInfo';

// Function to create a PDF from the project data
export const generatePDF = async (projectData: ProjectData): Promise<Blob> => {
  try {
    // Create a new PDF document in portrait mode, using mm units
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // margin in mm
    const contentWidth = pageWidth - (margin * 2);
    
    // Initialize context object
    const ctx: PDFContext = {
      pdf,
      pageWidth,
      pageHeight,
      margin,
      contentWidth,
      yPosition: margin,
      pageNumber: 1,
      colors: COLORS
    };
    
    // Set font to Helvetica (closest to sans-serif web fonts)
    pdf.setFont('helvetica');
    
    // Start building the PDF
    // Add header to first page
    addHeader(ctx);
    
    // Add footer to first page
    addFooter(ctx);
    
    // Project title
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(ctx.colors.primary);
    pdf.setFontSize(20);
    const projectTitle = `Design Brief: ${projectData.formData.projectInfo.clientName || 'New Project'}`;
    pdf.text(projectTitle, margin, ctx.yPosition);
    ctx.yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(ctx.colors.secondary);
    pdf.text(`Project Address: ${projectData.formData.projectInfo.projectAddress || 'Not specified'}`, margin, ctx.yPosition);
    ctx.yPosition += 6;
    
    // Add generated date
    pdf.text(`Last updated: ${formatDistanceToNow(new Date(projectData.lastSaved || Date.now()), { addSuffix: true })}`, margin, ctx.yPosition);
    ctx.yPosition += 10;
    
    // Add horizontal line
    pdf.setDrawColor(ctx.colors.border);
    pdf.setLineWidth(0.2);
    pdf.line(margin, ctx.yPosition, pageWidth - margin, ctx.yPosition);
    ctx.yPosition += 10;
    
    // Render all sections sequentially
    renderProjectInfo(ctx, projectData);
    renderBudgetInfo(ctx, projectData);
    renderLifestyleInfo(ctx, projectData);
    renderSiteInfo(ctx, projectData);
    renderSpacesInfo(ctx, projectData);
    renderArchitectureInfo(ctx, projectData);
    renderContractorsInfo(ctx, projectData);
    renderCommunicationInfo(ctx, projectData);
    renderInspirationInfo(ctx, projectData);
    renderSummaryInfo(ctx, projectData);
    
    // Return the PDF as a Blob for download or sending via email
    // Explicitly return a Blob
    return pdf.output('blob');
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Return a simple error PDF as fallback
    const errorPdf = new jsPDF();
    errorPdf.text("Error generating PDF. Please try again.", 10, 10);
    return errorPdf.output('blob');
  }
};
