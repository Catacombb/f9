import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectData } from '@/types';
import { formatDistanceToNow } from 'date-fns';

// Northstar brand colors
const COLORS = {
  primary: '#333333',
  secondary: '#666666',
  accent: '#f8b500', // Yellow accent
  background: '#ffffff',
  muted: '#f5f5f5',
  border: '#e0e0e0',
};

// Function to create a PDF from the project data
export const generatePDF = async (projectData: ProjectData): Promise<void> => {
  // Create a new PDF document in portrait mode, using mm units
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15; // margin in mm
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  let pageNumber = 1;
  
  // Set font to Helvetica (closest to sans-serif web fonts)
  pdf.setFont('helvetica');
  
  // Helper function to add a new page
  const addNewPage = () => {
    pdf.addPage();
    pageNumber++;
    yPosition = margin;
    
    // Add header to new page
    addHeader();
    
    // Add footer to new page
    addFooter();
  };
  
  // Helper function to add header with centered logo
  const addHeader = () => {
    // Increased header height to accommodate logo properly
    const headerHeight = 30; // Increased from 25
    
    pdf.setFillColor(COLORS.background);
    pdf.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Get logo path - using the light mode logo
    const logoPath = '/lovable-uploads/f87cbd00-65a2-4b67-ae04-55a828581a0e.png';
    
    // Adjusted logo dimensions to preserve aspect ratio
    // Original logo aspect ratio is approximately 3.33:1 (width:height)
    const logoHeight = 15; // Increased from 12
    const logoWidth = logoHeight * 3.33; // Preserve aspect ratio
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 5; // Properly centered in the taller header
    
    try {
      // Add actual image with preserved aspect ratio
      pdf.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      // Fallback to text if image loading fails
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(COLORS.primary);
      pdf.setFontSize(18);
      pdf.text('NORTHSTAR', pageWidth / 2, 15, { align: 'center' });
      
      // Add the house icon in yellow
      pdf.setTextColor(COLORS.accent);
      pdf.setFontSize(14);
      pdf.text('⌂★', pageWidth / 2 + 25, 15);
      pdf.setTextColor(COLORS.primary);
    }
    
    // Add horizontal line - moved down to match new header height
    pdf.setDrawColor(COLORS.accent);
    pdf.setLineWidth(0.5);
    pdf.line(margin, headerHeight - 2, pageWidth - margin, headerHeight - 2);
    
    yPosition = headerHeight + 5; // Adjusted starting position after header
  };
  
  // Helper function to add footer with clickable link
  const addFooter = () => {
    const footerY = pageHeight - 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(COLORS.secondary);
    
    // Add page number
    pdf.text(`Page ${pageNumber}`, pageWidth - margin - 10, footerY);
    
    // Add generation date
    const dateText = `Generated ${formatDistanceToNow(new Date(), { addSuffix: true })}`;
    pdf.text(dateText, margin, footerY);
    
    // Add website with link
    const website = 'northstar.nickharrison.co';
    const websiteX = pageWidth / 2;
    
    // Calculate text width for link positioning
    const textWidth = pdf.getTextWidth(website);
    
    // Add clickable link
    pdf.setTextColor(COLORS.accent); // Make it look like a link
    pdf.text(website, websiteX, footerY, { align: 'center' });
    
    // Add link annotation
    pdf.link(
      websiteX - textWidth / 2, // x position
      footerY - 5, // y position (adjust for text height)
      textWidth, // width
      5, // height
      { url: 'http://northstar.nickharrison.co' }
    );
  };
  
  // Helper function to add a section title
  const addSectionTitle = (title: string) => {
    // Check if we need a new page - increased threshold to ensure enough space
    if (yPosition > pageHeight - 50) {
      addNewPage();
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(COLORS.accent); // Use accent color for section titles
    pdf.setFontSize(16); // Larger font size for better hierarchy
    
    // Add title without icon
    pdf.text(title, margin, yPosition);
    
    // Add a thin line below the title for visual separation
    pdf.setDrawColor(COLORS.border);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
    
    yPosition += 10; // Increased space after title
  };
  
  // Helper function to add text
  const addText = (label: string, value: string, isSmall = false) => {
    // Check if we need a new page - increased threshold to ensure enough space
    if (yPosition > pageHeight - 40) {
      addNewPage();
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(COLORS.primary);
    pdf.setFontSize(isSmall ? 10 : 11);
    pdf.text(`${label}:`, margin, yPosition);
    
    // Calculate where the value should start (after label)
    const labelWidth = pdf.getTextWidth(`${label}:`);
    const valueX = margin + labelWidth + 2;
    
    // Check if value will fit on current line
    const valueWidth = pdf.getTextWidth(value);
    const maxWidth = contentWidth - labelWidth - 2;
    
    if (valueWidth <= maxWidth) {
      // Value fits on same line
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(COLORS.secondary);
      pdf.text(value, valueX, yPosition);
      yPosition += isSmall ? 5 : 6;
    } else {
      // Value needs to be on next line and possibly wrapped
      yPosition += isSmall ? 5 : 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(COLORS.secondary);
      
      // Split text to handle wrapping
      const textLines = pdf.splitTextToSize(value, contentWidth);
      pdf.text(textLines, margin, yPosition);
      yPosition += (textLines.length * (isSmall ? 5 : 6)) + 2;
    }
  };
  
  // Helper function to add multiline text - improved to handle page breaks
  const addMultiLineText = (text: string) => {
    if (!text || text.trim() === '') return;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(COLORS.secondary);
    pdf.setFontSize(11);
    
    // Split text to handle wrapping
    const textLines = pdf.splitTextToSize(text, contentWidth);
    
    // Calculate if we need multiple pages
    const lineHeight = 6;
    const textHeight = textLines.length * lineHeight;
    
    // Enhanced page break handling for long text blocks
    if (yPosition + textHeight > pageHeight - 20) {
      // If text doesn't fit on current page
      const linesPerPage = Math.floor((pageHeight - yPosition - 20) / lineHeight);
      
      if (linesPerPage > 0) {
        // Add as many lines as we can fit on this page
        const currentPageLines = textLines.slice(0, linesPerPage);
        pdf.text(currentPageLines, margin, yPosition);
        
        // Move to next page
        addNewPage();
        
        // Add remaining lines to next page
        const remainingLines = textLines.slice(linesPerPage);
        
        if (remainingLines.length > 0) {
          // Recursively handle remaining text to support multiple page breaks if needed
          pdf.text(remainingLines, margin, yPosition);
          yPosition += (remainingLines.length * lineHeight) + 4;
        }
      } else {
        // Not enough space for even one line, just go to next page
        addNewPage();
        addMultiLineText(text); // Recursively call with same text on new page
      }
    } else {
      // Text fits on current page
      pdf.text(textLines, margin, yPosition);
      yPosition += textHeight + 4;
    }
  };
  
  // Helper function to add bullet points - improved for page breaks
  const addBulletPoints = (items: string[]) => {
    if (!items || items.length === 0) return;
    
    items.forEach(item => {
      // Check if we need a new page - increased threshold
      if (yPosition > pageHeight - 30) {
        addNewPage();
      }
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(COLORS.secondary);
      pdf.setFontSize(11);
      
      // Add bullet point
      pdf.text('•', margin, yPosition);
      
      // Add item text, indented after bullet
      const bulletWidth = pdf.getTextWidth('• ');
      const textLines = pdf.splitTextToSize(item, contentWidth - bulletWidth);
      
      // Check if bullet point text will fit on current page
      if (yPosition + (textLines.length * 6) > pageHeight - 20) {
        addNewPage();
        
        // Re-add the bullet and text on the new page
        pdf.text('•', margin, yPosition);
        pdf.text(textLines, margin + 4, yPosition);
      } else {
        pdf.text(textLines, margin + 4, yPosition);
      }
      
      yPosition += (textLines.length * 6) + 2;
    });
  };
  
  // Helper function to format occupants data from JSON string to readable text
  const formatOccupants = (occupantsJson: string): string => {
    if (!occupantsJson) return 'Not specified';
    
    try {
      // Try to parse as JSON first
      const data = JSON.parse(occupantsJson);
      let parts = [];
      
      // Format adults
      if (data.adults && data.adults > 0) {
        parts.push(`${data.adults} adult${data.adults > 1 ? 's' : ''}`);
      }
      
      // Format children
      if (data.children && data.children > 0) {
        parts.push(`${data.children} child${data.children > 1 ? 'ren' : ''}`);
      }
      
      // Format pets (dogs)
      if (data.dogs && data.dogs > 0) {
        parts.push(`${data.dogs} dog${data.dogs > 1 ? 's' : ''}`);
      }
      
      // Format pets (cats)
      if (data.cats && data.cats > 0) {
        parts.push(`${data.cats} cat${data.cats > 1 ? 's' : ''}`);
      }
      
      // Format other pets
      if (data.otherPets) {
        parts.push(data.otherPets);
      }
      
      return parts.length > 0 ? parts.join(', ') : 'Not specified';
    } catch (e) {
      // If not valid JSON, just return as is
      return occupantsJson;
    }
  };
  
  // Add space after content
  const addSpace = (space = 4) => {
    yPosition += space;
  };
  
  // Start building the PDF
  // Add header to first page
  addHeader();
  
  // Add footer to first page
  addFooter();
  
  // Project title
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(COLORS.primary);
  pdf.setFontSize(20);
  const projectTitle = `Design Brief: ${projectData.formData.projectInfo.clientName || 'New Project'}`;
  pdf.text(projectTitle, margin, yPosition);
  yPosition += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(COLORS.secondary);
  pdf.text(`Project Address: ${projectData.formData.projectInfo.projectAddress || 'Not specified'}`, margin, yPosition);
  yPosition += 6;
  
  // Add generated date
  pdf.text(`Last updated: ${formatDistanceToNow(new Date(projectData.lastSaved || Date.now()), { addSuffix: true })}`, margin, yPosition);
  yPosition += 10;
  
  // Add horizontal line
  pdf.setDrawColor(COLORS.border);
  pdf.setLineWidth(0.2);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  
  // 1. Project Information Section
  addSectionTitle('Project Information');
  addText('Client Name', projectData.formData.projectInfo.clientName || 'Not specified');
  addText('Project Address', projectData.formData.projectInfo.projectAddress || 'Not specified');
  addText('Contact Email', projectData.formData.projectInfo.contactEmail || 'Not specified');
  addText('Contact Phone', projectData.formData.projectInfo.contactPhone || 'Not specified');
  
  let projectType = 'Not specified';
  if (projectData.formData.projectInfo.projectType) {
    // Format project type (convert new_build to "New Build")
    projectType = projectData.formData.projectInfo.projectType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  addText('Project Type', projectType);
  
  if (projectData.formData.projectInfo.projectDescription) {
    addSpace();
    addText('Project Description', '');
    addMultiLineText(projectData.formData.projectInfo.projectDescription);
  }
  
  addSpace(8);
  
  // 2. Budget Information Section
  addSectionTitle('Budget Information');
  
  let budgetRange = 'Not specified';
  switch (projectData.formData.budget.budgetRange) {
    case '250k_500k':
      budgetRange = '$250,000 - $500,000';
      break;
    case '500k_750k':
      budgetRange = '$500,000 - $750,000';
      break;
    case '750k_1m':
      budgetRange = '$750,000 - $1,000,000';
      break;
    case '1m_1.5m':
      budgetRange = '$1,000,000 - $1,500,000';
      break;
    case '1.5m_2m':
      budgetRange = '$1,500,000 - $2,000,000';
      break;
    case 'above_2m':
      budgetRange = 'Above $2,000,000';
      break;
    case 'tbd':
      budgetRange = 'To be determined';
      break;
  }
  addText('Budget Range', budgetRange);
  
  if (projectData.formData.budget.flexibilityNotes) {
    addText('Budget Flexibility', '');
    addMultiLineText(projectData.formData.budget.flexibilityNotes);
  }
  
  if (projectData.formData.budget.priorityAreas) {
    addText('Priority Areas', '');
    addMultiLineText(projectData.formData.budget.priorityAreas);
  }
  
  let timeframe = 'Not specified';
  switch (projectData.formData.budget.timeframe) {
    case 'flexible':
      timeframe = 'Flexible / No specific timeline';
      break;
    case 'under_6months':
      timeframe = 'Less than 6 months';
      break;
    case '6months_1year':
      timeframe = '6 months to 1 year';
      break;
    case '1year_2years':
      timeframe = '1-2 years';
      break;
    case 'over_2years':
      timeframe = 'More than 2 years';
      break;
  }
  addText('Project Timeframe', timeframe);
  
  addSpace(8);
  
  // 3. Lifestyle Section
  addSectionTitle('Lifestyle Information');
  
  if (projectData.formData.lifestyle.occupants) {
    const formattedOccupants = formatOccupants(projectData.formData.lifestyle.occupants);
    addText('Occupants', formattedOccupants);
  }
  
  if (projectData.formData.lifestyle.occupationDetails) {
    addText('Occupation Details', '');
    addMultiLineText(projectData.formData.lifestyle.occupationDetails);
  }
  
  if (projectData.formData.lifestyle.dailyRoutine) {
    addText('Daily Routine', '');
    addMultiLineText(projectData.formData.lifestyle.dailyRoutine);
  }
  
  if (projectData.formData.lifestyle.entertainmentStyle) {
    addText('Entertainment Style', '');
    addMultiLineText(projectData.formData.lifestyle.entertainmentStyle);
  }
  
  if (projectData.formData.lifestyle.specialRequirements) {
    addText('Special Requirements', '');
    addMultiLineText(projectData.formData.lifestyle.specialRequirements);
  }
  
  addSpace(8);
  
  // 4. Spaces Section
  addSectionTitle('Spaces Required');
  
  if (projectData.formData.spaces.rooms.length > 0) {
    // Create a table-like structure for rooms
    addSpace(2);
    
    // Group rooms by type and sum quantities
    const roomsByType = new Map();
    projectData.formData.spaces.rooms.forEach(room => {
      const { type, quantity } = room;
      roomsByType.set(type, (roomsByType.get(type) || 0) + quantity);
    });
    
    // Format as a bullet list
    const roomList: string[] = [];
    roomsByType.forEach((quantity, type) => {
      roomList.push(`${quantity} ${type}${quantity > 1 ? 's' : ''}`);
    });
    
    addBulletPoints(roomList);
    
    // Add detailed descriptions for each room
    addSpace(4);
    addText('Room Descriptions', '');
    addSpace(2);
    
    projectData.formData.spaces.rooms.forEach(room => {
      if (room.description) {
        addText(`${room.type} (${room.quantity})`, room.description, true);
      }
    });
  } else {
    addText('Rooms', 'No rooms specified');
  }
  
  if (projectData.formData.spaces.additionalNotes) {
    addSpace();
    addText('Additional Notes', '');
    addMultiLineText(projectData.formData.spaces.additionalNotes);
  }
  
  addSpace(8);
  
  // 5. Site Information Section
  addSectionTitle('Site Information');
  
  if (projectData.formData.site.existingConditions) {
    addText('Existing Conditions', '');
    addMultiLineText(projectData.formData.site.existingConditions);
  }
  
  if (projectData.formData.site.siteFeatures) {
    addText('Site Features', '');
    addMultiLineText(projectData.formData.site.siteFeatures);
  }
  
  if (projectData.formData.site.viewsOrientations) {
    addText('Views/Orientations', '');
    addMultiLineText(projectData.formData.site.viewsOrientations);
  }
  
  if (projectData.formData.site.accessConstraints) {
    addText('Access Constraints', '');
    addMultiLineText(projectData.formData.site.accessConstraints);
  }
  
  if (projectData.formData.site.neighboringProperties) {
    addText('Neighboring Properties', '');
    addMultiLineText(projectData.formData.site.neighboringProperties);
  }
  
  addSpace(8);
  
  // 6. Architecture Preferences Section
  addSectionTitle('Architecture Preferences');
  
  if (projectData.formData.architecture.stylePrefences) {
    addText('Style Preferences', '');
    addMultiLineText(projectData.formData.architecture.stylePrefences);
  }
  
  if (projectData.formData.architecture.externalMaterials) {
    addText('External Materials', '');
    addMultiLineText(projectData.formData.architecture.externalMaterials);
  }
  
  if (projectData.formData.architecture.internalFinishes) {
    addText('Internal Finishes', '');
    addMultiLineText(projectData.formData.architecture.internalFinishes);
  }
  
  if (projectData.formData.architecture.sustainabilityGoals) {
    addText('Sustainability Goals', '');
    addMultiLineText(projectData.formData.architecture.sustainabilityGoals);
  }
  
  if (projectData.formData.architecture.specialFeatures) {
    addText('Special Features', '');
    addMultiLineText(projectData.formData.architecture.specialFeatures);
  }
  
  addSpace(8);
  
  // 7. Project Team Section
  addSectionTitle('Project Team');
  
  addText('Preferred Builder', projectData.formData.contractors.preferredBuilder || 'Not specified');
  addText('Go To Tender', projectData.formData.contractors.goToTender ? 'Yes' : 'No');
  
  if (projectData.formData.contractors.professionals.length > 0) {
    addSpace();
    addText('Professionals', '');
    addSpace(2);
    
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
    
    addBulletPoints(professionalsList);
  }
  
  if (projectData.formData.contractors.additionalNotes) {
    addSpace();
    addText('Additional Notes', '');
    addMultiLineText(projectData.formData.contractors.additionalNotes);
  }
  
  addSpace(8);
  
  // 8. Communication Preferences Section
  addSectionTitle('Communication Preferences');
  
  if (projectData.formData.communication.preferredMethods && projectData.formData.communication.preferredMethods.length > 0) {
    addText('Preferred Methods', projectData.formData.communication.preferredMethods.join(', '));
  }
  
  if (projectData.formData.communication.bestTimes && projectData.formData.communication.bestTimes.length > 0) {
    addText('Best Times', projectData.formData.communication.bestTimes.join(', '));
  }
  
  if (projectData.formData.communication.availableDays && projectData.formData.communication.availableDays.length > 0) {
    addText('Available Days', projectData.formData.communication.availableDays.join(', '));
  }
  
  if (projectData.formData.communication.frequency) {
    addText('Update Frequency', projectData.formData.communication.frequency);
  }
  
  if (projectData.formData.communication.urgentContact) {
    addText('Urgent Contact', projectData.formData.communication.urgentContact);
  }
  
  if (projectData.formData.communication.responseTime) {
    let responseTime = 'Not specified';
    switch (projectData.formData.communication.responseTime) {
      case 'same_day':
        responseTime = 'Same Day';
        break;
      case '24_hours':
        responseTime = 'Within 24 Hours';
        break;
      case '48_hours':
        responseTime = 'Within 48 Hours';
        break;
      case 'week':
        responseTime = 'Within a Week';
        break;
    }
    addText('Expected Response Time', responseTime);
  }
  
  if (projectData.formData.communication.additionalNotes) {
    addSpace();
    addText('Additional Notes', '');
    addMultiLineText(projectData.formData.communication.additionalNotes);
  }
  
  addSpace(8);
  
  // 9. Inspiration Images
  if (projectData.files.inspirationSelections && projectData.files.inspirationSelections.length > 0) {
    addSectionTitle('Inspiration Gallery');
    addText('Selected Inspiration Images', `${projectData.files.inspirationSelections.length} images selected`);
    // Note: actual images would be included in a real implementation
    // but that requires different handling outside of this PDF generation
  }
  
  // 10. Summary Section - Enhanced to handle page breaks and long text
  if (projectData.summary.editedSummary) {
    addSectionTitle('Project Summary');
    addMultiLineText(projectData.summary.editedSummary);
  }
  
  // Save the PDF
  const fileName = `Northstar_Brief_${projectData.formData.projectInfo.clientName || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
