
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addBulletPoints, addSpace } from '../layout';
import { groupRoomsByLevel, getOrderedLevels } from '../helpers';

export const renderSpacesInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Spaces Required');
  
  if (projectData.formData.spaces.rooms.length > 0) {
    // Create a table-like structure for rooms
    addSpace(ctx, 2);
    
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
    
    addBulletPoints(ctx, roomList);
    
    // Group rooms by level for detailed descriptions
    const roomsByLevel = groupRoomsByLevel(projectData.formData.spaces.rooms, 'Unspecified');
    
    // Get ordered levels
    const orderedLevels = getOrderedLevels(Object.keys(roomsByLevel));
    
    // Add detailed descriptions for each room by level
    addSpace(ctx, 4);
    addText(ctx, 'Room Details by Level', '');
    addSpace(ctx, 2);
    
    orderedLevels.forEach(level => {
      // Add level header
      ctx.pdf.setFont('helvetica', 'bold');
      ctx.pdf.setFontSize(11);
      ctx.pdf.setTextColor(ctx.colors.primary);
      ctx.pdf.text(`${level}`, ctx.margin, ctx.yPosition);
      ctx.yPosition += 5;
      ctx.pdf.setFont('helvetica', 'normal');
      ctx.pdf.setFontSize(10);
      ctx.pdf.setTextColor(ctx.colors.secondary);
      
      roomsByLevel[level].forEach(room => {
        if (room.description) {
          try {
            const descObj = JSON.parse(room.description);
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
            
            // Level details (always include)
            if (descObj.level) {
              descriptionItems.push(`Located on ${descObj.level}`);
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
            
            addText(ctx, `${room.isCustom && room.customName ? room.customName : room.type} (${room.quantity})`, formattedDescription, true);
          } catch (e) {
            // If JSON parsing fails, use the original description
            addText(ctx, `${room.isCustom && room.customName ? room.customName : room.type} (${room.quantity})`, room.description, true);
          }
        }
      });
      
      addSpace(ctx, 2);
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
