
import { ProjectData } from "@/types";

export const generateTestData = (): Partial<ProjectData['formData']> => {
  return {
    projectInfo: {
      clientName: "Test User",
      projectAddress: "123 Test Street, Test City",
      contactEmail: "test@example.com",
      contactPhone: "555-123-4567",
      projectType: "new_build",
      projectDescription: "This is a comprehensive test project that will showcase modern architectural design principles with sustainable features. The client is looking for an open-concept living space with plenty of natural light and connection to outdoor areas.",
      coordinates: [51.505, -0.09] // Example coordinates (London)
    },
    budget: {
      budgetRange: "750k_1m",
      flexibilityNotes: "Flexible on finishing materials, prioritizing structural elements and sustainable features. Willing to increase budget for high-quality kitchen appliances and smart home technology.",
      priorityAreas: "Kitchen, main bathroom, and home office spaces are top priorities. Energy efficiency features are also important throughout the home.",
      timeframe: "6months_1year"
    },
    lifestyle: {
      occupants: "2 adults, 2 children (ages 8 and 10), 1 dog",
      projectTimeframe: "Starting in 3 months, need to complete before the next school year begins",
      occupationDetails: "Both adults work from home 3 days per week in technology fields, requiring dedicated office spaces with good acoustics and lighting",
      dailyRoutine: "Early risers (6am), active lifestyle with regular exercise, children have after-school activities, family dinner time is important",
      entertainmentStyle: "Frequent small gatherings (8-10 people) and occasional larger events (up to 25 people), outdoor entertaining in summer months",
      specialRequirements: "Home office needs with soundproofing, child-friendly spaces that can evolve as children grow, pet-friendly materials, and allergen considerations for one family member"
    },
    spaces: {
      rooms: [
        {
          id: crypto.randomUUID(),
          type: "bedroom",
          quantity: 4,
          description: "Master bedroom with ensuite, three standard bedrooms for children and guests",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "bathroom",
          quantity: 3,
          description: "One main bathroom, one ensuite, one powder room",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "living",
          quantity: 1,
          description: "Open plan living area with connection to outdoor space",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "kitchen",
          quantity: 1,
          description: "Modern kitchen with island, walk-in pantry, and premium appliances",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "dining",
          quantity: 1,
          description: "Formal dining area with space for 10 people",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "office",
          quantity: 2,
          description: "Two dedicated home offices with built-in storage and ergonomic considerations",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "other",
          quantity: 1,
          description: "Media room with acoustic treatment and comfortable seating",
          isCustom: true
        },
        {
          id: crypto.randomUUID(),
          type: "other",
          quantity: 1,
          description: "Mudroom/utility space with storage for sports equipment and pet supplies",
          isCustom: true
        }
      ],
      additionalNotes: "Need good flow between kitchen and living areas. Outdoor living space should feel like an extension of the indoor space. Storage is very important throughout the home."
    },
    site: {
      existingConditions: "Urban site with existing structure that will be demolished. Level ground with good drainage. South-facing backyard with mature landscaping.",
      siteFeatures: "800m² flat rectangular lot with established garden beds and several mature trees that should be preserved if possible. Good soil quality suitable for edible garden.",
      viewsOrientations: "Good southern exposure, views to urban park in west, neighboring properties on east and north sides. City skyline visible from second floor.",
      accessConstraints: "Narrow driveway access (3.5m wide), limited street parking, heritage overlay requires council approval for certain changes.",
      neighboringProperties: "Two-story houses on either side, three-story apartment building to the rear, park across the street. Privacy considerations needed for rear and side boundaries.",
      topographicSurvey: "Available and recently updated",
      existingHouseDrawings: "Available for current structure",
      septicDesign: "Not required - city sewage connection available",
      certificateOfTitle: "Available with no unexpected encumbrances",
      covenants: "Height restrictions (maximum 9m) and setback requirements apply, material restrictions prohibit certain cladding types"
    },
    architecture: {
      stylePrefences: "Contemporary design with warm materials and timeless aesthetic. Preference for clean lines but not minimalist. Japanese-Scandinavian fusion influences with emphasis on natural materials and craftsmanship.",
      externalMaterials: "Preference for sustainable timber cladding, natural stone elements, large glazing with high-performance glass, metal roofing, and concrete features.",
      internalFinishes: "Polished concrete floors in living areas, engineered timber in bedrooms, porcelain tiles in wet areas. White walls with feature timber paneling. Exposed concrete elements in select areas.",
      sustainabilityGoals: "Targeting 8-star energy rating, solar-ready roof design, high-performance insulation, rainwater harvesting system, greywater recycling, passive solar design principles, and low-VOC materials throughout.",
      specialFeatures: "Double-height living space, indoor-outdoor flow with large sliding doors, feature staircase as sculptural element, skylight over kitchen, custom joinery throughout, and integrated smart home technology."
    },
    contractors: {
      preferredBuilder: "Sustainable Homes Construction Ltd.",
      goToTender: true,
      professionals: [
        {
          id: crypto.randomUUID(),
          name: "Green Design Architects",
          type: "architect",
          contact: "info@greendesign.com",
          notes: "Previous experience with passive house design"
        },
        {
          id: crypto.randomUUID(),
          name: "Structural Solutions Engineering",
          type: "structural_engineer",
          contact: "engineering@structuralsolutions.com",
          notes: "Specializes in sustainable structural systems"
        },
        {
          id: crypto.randomUUID(),
          name: "EcoInteriors",
          type: "interior_designer",
          contact: "designs@ecointeriors.com",
          notes: "Expertise in sustainable materials and finishes"
        },
        {
          id: crypto.randomUUID(),
          name: "Urban Landscapes",
          type: "landscape_architect",
          contact: "info@urbanlandscapes.com",
          notes: "Specializes in native plantings and water-wise design"
        },
        {
          id: crypto.randomUUID(),
          name: "Efficient Systems MEP",
          type: "other",
          contact: "info@efficientsystems.com",
          notes: "Mechanical, electrical, and plumbing specialists with focus on energy efficiency"
        }
      ],
      additionalNotes: "Would like to involve landscape designer at early planning stages to integrate indoor-outdoor design seamlessly. All professionals should have experience with sustainable design practices."
    },
    communication: {
      preferredMethods: ["email", "phone", "video"],
      bestTimes: ["morning", "afternoon"],
      availableDays: ["monday", "wednesday", "friday"],
      frequency: "weekly",
      urgentContact: "For urgent matters, please contact via phone call or text message. Available between 8am-8pm on weekdays.",
      responseTime: "24_hours",
      additionalNotes: "Prefer detailed written summaries after major decisions and meetings. Happy to use project management software if available. Weekly update emails are appreciated."
    }
  };
};

// Function to create dummy files for testing
export const generateTestFiles = () => {
  // Create a test image file from a canvas
  const createImageFile = (name: string): File => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#d1d5db');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some text
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.textAlign = 'center';
      ctx.fillText('Test Image', canvas.width / 2, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    return new File(
      [canvas.toDataURL('image/png')], 
      `${name}.png`, 
      { type: 'image/png' }
    );
  };
  
  // Create a test PDF file
  const createPdfFile = (name: string): File => {
    // This is just a placeholder - in a real environment we'd generate actual PDF content
    const pdfContent = new Uint8Array([37, 80, 68, 70]); // "%PDF" in ASCII
    return new File([pdfContent], `${name}.pdf`, { type: 'application/pdf' });
  };
  
  // Generate files
  const uploadedFiles = [
    createPdfFile('site_plan'),
    createPdfFile('floor_plans'),
    createPdfFile('elevations'),
    createImageFile('site_photo_1'),
    createImageFile('site_photo_2')
  ];
  
  const inspirationImages = [
    createImageFile('inspiration_kitchen'),
    createImageFile('inspiration_bathroom'),
    createImageFile('inspiration_exterior'),
    createImageFile('inspiration_living_room')
  ];
  
  return {
    uploadedFiles,
    inspirationImages,
    // Simulating selected inspiration IDs from predefined options
    inspirationSelections: [
      'modern_kitchen_01',
      'contemporary_bathroom_03',
      'scandinavian_living_02',
      'japanese_garden_04',
      'sustainable_materials_01'
    ]
  };
};
