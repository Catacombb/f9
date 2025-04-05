
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
      budgetRange: '$750,000 - $1,200,000',
      flexibilityNotes: 'Can increase budget up to 10% for exceptional design features.',
      priorityAreas: 'Kitchen, master suite, and outdoor living areas are top priorities.',
      timeframe: '12-18 months',
      budgetFlexibility: '10%',
      budgetPriorities: ['Kitchen', 'Master Suite', 'Outdoor Living', 'Energy Efficiency'],
      budgetNotes: 'Looking for high-quality finishes in main living areas; can be more economical in secondary spaces.',
    },
    lifestyle: {
      occupants: JSON.stringify({ 
        adults: 2, 
        children: 3,
        childrenAges: [5, 8, 12],
        pets: {
          dogs: 1,
          cats: 2,
          other: []
        }
      }),
      occupationDetails: 'John works as an architect (partial WFH), Sarah is a pediatrician at Auckland Hospital',
      dailyRoutine: 'Early risers, busy mornings getting kids ready. Evening family dinners important. Weekends spent outdoors.',
      entertainmentStyle: 'Regular dinner parties (6-8 guests), occasional larger gatherings (15-20 people), kids' birthday parties.',
      specialRequirements: 'Need quiet home office for video calls, playroom for children, and secure outdoor space for pets.',
      pets: 'One medium-sized dog (Labrador) and two indoor cats',
      specialNeeds: 'Oldest child has mild asthma, so good ventilation and dust control important.',
      hobbies: ['Cooking', 'Gardening', 'Photography', 'Reading', 'Mountain Biking'],
      entertaining: 'Weekly family dinners, monthly friend gatherings, seasonal larger parties',
      workFromHome: 'Dedicated office needed with good natural light and sound isolation',
      lifestyleNotes: 'Active family that values both private spaces and communal gathering areas. Indoor-outdoor flow essential for our lifestyle.',
    },
    site: {
      existingConditions: 'Sloping 800sqm section with existing 1970s house to be demolished. Several mature native trees to preserve.',
      siteFeatures: 'North-facing aspect with ocean views from upper level. Protected from prevailing westerly winds by neighboring properties.',
      viewsOrientations: 'Ocean views to the north, city skyline visible to the east. Southern boundary backs onto reserve land.',
      accessConstraints: 'Single driveway access from road, 3.5m wide with neighbor right-of-way on eastern boundary.',
      neighboringProperties: 'Modern two-story homes on both sides, single-level older homes across the street. Reserve to south.',
      topographicSurvey: 'Completed January 2023, shows 4m elevation change from street to rear boundary.',
      existingHouseDrawings: 'Original plans available from council archives, some additions not documented.',
      septicDesign: 'Connected to city sewerage system, no septic needed.',
      certificateOfTitle: 'Available upon request, no unusual easements except shared driveway.',
      covenants: 'Height to boundary restrictions, no more than 40% site coverage allowed.',
      siteConstraints: ['Protected native Pohutukawa tree', 'Shared driveway', 'Storm water management required', 'Height restrictions'],
      siteAccess: 'From northern boundary, street access with moderate slope up driveway.',
      siteViews: 'Premium ocean views from northern aspect, particularly from higher elevation.',
      outdoorSpaces: ['Indoor-Outdoor Flow', 'Garden', 'Deck', 'BBQ Area', 'Pool'],
      siteNotes: 'Site gets excellent morning sun but western portion heats up significantly in summer afternoons. Would like to utilize rainwater collection if possible.',
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
            notes: 'Spacious master suite with walk-in closet and ensuite bathroom. Needs good morning light and views if possible. Would like a small sitting area or workspace within the suite.'
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
            notes: 'For our 12-year-old daughter. Needs good desk space for schoolwork, ample storage, and room for a queen bed. Should be somewhat soundproofed as she plays music.'
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
            notes: 'For our 8-year-old son. Needs durability, good storage for toys and books. Proximity to bathroom important.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Bedroom', 
          displayName: 'Kids Bedroom 3',
          quantity: 1, 
          description: JSON.stringify({
            level: 'upper',
            notes: 'For our 5-year-old daughter. Should be close to parents bedroom, needs good closet space and room for play area.'
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
            notes: 'Luxurious ensuite with double vanity, large shower, freestanding tub and separate toilet. Natural light priority while maintaining privacy.'
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
            notes: 'Main bathroom for the kids with double vanity, combined tub-shower, and durable finishes. Needs good ventilation and storage.'
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
            notes: 'Small half bath on main floor for guests. Should be accessible from main living areas but somewhat private.'
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
            acousticNeeds: true,
            level: 'ground',
            notes: 'Main living room should accommodate 8-10 people comfortably. Prefer open plan connected to kitchen and dining with sliding doors to outdoor space. Fireplace desired.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Dining', 
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Formal dining area adjacent to kitchen with seating for 8-10. Natural light important, with easy access to outdoor dining in summer.'
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
            notes: 'Chef\'s kitchen with large island, premium appliances, walk-in pantry, and breakfast bar. Should be hub of the home with good workflow for cooking while socializing.'
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
            notes: 'Spacious laundry room with washer, dryer, utility sink, folding counter, and storage for cleaning supplies. Ideally with external access to clothesline.'
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
            notes: 'Quiet home office with built-in desk and shelving, good natural light but controlled to prevent screen glare. Needs soundproofing for video calls and meetings.'
          }), 
          isCustom: false 
        },
        { 
          id: generateRandomString(10), 
          type: 'Garage', 
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Double garage with additional space for workshop area, storage for bikes, sports equipment, and garden tools. Internal access to house preferred.'
          }), 
          isCustom: false 
        },
        
        // Custom spaces
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Media Room',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Dedicated media room with proper acoustic treatment, comfortable seating for 6-8 people, and wiring for projector and surround sound system.'
          }), 
          isCustom: true,
          customName: 'Media Room'
        },
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Library/Study',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Quiet reading room with built-in bookshelves, comfortable seating, and good natural light. Could double as guest bedroom if needed.'
          }), 
          isCustom: true,
          customName: 'Library/Study'
        },
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Gym',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Small home gym with space for cardio equipment, free weights, and yoga area. Needs good ventilation, mirror wall, and resilient flooring.'
          }), 
          isCustom: true,
          customName: 'Gym'
        },
        { 
          id: generateRandomString(10), 
          type: 'Other', 
          displayName: 'Mud Room',
          quantity: 1, 
          description: JSON.stringify({
            level: 'ground',
            notes: 'Entry area for removing shoes and coats, with storage for school bags, sports equipment. Should connect garage to main house.'
          }), 
          isCustom: true,
          customName: 'Mud Room'
        },
      ],
      additionalNotes: 'We need excellent flow between indoor and outdoor spaces with coverage for year-round use. Flexible spaces that can adapt as children grow older.',
      roomTypes: ['Living Room', 'Kitchen', 'Bedroom', 'Office', 'Bathroom', 'Dining Room', 'Laundry', 'Garage', 'Media Room', 'Library', 'Gym', 'Mud Room'],
      specialSpaces: ['Vaulted Ceilings', 'Window Seats', 'Built-in Storage', 'Indoor-Outdoor Flow'],
      storageNeeds: 'Extensive storage throughout – walk-in closets in bedrooms, linen closets near bathrooms, dedicated storage for seasonal items, toys, and sporting equipment.',
      spatialRelationships: 'Kitchen should be central, connected to dining and living. Kids\' bedrooms clustered near family bathroom. Mud room between garage and kitchen.',
      accessibilityNeeds: 'Ground floor should be accessible. Future-proofing for aging in place with potential for main floor bedroom conversion if needed.',
      spacesNotes: 'We prefer generous, well-designed spaces over excessive square footage. Quality over quantity.',
      homeLevelType: 'multi-level',
      homeSize: '280-320 square meters',
      eliminableSpaces: 'Media room could be combined with living if needed. Library/Study could be smaller or integrated with another space.',
      levelAssignmentNotes: 'All bedrooms and primary bathrooms on upper level. Living spaces, kitchen, office, and utility rooms on ground floor.',
    },
    architecture: {
      stylePrefences: 'Modern contemporary with warm materials – not stark minimalism. Timeless rather than trendy.',
      externalMaterials: 'Low maintenance materials – combination of brick/stone, wood accents, and some metal cladding. Quality windows extremely important.',
      internalFinishes: 'Natural materials where possible – timber floors, stone countertops, minimal carpet except in bedrooms. Neutral palette with accent colors through fixtures and furniture.',
      sustainabilityGoals: 'High insulation standards, solar orientation for passive heating, provision for future solar panel installation. Water efficiency important.',
      specialFeatures: 'Indoor-outdoor flow, feature staircase, dramatic entry ceiling height, window seats in key locations, hidden storage throughout.',
      preferredStyles: ['Modern', 'Contemporary', 'Coastal', 'Scandinavian Influence'],
      materialPreferences: ['Natural Wood', 'Stone', 'Glass', 'Metal Accents', 'Concrete Elements'],
      sustainabilityFeatures: ['Passive Solar Design', 'High-Performance Insulation', 'Water Collection', 'Energy-Efficient Appliances', 'Future Solar Ready'],
      technologyRequirements: ['Smart Home System', 'EV Charging Provision', 'High-Performance WiFi', 'Security System', 'Energy Monitoring'],
      architectureNotes: 'We value longevity, quality craftsmanship, and thoughtful design over trends. Looking for a home that feels contemporary but will age well over decades.',
      inspirationNotes: 'Inspired by indoor-outdoor living, connection to landscape, natural light, and creating both private retreats and communal gathering spaces.',
    },
    contractors: {
      preferredBuilder: "Auckland Premium Builders",
      goToTender: true,
      professionals: [
        { id: generateRandomString(10), type: 'Architect', name: 'Jane Anderson', contact: 'jane@examplearchitects.com', notes: 'Recommended by friends who built last year. We like her modern residential portfolio.', isCustom: false },
        { id: generateRandomString(10), type: 'Builder', name: 'Auckland Premium Builders', contact: 'info@aucklandpremiumbuilders.co.nz', notes: 'Have seen several of their projects and been impressed with quality. Known for good project management.', isCustom: false },
        { id: generateRandomString(10), type: 'Interior Designer', name: 'Sarah Williams', contact: 'sarah@interiorsbysarah.co.nz', notes: 'May want to involve for kitchen design and material selections, not sure about full service.', isCustom: false },
        { id: generateRandomString(10), type: 'Engineer', name: 'Tom Brown', contact: 'tom.brown@structuralengineers.co.nz', notes: 'Structural engineer recommended by our architect for the challenging site.', isCustom: false },
        { id: generateRandomString(10), type: 'Landscape Designer', name: 'Green Space Design', contact: 'info@greenspacedesign.co.nz', notes: 'Would like integrated landscape design approach from early stages.', isCustom: true, customType: 'Landscape Designer' },
      ],
      additionalNotes: "Willing to pay for quality and experience, especially with challenging site conditions. Would prefer team that has worked together successfully before."
    },
    communication: {
      preferredMethods: ['Email', 'Phone', 'In-person Meetings', 'Video Call'],
      bestTimes: ['Evenings', 'Weekends'],
      availableDays: ['Weekdays after 6pm', 'Saturdays'],
      frequency: 'Weekly for critical phases, bi-weekly for standard updates',
      urgentContact: 'Phone or text message',
      responseTime: '24-48 hours for standard items, same day for urgent matters',
      additionalNotes: 'John is primary contact for technical decisions, Sarah for interior and layout preferences. Both must approve major design directions.',
      communicationNotes: 'We prefer consolidated communications rather than multiple fragmented updates. Regular scheduled meetings work better for us than impromptu calls.',
    },
    feedback: {
      usabilityRating: 5,
      performanceRating: 4,
      functionalityRating: 5,
      designRating: 5,
      feedbackComments: "The design brief tool made it easy to think through all aspects of our project systematically. The room-by-room approach helped us articulate needs we might have otherwise forgotten.",
      customVersionInterest: "Would love a version that incorporates more visualization tools or simple 3D modeling to test spatial relationships.",
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
    createDummyFile('site-context-aerial.jpg', 'image/jpeg'),
    createDummyFile('existing-building.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy inspiration images
  const uploadedInspirationImages = [
    createDummyFile('inspiration-living-room.jpg', 'image/jpeg'),
    createDummyFile('inspiration-kitchen.jpg', 'image/jpeg'),
    createDummyFile('inspiration-exterior.jpg', 'image/jpeg'),
    createDummyFile('inspiration-bathroom.jpg', 'image/jpeg'),
    createDummyFile('inspiration-bedroom.jpg', 'image/jpeg'),
    createDummyFile('inspiration-outdoor-space.jpg', 'image/jpeg'),
  ];

  // Create an array of dummy site documents
  const siteDocuments = [
    createDummyFile('certificate-of-title.pdf', 'application/pdf'),
    createDummyFile('site-survey.pdf', 'application/pdf'),
    createDummyFile('geotechnical-report.pdf', 'application/pdf'),
    createDummyFile('existing-floor-plan.pdf', 'application/pdf'),
    createDummyFile('council-restrictions.pdf', 'application/pdf'),
    createDummyFile('topographical-survey.dwg', 'application/octet-stream'),
  ];

  // Create an array of dummy inspiration selections
  const inspirationSelections = [
    'modern', 'contemporary', 'natural light', 'open concept', 'indoor-outdoor flow',
    'neutral palette', 'sustainable', 'minimalist', 'warm textures'
  ];

  return {
    uploadedFiles,
    uploadedInspirationImages,
    inspirationSelections,
    siteDocuments,
  };
}
