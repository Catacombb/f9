
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addBulletPoints, addSpace } from '../layout';

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
    const roomsByLevel: Record<string, typeof projectData.formData.spaces.rooms> = {};
    
    projectData.formData.spaces.rooms.forEach(room => {
      try {
        const descObj = JSON.parse(room.description);
        const level = descObj.level || 'Unspecified';
        
        if (!roomsByLevel[level]) {
          roomsByLevel[level] = [];
        }
        
        roomsByLevel[level].push(room);
      } catch (e) {
        // If parsing fails, add to unspecified level
        if (!roomsByLevel['Unspecified']) {
          roomsByLevel['Unspecified'] = [];
        }
        roomsByLevel['Unspecified'].push(room);
      }
    });
    
    // Sort levels in a logical order
    const levelOrder = {
      'Basement': 0,
      'Ground': 1,
      'Ground Floor': 1,
      'First': 2,
      'First Floor': 2,
      'Second': 3,
      'Second Floor': 3,
      'Third': 4,
      'Third Floor': 4,
      'Unspecified': 999,
    };
    
    const orderedLevels = Object.keys(roomsByLevel).sort((a, b) => {
      const orderA = levelOrder[a] !== undefined ? levelOrder[a] : a.toLowerCase().includes('basement') ? 0 : 998;
      const orderB = levelOrder[b] !== undefined ? levelOrder[b] : b.toLowerCase().includes('basement') ? 0 : 998;
      return orderA - orderB;
    });
    
    // Add detailed descriptions for each room by level
    addSpace(ctx, 4);
    addText(ctx, 'Room Details by Level', '');
    addSpace(ctx, 2);
    
    orderedLevels.forEach(level => {
      // Add level header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(ctx.colors.primary);
      pdf.text(`${level}`, ctx.margin, ctx.yPosition);
      ctx.yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(ctx.colors.secondary);
      
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
            
            addText(ctx, `${room.type} (${room.quantity})`, formattedDescription, true);
          } catch (e) {
            // If JSON parsing fails, use the original description
            addText(ctx, `${room.type} (${room.quantity})`, room.description, true);
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
  
  if (projectData.formData.spaces.additionalNotes) {
    addSpace(ctx);
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.spaces.additionalNotes);
  }
  
  addSpace(ctx, 8);
};
