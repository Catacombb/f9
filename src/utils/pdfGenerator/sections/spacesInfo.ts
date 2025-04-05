
import { ProjectData, SpaceRoom } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addBulletPoints, addSpace } from '../layout';
import { groupRoomsByLevel, getOrderedLevels } from '../helpers';

export const renderSpacesInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Spaces Required');
  
  if (projectData.formData.spaces.rooms.length > 0) {
    // Group rooms by type
    const roomsByType = projectData.formData.spaces.rooms.reduce((acc, room) => {
      const type = room.isCustom && room.customName ? room.customName : room.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(room);
      return acc;
    }, {} as Record<string, SpaceRoom[]>);
    
    addSpace(ctx, 4);
    
    // Display each room type
    Object.entries(roomsByType).forEach(([type, rooms]) => {
      // Add room type header with count
      ctx.pdf.setFont('helvetica', 'bold');
      ctx.pdf.setFontSize(11);
      ctx.pdf.setTextColor(ctx.colors.primary);
      ctx.pdf.text(`${rooms.length} ${type}${rooms.length !== 1 ? 's' : ''}:`, ctx.margin, ctx.yPosition);
      ctx.yPosition += 5;
      ctx.pdf.setFont('helvetica', 'normal');
      ctx.pdf.setFontSize(10);
      ctx.pdf.setTextColor(ctx.colors.secondary);
      
      // Add bullet points for each room
      rooms.forEach((room, index) => {
        try {
          const descObj = JSON.parse(room.description);
          const roomName = room.displayName || room.customName || `${type} ${index + 1}`;
          const levelInfo = descObj.level ? `(${descObj.level.toUpperCase()}) ` : '';
          
          // Build description
          const descriptionItems = [];
          
          // Room-specific properties based on room type
          if (room.type === 'Kitchen' || room.type === 'Kitchenette') {
            if (descObj.kitchenType) {
              descriptionItems.push(`${descObj.kitchenType} kitchen`);
            }
            
            if (descObj.kitchenLayout) {
              descriptionItems.push(`${descObj.kitchenLayout}`);
            }
            
            if (descObj.kitchenUse) {
              descriptionItems.push(`${descObj.kitchenUse}`);
            }
          }
          
          if (room.type === 'Living' || room.type === 'Family Room') {
            if (descObj.entertainmentFocus) {
              descriptionItems.push("Entertainment focused");
            }
            
            if (descObj.entertainmentSpace) {
              descriptionItems.push(`${descObj.entertainmentSpace}`);
            }
            
            if (descObj.acousticNeeds) {
              descriptionItems.push(`Special acoustic considerations needed`);
            }
          }
          
          if (room.type === 'Office' || room.type === 'Study') {
            if (descObj.workFromHome) {
              descriptionItems.push("Work from home ready");
            }
            
            if (descObj.officeType) {
              descriptionItems.push(`${descObj.officeType}`);
            }
          }
          
          // Notes - always include if available
          if (descObj.notes) {
            descriptionItems.push(descObj.notes);
          }
          
          // Format the final description text
          let formattedDescription;
          if (descriptionItems.length > 0) {
            formattedDescription = descriptionItems.join(". ") + ".";
          } else {
            formattedDescription = "No specific details";
          }
          
          // Draw the bullet point
          ctx.pdf.setFont('helvetica', 'bold');
          ctx.pdf.text("• ", ctx.margin, ctx.yPosition);
          ctx.pdf.setFont('helvetica', 'normal');
          
          // Draw the room name in bold
          const roomNameWidth = ctx.pdf.getTextWidth("• "); 
          ctx.pdf.setFont('helvetica', 'bold');
          ctx.pdf.text(roomName, ctx.margin + roomNameWidth, ctx.yPosition);
          
          // Calculate where to start the description
          const fullPrefixWidth = ctx.pdf.getTextWidth("• " + roomName + " – " + levelInfo);
          
          // Add the description after an en dash
          ctx.pdf.setFont('helvetica', 'normal');
          
          // Add description with appropriate wrapping
          const descStart = ctx.margin + fullPrefixWidth;
          const maxWidth = ctx.contentWidth - fullPrefixWidth;
          
          // First line with the level info and start of description
          ctx.pdf.text(`– ${levelInfo}`, ctx.margin + roomNameWidth + ctx.pdf.getTextWidth(roomName), ctx.yPosition);
          
          // Split the description to fit within available width
          const splitDescription = ctx.pdf.splitTextToSize(formattedDescription, maxWidth);
          
          // If the description is more than one line
          if (splitDescription.length > 1) {
            // First line is already positioned after the room name
            ctx.pdf.text(splitDescription[0], descStart, ctx.yPosition);
            ctx.yPosition += 4; // Move down for the next lines
            
            // Add subsequent lines with proper indentation
            for (let i = 1; i < splitDescription.length; i++) {
              ctx.pdf.text(splitDescription[i], ctx.margin + 4, ctx.yPosition);
              ctx.yPosition += 4;
            }
          } else {
            // Single line description
            ctx.pdf.text(formattedDescription, descStart, ctx.yPosition);
            ctx.yPosition += 4;
          }
          
          // Add spacing between bullet points
          ctx.yPosition += 2;
          
        } catch (e) {
          // Fallback if JSON parsing fails
          const roomName = room.displayName || room.customName || `${type} ${index + 1}`;
          
          ctx.pdf.setFont('helvetica', 'bold');
          ctx.pdf.text("• " + roomName, ctx.margin, ctx.yPosition);
          ctx.pdf.setFont('helvetica', 'normal');
          ctx.pdf.text(" – " + (room.description || "No specific details"), 
            ctx.margin + ctx.pdf.getTextWidth("• " + roomName), 
            ctx.yPosition);
          ctx.yPosition += 6;
        }
      });
      
      // Add space between room types
      ctx.yPosition += 4;
    });
  } else {
    addText(ctx, 'Rooms', 'No rooms specified');
  }
  
  // Add home level type preference if available
  if (projectData.formData.spaces.homeLevelType) {
    addSpace(ctx);
    addText(ctx, 'Level Preference', '');
    const levelPreference = projectData.formData.spaces.homeLevelType === 'single-level' 
      ? 'Single-level home' 
      : projectData.formData.spaces.homeLevelType === 'multi-level' 
        ? 'Multi-level home' 
        : 'No specific preference';
    addText(ctx, '', levelPreference);
  }
  
  // Add home size if specified
  if (projectData.formData.spaces.homeSize) {
    addSpace(ctx);
    addText(ctx, 'Home Size', projectData.formData.spaces.homeSize);
  }
  
  // Add eliminable spaces if specified
  if (projectData.formData.spaces.eliminableSpaces) {
    addSpace(ctx);
    addText(ctx, 'Spaces that could be eliminated', projectData.formData.spaces.eliminableSpaces);
  }
  
  if (projectData.formData.spaces.additionalNotes) {
    addSpace(ctx);
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.spaces.additionalNotes);
  }
  
  addSpace(ctx, 8);
};
