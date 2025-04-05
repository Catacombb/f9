
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
    
    // Add detailed descriptions for each room
    addSpace(ctx, 4);
    addText(ctx, 'Room Descriptions', '');
    addSpace(ctx, 2);
    
    projectData.formData.spaces.rooms.forEach(room => {
      if (room.description) {
        try {
          const descObj = JSON.parse(room.description);
          const descriptionItems = [];
          
          // Level information
          if (descObj.level) {
            descriptionItems.push(`Located on ${descObj.level} floor`);
          }
          
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
  } else {
    addText(ctx, 'Rooms', 'No rooms specified');
  }
  
  if (projectData.formData.spaces.additionalNotes) {
    addSpace(ctx);
    addText(ctx, 'Additional Notes', '');
    addMultiLineText(ctx, projectData.formData.spaces.additionalNotes);
  }
  
  addSpace(ctx, 8);
};
