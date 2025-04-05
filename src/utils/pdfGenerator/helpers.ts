
import { PDFContext } from './types';

// Helper function to remove markdown formatting
export const removeMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Replace headings (# Heading) with just the text
  let cleanText = text.replace(/^#+\s+(.+)$/gm, '$1');
  
  // Remove bold/italic markers
  cleanText = cleanText.replace(/\*\*(.+?)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*(.+?)\*/g, '$1');
  cleanText = cleanText.replace(/__(.+?)__/g, '$1');
  cleanText = cleanText.replace(/_(.+?)_/g, '$1');
  
  // Remove link syntax
  cleanText = cleanText.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  
  // Remove bullet points
  cleanText = cleanText.replace(/^\s*[-*+]\s+(.+)$/gm, '$1');
  
  // Remove numbered lists
  cleanText = cleanText.replace(/^\s*\d+\.\s+(.+)$/gm, '$1');
  
  // Remove horizontal rules
  cleanText = cleanText.replace(/^\s*[-*_]{3,}\s*$/gm, '');
  
  // Remove code blocks and inline code
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`(.+?)`/g, '$1');
  
  // Remove blockquotes
  cleanText = cleanText.replace(/^\s*>\s+(.+)$/gm, '$1');
  
  // Ensure sentences start with capital letter
  cleanText = cleanText.replace(/(\.\s+|^)([a-z])/gm, (match, p1, p2) => p1 + p2.toUpperCase());
  
  return cleanText;
};

// Helper function to format occupants data from JSON string to readable text
export const formatOccupants = (occupantsJson: string): string => {
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

// Format data value based on code lookups
export const formatCodedValue = (
  code: string | undefined,
  mappings: Record<string, string>,
  defaultValue = 'Not specified'
): string => {
  if (!code) return defaultValue;
  return mappings[code] || defaultValue;
};

// Group room objects by their level (now ensuring level is uppercase)
export const groupRoomsByLevel = (
  rooms: Array<{ description: string, [key: string]: any }>,
  defaultLevel = 'UNSPECIFIED'
) => {
  const roomsByLevel: Record<string, Array<any>> = {};
  
  rooms.forEach(room => {
    let level = defaultLevel;
    
    try {
      const descObj = JSON.parse(room.description);
      if (descObj.level) {
        // Convert level to uppercase for consistency
        level = descObj.level.toUpperCase();
      }
    } catch (e) {
      // Use default level if parsing fails
    }
    
    if (!roomsByLevel[level]) {
      roomsByLevel[level] = [];
    }
    
    roomsByLevel[level].push(room);
  });
  
  return roomsByLevel;
};

// Order levels in a logical sequence
export const getOrderedLevels = (levels: string[]) => {
  const levelOrder = {
    'BASEMENT': 0,
    'GROUND': 1,
    'GROUND FLOOR': 1,
    'FIRST': 2, 
    'FIRST FLOOR': 2,
    'SECOND': 3,
    'SECOND FLOOR': 3,
    'THIRD': 4,
    'THIRD FLOOR': 4,
    'UNSPECIFIED': 999
  };
  
  return levels.sort((a, b) => {
    // Convert to uppercase for consistent comparison
    const levelA = a.toUpperCase();
    const levelB = b.toUpperCase();
    
    const orderA = levelOrder[levelA] !== undefined ? levelOrder[levelA] : levelA.includes('BASEMENT') ? 0 : 998;
    const orderB = levelOrder[levelB] !== undefined ? levelOrder[levelB] : levelB.includes('BASEMENT') ? 0 : 998;
    return orderA - orderB;
  });
};
