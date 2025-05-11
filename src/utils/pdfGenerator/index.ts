import { jsPDF } from 'jspdf';
import { formatDistanceToNow } from 'date-fns';
import { ProjectData } from '@/types';
import { PDFContext, COLORS } from './types';
import { addHeader, addFooter, addNewPage } from './layout';

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
    console.log('[PDF Generator] Starting PDF generation');
    
    // Create a new PDF document in portrait mode, using mm units
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // margin in mm
    
    // PDF context to share across section renderers
    const ctx: PDFContext = {
      pdf,
      pageWidth,
      pageHeight,
      margin,
      contentWidth: pageWidth - (margin * 2),
      yPosition: 40, // Start position after header
      pageNumber: 1,
      colors: {
        primary: '#333333',     // Dark gray for headings
        secondary: '#666666',   // Medium gray for secondary text
        accent: '#f8b500',      // F9 Yellow accent color
        border: '#e0e0e0',      // Light gray for borders
        background: '#ffffff',  // White background
        muted: '#f5f5f5'        // Light gray for backgrounds
      }
    };
    
    // Add header with F9 branding
    // Add a yellow header bar
    pdf.setFillColor(ctx.colors.accent);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    // Add F9 logo text - centered
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(ctx.colors.primary);
    pdf.setFontSize(22);
    const mainTitle = 'F9 PRODUCTIONS';
    const mainTitleWidth = pdf.getTextWidth(mainTitle);
    pdf.text(mainTitle, (pageWidth - mainTitleWidth) / 2, 15);
    
    // Add "DESIGN BRIEF" subtitle under the main title in italics
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(14);
    const subtitle = 'DESIGN BRIEF';
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 23);
    
    // Add a divider line
    pdf.setDrawColor(ctx.colors.accent);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 35, pageWidth - margin, 35);
    
    // Add client info box with better spacing
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(ctx.colors.primary);
    pdf.text(`Project: ${projectData.formData.projectInfo?.clientName || 'Untitled Project'}`, margin, ctx.yPosition);
    ctx.yPosition += 10;
    
    // Render all sections using the imported renderers
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(ctx.colors.primary);
    pdf.setFontSize(12);

    // --- Render Project Information ---
    renderProjectInfo(ctx, projectData);
    
    // --- Render Budget Information ---
    renderBudgetInfo(ctx, projectData);
    
    // --- Render Lifestyle Information ---
    renderLifestyleInfo(ctx, projectData);
    
    // --- Render Site Information ---
    renderSiteInfo(ctx, projectData);
    
    // --- Render Spaces Information ---
    renderSpacesInfo(ctx, projectData);
    
    // --- Render Architecture Information ---
    renderArchitectureInfo(ctx, projectData);
    
    // --- Render Contractors Information ---
    renderContractorsInfo(ctx, projectData);
    
    // --- Render Communication Information ---
    renderCommunicationInfo(ctx, projectData);
    
    // --- Render Inspiration Information ---
    renderInspirationInfo(ctx, projectData);
    
    // --- Render Summary Information ---
    // Call renderSummaryInfo directly - it has its own internal checks
    renderSummaryInfo(ctx, projectData);
    
    // Add footer to all pages
    for (let i = 1; i <= ctx.pageNumber; i++) {
      pdf.setPage(i);
      
      // Add a more elegant footer
      pdf.setDrawColor(ctx.colors.accent);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(ctx.colors.primary);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
      pdf.text('F9 Productions, Inc.', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(`Page ${i} of ${ctx.pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }
    
    console.log('[PDF Generator] PDF generation complete');
    
    // Return as blob for download
    return pdf.output('blob');
  } catch (error) {
    console.error('[PDF Generator] Error generating PDF:', error);
    
    // Create a simple error PDF
    const errorPdf = new jsPDF();
    errorPdf.text('Error generating PDF. Please try again.', 10, 10);
    return errorPdf.output('blob');
  }
};
