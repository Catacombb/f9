
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

export const generateTestData = () => {
  return {
    projectInfo: {
      clientName: "John & Sarah Smith",
      projectAddress: "123 Beach Road, Auckland 0622, New Zealand",
      contactEmail: "john.smith@example.com",
      contactPhone: "+64 21 123 4567",
      projectType: "New residential build",
      projectDescription: "Contemporary family home on coastal section",
      moveInPreference: "As soon as possible",
      projectGoals: "Create a sustainable, modern home with indoor-outdoor flow",
      moveInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0], // 1 year from now
      coordinates: [-36.8485, 174.7633] as [number, number], // Auckland
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
        // Bedrooms (4)
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          displayName: 'Master Bedroom',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'This is a detailed note for the Master Bedroom. We would like a large ensuite and walk-in closet.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          displayName: 'Kids Bedroom 1',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'This room is for our 10-year-old son who needs space for toys and study.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          displayName: 'Kids Bedroom 2',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'This room is for our 8-year-old daughter who loves bright colors and needs storage.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          displayName: 'Guest Bedroom',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'A comfortable room for visitors with adequate closet space.'
          }), 
          isCustom: false 
        },
        
        // Bathrooms (3)
        { 
          id: generateRandomString(10), 
          type: 'Bathroom', 
          displayName: 'Master Ensuite',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'Large bathroom with double vanity, walk-in shower, and separate bathtub.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bathroom', 
          displayName: 'Family Bathroom',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'Shared bathroom for the kids with bathtub/shower combo.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bathroom', 
          displayName: 'Powder Room',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Small half bath for guests on the main floor.'
          }), 
          isCustom: false 
        },
        
        // Living spaces
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
            notes: 'Open concept living room with fireplace and large windows facing the garden.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Dining', 
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Formal dining area for 8-10 people, adjacent to kitchen.'
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
            notes: 'Modern kitchen with island, walk-in pantry, and high-end appliances.'
          }), 
          isCustom: false 
        },
        
        // Utility spaces
        { 
          id: generateRandomString(10), 
          type: 'Laundry', 
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Functional laundry room with washer, dryer, sink, and storage.'
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
            notes: 'Quiet home office with built-in desk and bookshelves.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Garage', 
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'We want this garage to include storage for bikes and sports equipment.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Media Room',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Dedicated home theater with sound insulation and comfortable seating.'
          }), 
          isCustom: true,
          customName: 'Media Room'
        },
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Gym',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Small home gym with space for workout equipment.'
          }), 
          isCustom: true,
          customName: 'Gym'
        },
      ],
      additionalNotes: 'We would like good flow between indoor and outdoor spaces.',
      roomTypes: ['Living Room', 'Kitchen', 'Bedroom', 'Office', 'Bathroom', 'Dining Room', 'Laundry', 'Garage', 'Media Room', 'Gym'],
      specialSpaces: ['Vaulted Ceilings', 'Large Windows', 'Built-in Storage'],
      storageNeeds: 'Walk-in closets in bedrooms, pantry in kitchen, linen closet near bathrooms.',
      spatialRelationships: 'Kitchen should flow into dining and living area. Office should be in a quiet part of the house.',
      accessibilityNeeds: 'no',
      spacesNotes: '350 square meters, two floors with most living spaces downstairs and bedrooms upstairs',
      homeLevelType: 'multi-level',
      homeSize: '350 square meters',
      eliminableSpaces: 'Could reduce the size of the guest bedroom if needed.',
      levelAssignmentNotes: 'Bedrooms on upper floor, living spaces on ground floor',
    },
    architecture: {
      stylePrefences: 'Modern, minimalist with warm touches.',
      externalMaterials: 'Brick, wood, and glass.',
      internalFinishes: 'Neutral colors, natural materials.',
      sustainabilityGoals: 'Energy-efficient design, solar panels, rainwater collection.',
      specialFeatures: 'Smart home technology, outdoor living space with cover.',
      preferredStyles: ['Modern', 'Minimalist', 'Contemporary'],
      materialPreferences: ['Brick', 'Wood', 'Glass', 'Natural Stone'],
      sustainabilityFeatures: ['Solar Panels', 'Energy-Efficient Windows', 'Rainwater Collection'],
      technologyRequirements: ['Smart Home System', 'High-Speed Internet', 'Automated Lighting'],
      architectureNotes: 'Focus on clean lines, natural light, and passive heating/cooling.',
      inspirationNotes: 'Love natural light, open spaces, and connection to outdoors.',
    },
    contractors: {
      preferredBuilder: "Auckland Premium Builders",
      goToTender: true,
      professionals: [
        { id: generateRandomString(10), type: 'Architect', name: 'Jane Anderson', contact: 'jane@examplearchitects.com', notes: 'Recommended by friends who built last year.', isCustom: false },
        { id: generateRandomString(10), type: 'Builder', name: 'Auckland Premium Builders', contact: 'info@aucklandpremiumbuilders.co.nz', notes: 'Local builder with good reputation.', isCustom: false },
        { id: generateRandomString(10), type: 'Interior Designer', name: 'Sarah Williams', contact: 'sarah@interiorsbysarah.co.nz', notes: 'Experienced in residential design.', isCustom: false },
        { id: generateRandomString(10), type: 'Engineer', name: 'Tom Brown', contact: 'tom.brown@structuralengineers.co.nz', notes: 'Structural engineer with experience in coastal properties.', isCustom: false },
      ],
      additionalNotes: "We would like to work with professionals who have experience with modern, sustainable homes."
    },
    communication: {
      preferredMethods: ['Email', 'Phone', 'Video Call'],
      bestTimes: ['Morning', 'Evening', 'Anytime'],
      availableDays: ['Weekdays', 'Weekends'],
      frequency: 'Weekly',
      urgentContact: 'Phone',
      responseTime: '24 hours',
      additionalNotes: 'Prefer detailed email updates with phone calls for urgent matters.',
      communicationNotes: 'Please provide regular updates on progress.',
    },
    feedback: {
      usabilityRating: 5,
      performanceRating: 5,
      functionalityRating: 5,
      designRating: 5,
      feedbackComments: "The design brief tool was very comprehensive and easy to use. I appreciated the detailed questions about each room and the ability to specify preferences for different spaces.",
      customVersionInterest: "We would be interested in a version that includes 3D visualization of room layouts.",
    }
  };
};

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
    createDummyFile('site-photo-front.jpg', 'image/jpeg'),
    createDummyFile('site-photo-rear.jpg', 'image/jpeg'),
    createDummyFile('site-photo-view.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy inspiration images
  const uploadedInspirationImages = [
    createDummyFile('inspiration-living-room.jpg', 'image/jpeg'),
    createDummyFile('inspiration-kitchen.jpg', 'image/jpeg'),
    createDummyFile('inspiration-exterior.jpg', 'image/jpeg'),
    createDummyFile('inspiration-bathroom.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy site documents
  const siteDocuments = [
    createDummyFile('certificate-of-title.pdf', 'application/pdf'),
    createDummyFile('site-survey.pdf', 'application/pdf'),
    createDummyFile('resource-consent.pdf', 'application/pdf'),
    createDummyFile('existing-floor-plan.pdf', 'application/pdf'),
  ];

  // Create an array of dummy inspiration selections
  const inspirationSelections = [
    'modern', 'minimalist', 'natural light', 'open concept', 'indoor-outdoor flow'
  ];

  return {
    uploadedFiles,
    uploadedInspirationImages,
    inspirationSelections,
    siteDocuments,
  };
}
