
import { formatDistanceToNow } from 'date-fns';
import { PDFContext } from './types';
import { removeMarkdown } from './helpers';

// Helper function to add a new page
export const addNewPage = (ctx: PDFContext): PDFContext => {
  ctx.pdf.addPage();
  ctx.pageNumber++;
  ctx.yPosition = ctx.margin;
  
  // Add header to new page
  addHeader(ctx);
  
  // Add footer to new page
  addFooter(ctx);
  
  return ctx;
};

// Helper function to add header with centered logo
export const addHeader = (ctx: PDFContext): void => {
  // Increased header height to accommodate logo properly
  const headerHeight = 35; // Further increased height for better logo appearance
  
  ctx.pdf.setFillColor(ctx.colors.background);
  ctx.pdf.rect(0, 0, ctx.pageWidth, headerHeight, 'F');
  
  // Get logo path - using the light mode logo
  const logoPath = '/lovable-uploads/f87cbd00-65a2-4b67-ae04-55a828581a0e.png';
  
  // Properly preserve aspect ratio - original logo is approximately 3.33:1 (width:height)
  const logoHeight = 18; // Increased from 15 for better visibility
  const logoWidth = logoHeight * 3.33; // Preserve exact aspect ratio
  const logoX = (ctx.pageWidth - logoWidth) / 2; // Center horizontally
  const logoY = 8; // Properly centered in the taller header
  
  try {
    // Add actual image with preserved aspect ratio
    ctx.pdf.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    // Fallback to text if image loading fails
    ctx.pdf.setFont('helvetica', 'bold');
    ctx.pdf.setTextColor(ctx.colors.primary);
    ctx.pdf.setFontSize(18);
    ctx.pdf.text('F9 PRODUCTIONS', ctx.pageWidth / 2, 15, { align: 'center' });
    
    // Add the house icon in yellow
    ctx.pdf.setTextColor(ctx.colors.accent);
    ctx.pdf.setFontSize(14);
    ctx.pdf.text('⌂★', ctx.pageWidth / 2 + 25, 15);
    ctx.pdf.setTextColor(ctx.colors.primary);
  }
  
  // Add horizontal line - moved down to match new header height
  ctx.pdf.setDrawColor(ctx.colors.accent);
  ctx.pdf.setLineWidth(0.5);
  ctx.pdf.line(ctx.margin, headerHeight - 2, ctx.pageWidth - ctx.margin, headerHeight - 2);
  
  ctx.yPosition = headerHeight + 5; // Adjusted starting position after header
};

// Helper function to add footer with clickable link
export const addFooter = (ctx: PDFContext): void => {
  const footerY = ctx.pageHeight - 10;
  
  ctx.pdf.setFont('helvetica', 'normal');
  ctx.pdf.setFontSize(8);
  ctx.pdf.setTextColor(ctx.colors.secondary);
  
  // Add page number
  ctx.pdf.text(`Page ${ctx.pageNumber}`, ctx.pageWidth - ctx.margin - 10, footerY);
  
  // Add generation date
  const dateText = `Generated ${formatDistanceToNow(new Date(), { addSuffix: true })}`;
  ctx.pdf.text(dateText, ctx.margin, footerY);
  
  // Add website with link
  const website = 'f9productions.com';
  const websiteX = ctx.pageWidth / 2;
  
  // Calculate text width for link positioning
  const textWidth = ctx.pdf.getTextWidth(website);
  
  // Add clickable link
  ctx.pdf.setTextColor(ctx.colors.accent); // Make it look like a link
  ctx.pdf.text(website, websiteX, footerY, { align: 'center' });
  
  // Add link annotation
  ctx.pdf.link(
    websiteX - textWidth / 2, // x position
    footerY - 5, // y position (adjust for text height)
    textWidth, // width
    5, // height
    { url: 'https://f9productions.com' }
  );
};

// Helper function to add a section title
export const addSectionTitle = (ctx: PDFContext, title: string): void => {
  // Check if we need a new page - increased threshold to ensure enough space
  if (ctx.yPosition > ctx.pageHeight - 50) {
    addNewPage(ctx);
  }
  
  ctx.pdf.setFont('helvetica', 'bold');
  ctx.pdf.setTextColor(ctx.colors.accent); // Use accent color for section titles
  ctx.pdf.setFontSize(16); // Larger font size for better hierarchy
  
  // Add title without icon
  ctx.pdf.text(title, ctx.margin, ctx.yPosition);
  
  // Add a thin line below the title for visual separation
  ctx.pdf.setDrawColor(ctx.colors.border);
  ctx.pdf.setLineWidth(0.2);
  ctx.pdf.line(ctx.margin, ctx.yPosition + 3, ctx.pageWidth - ctx.margin, ctx.yPosition + 3);
  
  ctx.yPosition += 10; // Increased space after title
};

// Helper function to add text
export const addText = (ctx: PDFContext, label: string, value: string, isSmall = false): void => {
  // Check if we need a new page - increased threshold to ensure enough space
  if (ctx.yPosition > ctx.pageHeight - 40) {
    addNewPage(ctx);
  }
  
  ctx.pdf.setFont('helvetica', 'bold');
  ctx.pdf.setTextColor(ctx.colors.primary);
  ctx.pdf.setFontSize(isSmall ? 10 : 11);
  ctx.pdf.text(`${label}:`, ctx.margin, ctx.yPosition);
  
  // Calculate where the value should start (after label)
  const labelWidth = ctx.pdf.getTextWidth(`${label}:`);
  const valueX = ctx.margin + labelWidth + 2;
  
  // Check if value will fit on current line
  const valueWidth = ctx.pdf.getTextWidth(value);
  const maxWidth = ctx.contentWidth - labelWidth - 2;
  
  if (valueWidth <= maxWidth) {
    // Value fits on same line
    ctx.pdf.setFont('helvetica', 'normal');
    ctx.pdf.setTextColor(ctx.colors.secondary);
    ctx.pdf.text(value, valueX, ctx.yPosition);
    ctx.yPosition += isSmall ? 5 : 6;
  } else {
    // Value needs to be on next line and possibly wrapped
    ctx.yPosition += isSmall ? 5 : 6;
    ctx.pdf.setFont('helvetica', 'normal');
    ctx.pdf.setTextColor(ctx.colors.secondary);
    
    // Split text to handle wrapping
    const textLines = ctx.pdf.splitTextToSize(value, ctx.contentWidth);
    ctx.pdf.text(textLines, ctx.margin, ctx.yPosition);
    ctx.yPosition += (textLines.length * (isSmall ? 5 : 6)) + 2;
  }
};

// Helper function to add multiline text - improved to handle page breaks
export const addMultiLineText = (ctx: PDFContext, text: string): void => {
  if (!text || text.trim() === '') return;
  
  ctx.pdf.setFont('helvetica', 'normal');
  ctx.pdf.setTextColor(ctx.colors.secondary);
  ctx.pdf.setFontSize(11);
  
  // Process text to remove markdown if needed
  text = removeMarkdown(text);
  
  // Split text to handle wrapping
  const textLines = ctx.pdf.splitTextToSize(text, ctx.contentWidth);
  
  // Calculate if we need multiple pages
  const lineHeight = 6;
  const textHeight = textLines.length * lineHeight;
  
  // Enhanced page break handling for long text blocks
  if (ctx.yPosition + textHeight > ctx.pageHeight - 20) {
    // If text doesn't fit on current page
    const linesPerPage = Math.floor((ctx.pageHeight - ctx.yPosition - 20) / lineHeight);
    
    if (linesPerPage > 0) {
      // Add as many lines as we can fit on this page
      const currentPageLines = textLines.slice(0, linesPerPage);
      ctx.pdf.text(currentPageLines, ctx.margin, ctx.yPosition);
      
      // Move to next page
      addNewPage(ctx);
      
      // Add remaining lines to next page
      const remainingLines = textLines.slice(linesPerPage);
      
      if (remainingLines.length > 0) {
        // Recursively handle remaining text to support multiple page breaks if needed
        ctx.pdf.text(remainingLines, ctx.margin, ctx.yPosition);
        ctx.yPosition += (remainingLines.length * lineHeight) + 4;
      }
    } else {
      // Not enough space for even one line, just go to next page
      addNewPage(ctx);
      addMultiLineText(ctx, text); // Recursively call with same text on new page
    }
  } else {
    // Text fits on current page
    ctx.pdf.text(textLines, ctx.margin, ctx.yPosition);
    ctx.yPosition += textHeight + 4;
  }
};

// Helper function to add bullet points - improved for page breaks
export const addBulletPoints = (ctx: PDFContext, items: string[]): void => {
  if (!items || items.length === 0) return;
  
  items.forEach(item => {
    // Check if we need a new page - increased threshold
    if (ctx.yPosition > ctx.pageHeight - 30) {
      addNewPage(ctx);
    }
    
    ctx.pdf.setFont('helvetica', 'normal');
    ctx.pdf.setTextColor(ctx.colors.secondary);
    ctx.pdf.setFontSize(11);
    
    // Add bullet point
    ctx.pdf.text('•', ctx.margin, ctx.yPosition);
    
    // Add item text, indented after bullet
    const bulletWidth = ctx.pdf.getTextWidth('• ');
    const textLines = ctx.pdf.splitTextToSize(item, ctx.contentWidth - bulletWidth);
    
    // Check if bullet point text will fit on current page
    if (ctx.yPosition + (textLines.length * 6) > ctx.pageHeight - 20) {
      addNewPage(ctx);
      
      // Re-add the bullet and text on the new page
      ctx.pdf.text('•', ctx.margin, ctx.yPosition);
      ctx.pdf.text(textLines, ctx.margin + 4, ctx.yPosition);
    } else {
      ctx.pdf.text(textLines, ctx.margin + 4, ctx.yPosition);
    }
    
    ctx.yPosition += (textLines.length * 6) + 2;
  });
};

// Add space after content
export const addSpace = (ctx: PDFContext, space = 4): void => {
  ctx.yPosition += space;
};
