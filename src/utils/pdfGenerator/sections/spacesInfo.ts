
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
          let formattedDescription = '';
          
          // Format level
          if (descObj.level) {
            formattedDescription += `Located on ${descObj.level} floor. `;
          }
          
          // Room-specific properties
          if (descObj.kitchenType) {
            formattedDescription += `${descObj.kitchenType} kitchen. `;
          }
          
          if (descObj.kitchenLayout) {
            formattedDescription += `${descObj.kitchenLayout}. `;
          }
          
          if (descObj.entertainmentFocus) {
            formattedDescription += "Entertainment focused. ";
          }
          
          if (descObj.workFromHome) {
            formattedDescription += "Work from home ready. ";
          }
          
          // Notes
          if (descObj.notes) {
            formattedDescription += descObj.notes;
          }
          
          addText(ctx, `${room.type} (${room.quantity})`, formattedDescription.trim(), true);
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
