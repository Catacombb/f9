
import { FormData } from '@/types';

// Function to generate a random string of a specified length
const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate a random number within a specified range
const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function generateTestData(): Partial<FormData> {
  return {
    projectInfo: {
      clientName: 'John Doe',
      projectAddress: '123 Main St, Anytown',
      contactEmail: 'john.doe@example.com',
      contactPhone: '555-123-4567',
      projectType: 'Residential Renovation',
      projectDescription: 'Renovate existing house to modern standards.',
      projectGoals: 'Improve energy efficiency and aesthetics.',
      coordinates: [-73.9857, 40.7484],
      moveInPreference: 'as_soon_as_possible',
      moveInDate: '2025-06-15',
    },
    budget: {
      budgetRange: '$100,000 - $200,000',
      flexibilityNotes: 'Can be flexible for the right design.',
      priorityAreas: 'Kitchen and bathrooms.',
      timeframe: '6-12 months',
      budgetFlexibility: '10%',
      budgetPriorities: ['Kitchen', 'Bathrooms', 'Energy Efficiency'],
      budgetNotes: 'Looking for cost-effective solutions.',
    },
    lifestyle: {
      occupants: JSON.stringify({ familyMembers: ['2 adults', '2 children'], pets: ['dog', 'cat'] }),
      occupationDetails: 'Software Engineer',
      dailyRoutine: 'Work from home, family activities in the evening.',
      entertainmentStyle: 'Casual gatherings with friends and family.',
      specialRequirements: 'Home office, kids play area.',
      pets: 'Dog and cat',
      specialNeeds: 'Allergies to dust.',
      hobbies: ['Gardening', 'Cooking', 'Reading'],
      entertaining: 'Outdoor BBQ area.',
      workFromHome: 'Dedicated home office.',
      lifestyleNotes: 'Active family, enjoy outdoor activities.',
    },
    site: {
      existingConditions: 'Suburban, well-maintained neighborhood.',
      siteFeatures: 'Large backyard, mature trees.',
      viewsOrientations: 'West-facing with sunset views.',
      accessConstraints: 'Limited street parking.',
      neighboringProperties: 'Residential houses on all sides.',
      topographicSurvey: 'Available upon request.',
      existingHouseDrawings: 'Available in digital format.',
      septicDesign: 'N/A (city sewer).',
      certificateOfTitle: 'Available upon request.',
      covenants: 'Standard residential covenants.',
      siteConstraints: ['Easement on the back of the property'],
      siteAccess: 'Easy access from the street.',
      siteViews: 'Good views of the sunset.',
      outdoorSpaces: ['Patio', 'Garden', 'Play area'],
      siteNotes: 'Slight slope towards the back of the property.',
    },
    spaces: {
      rooms: [
        { 
          id: generateRandomString(10), 
          type: 'Living', 
          quantity: 1, 
          description: JSON.stringify({
            entertainmentFocus: true,
            entertainmentDesign: true,
            entertainmentSpace: 'Integrated with Living Areas',
            acousticNeeds: false,
            level: 'ground',
            notes: 'Open concept with fireplace.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Kitchen', 
          quantity: 1, 
          description: JSON.stringify({
            kitchenType: 'Both',
            kitchenLayout: 'Open to Other Spaces',
            kitchenUse: 'Also for Eating',
            level: 'ground',
            notes: 'Modern kitchen with island.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          quantity: 3, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'Master bedroom with ensuite.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Office', 
          quantity: 1, 
          description: JSON.stringify({
            workFromHome: true,
            officeType: 'Dedicated Office',
            level: 'ground',
            notes: 'Quiet space with good natural light.'
          }), 
          isCustom: false 
        },
      ],
      additionalNotes: 'Need a flexible space for home office.',
      roomTypes: ['Living Room', 'Kitchen', 'Bedroom', 'Office'],
      specialSpaces: ['Vaulted Ceilings', 'Large Windows', 'Built-in Storage'],
      storageNeeds: 'Could reduce the size of the guest bedroom if needed.',
      spatialRelationships: 'Kitchen should flow into dining and living area. Office should be in a quiet part of the house.',
      accessibilityNeeds: 'no',
      spacesNotes: '200 square meters, two floors',
      homeLevelType: 'multi-level',
      levelAssignmentNotes: 'Bedrooms on upper floor, living spaces on ground floor',
    },
    architecture: {
      stylePrefences: 'Modern, minimalist.',
      externalMaterials: 'Brick, wood, and glass.',
      internalFinishes: 'Neutral colors, natural materials.',
      sustainabilityGoals: 'Energy-efficient design, solar panels.',
      specialFeatures: 'Smart home technology, outdoor living space.',
      preferredStyles: ['Modern', 'Minimalist'],
      materialPreferences: ['Brick', 'Wood', 'Glass'],
      sustainabilityFeatures: ['Solar Panels', 'Energy-Efficient Windows'],
      technologyRequirements: ['Smart Home System', 'High-Speed Internet'],
      architectureNotes: 'Focus on clean lines and natural light.',
      inspirationNotes: 'Love natural light and open spaces.',
    },
    contractors: {
      goToTender: true,
      professionals: [
        { id: generateRandomString(10), type: 'Builder', name: 'ABC Builders', contact: 'abc@example.com', notes: 'Local builder with good reputation.', isCustom: false },
        { id: generateRandomString(10), type: 'Interior Designer', name: 'Jane Smith', contact: 'jane.smith@example.com', notes: 'Experienced in residential design.', isCustom: false },
        { id: generateRandomString(10), type: 'Engineer', name: 'Tom Brown', contact: 'tom.brown@example.com', notes: 'Structural engineer.', isCustom: false },
      ],
      additionalNotes: 'Looking for experienced and reliable contractors.',
    },
    communication: {
      preferredMethods: ['Email', 'Phone'],
      bestTimes: ['Afternoon', 'Evening'],
      availableDays: ['Weekdays', 'Weekends'],
      frequency: 'Weekly',
      urgentContact: 'Phone',
      responseTime: '24 hours',
      additionalNotes: 'Prefer detailed email updates.',
      communicationNotes: 'Please provide regular updates on progress.',
    },
  };
}

export function generateTestFiles(): {
  uploadedFiles: File[];
  uploadedInspirationImages: File[];
  inspirationSelections: string[];
  siteDocuments: File[];
} {
  // Create dummy files for testing purposes
  const createDummyFile = (name: string, type: string) => {
    return new File(['dummy content'], name, { type });
  };

  // Create an array of dummy uploaded files (for site photos)
  const uploadedFiles = [
    createDummyFile('site-photo-1.jpg', 'image/jpeg'),
    createDummyFile('site-photo-2.jpg', 'image/jpeg'),
    createDummyFile('site-photo-3.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy inspiration images
  const uploadedInspirationImages = [
    createDummyFile('inspiration-1.jpg', 'image/jpeg'),
    createDummyFile('inspiration-2.jpg', 'image/jpeg'),
    createDummyFile('inspiration-3.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy site documents
  const siteDocuments = [
    createDummyFile('certificate-of-title.pdf', 'application/pdf'),
    createDummyFile('site-survey.pdf', 'application/pdf'),
    createDummyFile('resource-consent.pdf', 'application/pdf'),
    createDummyFile('floor-plan.pdf', 'application/pdf'),
  ];

  // Create an array of dummy inspiration selections
  const inspirationSelections = [
    'modern', 'minimalist', 'natural light'
  ];

  return {
    uploadedFiles,
    uploadedInspirationImages,
    inspirationSelections,
    siteDocuments,
  };
}
