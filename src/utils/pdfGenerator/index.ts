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
    console.log('[PDF Generator] Starting PDF generation');
    
    // Create a new PDF document in portrait mode, using mm units
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // margin in mm
    const textColor = '#000000'; // Black text for readability
    const accentColor = '#f8b500'; // F9 Yellow accent color
    const primaryColor = '#333333'; // Dark gray for headings
    const borderColor = '#e0e0e0'; // Light gray for borders
    
    // Add header with F9 branding
    // Add a yellow header bar
    pdf.setFillColor(accentColor);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    // Add F9 logo text
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.setFontSize(18);
    pdf.text('F9 PRODUCTIONS', margin, 15);
    
    // Add document title
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor);
    pdf.setFontSize(20);
    pdf.text('DESIGN BRIEF', pageWidth - margin - 50, 15);
    
    // Add a divider line
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 35, pageWidth - margin, 35);
    
    // Add brief info section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(primaryColor);
    pdf.text(`Project: ${projectData.formData.projectInfo?.clientName || 'Untitled Project'}`, margin, 45);
    
    // Add client info box
    pdf.setDrawColor(borderColor);
    pdf.setLineWidth(0.2);
    pdf.setFillColor('#f5f5f5'); // Light gray background
    pdf.roundedRect(margin, 55, pageWidth - (margin * 2), 40, 3, 3, 'FD'); // Filled rectangle with rounded corners
    
    // Client details
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(textColor);
    pdf.setFontSize(12);
    let y = 65;
    
    if (projectData.formData.projectInfo) {
      // Two column layout for client info
      const leftColumn = margin + 5;
      const rightColumn = pageWidth / 2 + 5;
      
      // Left column
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client:', leftColumn, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectData.formData.projectInfo.clientName || 'Not specified', leftColumn + 25, y);
      y += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Address:', leftColumn, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectData.formData.projectInfo.projectAddress || 'Not specified', leftColumn + 25, y);
      
      // Right column
      y = 65; // Reset y for right column
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Email:', rightColumn, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectData.formData.projectInfo.contactEmail || 'Not specified', rightColumn + 25, y);
      y += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', rightColumn, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectData.formData.projectInfo.contactPhone || 'Not specified', rightColumn + 25, y);
    }
    
    // Add project details section
    y = 110;
    
    // Add section heading
    pdf.setFillColor(accentColor);
    pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.setFontSize(12);
    pdf.text('PROJECT DETAILS', margin + 5, y + 5.5);
    y += 15;
    
    // Project details content
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(textColor);
    pdf.setFontSize(11);
    
    if (projectData.formData.projectInfo?.projectDescription) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Description:', margin, y);
      y += 7;
      pdf.setFont('helvetica', 'normal');
      
      // Handle multiline text
      const description = projectData.formData.projectInfo.projectDescription;
      const splitDescription = pdf.splitTextToSize(description, pageWidth - (margin * 2) - 10);
      
      pdf.text(splitDescription, margin + 5, y);
      y += splitDescription.length * 6 + 5;
    }
    
    // Add budget information if available
    if (projectData.formData.budget?.budgetRange) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Budget Range:', margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectData.formData.budget.budgetRange, margin + 40, y);
      y += 7;
    }
    
    // Add site information if available
    if (projectData.formData.site) {
      y += 5;
      // Add section heading
      pdf.setFillColor(accentColor);
      pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor);
      pdf.setFontSize(12);
      pdf.text('SITE INFORMATION', margin + 5, y + 5.5);
      y += 15;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textColor);
      pdf.setFontSize(11);
      
      if (projectData.formData.site.siteFeatures && Array.isArray(projectData.formData.site.siteFeatures)) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Site Features:', margin, y);
        y += 7;
        pdf.setFont('helvetica', 'normal');
        
        const features = projectData.formData.site.siteFeatures.join(', ');
        const splitFeatures = pdf.splitTextToSize(features, pageWidth - (margin * 2) - 10);
        
        pdf.text(splitFeatures, margin + 5, y);
        y += splitFeatures.length * 6 + 5;
      }
    }
    
    // Add spaces information if available
    if (projectData.formData.spaces && projectData.formData.spaces.rooms) {
      y += 5;
      // Add section heading
      pdf.setFillColor(accentColor);
      pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor);
      pdf.setFontSize(12);
      pdf.text('SPACES', margin + 5, y + 5.5);
      y += 15;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textColor);
      pdf.setFontSize(11);
      
      // Count rooms by type
      const roomTypes = {};
      projectData.formData.spaces.rooms.forEach(room => {
        const type = room.type;
        roomTypes[type] = (roomTypes[type] || 0) + 1;
      });
      
      // Display room counts
      pdf.setFont('helvetica', 'bold');
      pdf.text('Room Summary:', margin, y);
      y += 7;
      
      pdf.setFont('helvetica', 'normal');
      Object.entries(roomTypes).forEach(([type, count]) => {
        pdf.text(`${type}: ${count}`, margin + 5, y);
        y += 6;
      });
    }
    
    // Add footer
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(primaryColor);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
    pdf.text('F9 Productions, Inc.', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text('Page 1', pageWidth - margin, pageHeight - 10, { align: 'right' });
    
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
