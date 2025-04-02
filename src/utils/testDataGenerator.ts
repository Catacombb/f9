
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
      projectGoals: "Create a modern, sustainable family home that maximizes natural light and connects seamlessly with outdoor spaces. The home should be energy-efficient, low-maintenance, and adaptable to changing family needs over time.",
      coordinates: [51.505, -0.09] // Example coordinates (London)
    },
    budget: {
      budgetRange: "750k_1m",
      flexibilityNotes: "Flexible on finishing materials, prioritizing structural elements and sustainable features. Willing to increase budget for high-quality kitchen appliances and smart home technology.",
      priorityAreas: "Kitchen, main bathroom, and home office spaces are top priorities. Energy efficiency features are also important throughout the home.",
      budgetFlexibility: "somewhat_flexible",
      budgetPriorities: ["kitchen", "bathroom", "energy_efficiency", "outdoor_spaces", "technology"],
      timeframe: "6months_1year",
      budgetNotes: "We've set aside an additional contingency of 15% to account for unforeseen expenses. We're particularly interested in investing in quality materials in high-use areas like the kitchen and bathrooms."
    },
    lifestyle: {
      occupants: "2 adults, 2 children (ages 8 and 10), 1 dog",
      projectTimeframe: "Starting in 3 months, need to complete before the next school year begins",
      occupationDetails: "Both adults work from home 3 days per week in technology fields, requiring dedicated office spaces with good acoustics and lighting",
      dailyRoutine: "Early risers (6am), active lifestyle with regular exercise, children have after-school activities, family dinner time is important",
      entertainmentStyle: "Frequent small gatherings (8-10 people) and occasional larger events (up to 25 people), outdoor entertaining in summer months",
      specialRequirements: "Home office needs with soundproofing, child-friendly spaces that can evolve as children grow, pet-friendly materials, and allergen considerations for one family member",
      pets: "One large dog (Labrador) and considering adding a cat in the future",
      specialNeeds: "Child with mild sensory sensitivities who benefits from quiet spaces",
      hobbies: ["cooking", "gardening", "music", "reading", "arts_crafts"],
      entertaining: "weekly",
      workFromHome: "regularly",
      lifestyleNotes: "We highly value indoor-outdoor living and want spaces that can easily flow between both. Our family is active and needs durable materials throughout."
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
          isCustom: true,
          customName: "Media Room"
        },
        {
          id: crypto.randomUUID(),
          type: "other",
          quantity: 1,
          description: "Mudroom/utility space with storage for sports equipment and pet supplies",
          isCustom: true,
          customName: "Mudroom"
        },
        {
          id: crypto.randomUUID(),
          type: "other",
          quantity: 1,
          description: "Home gym with space for cardio and strength equipment",
          isCustom: true,
          customName: "Home Gym"
        }
      ],
      roomTypes: ["bedroom", "bathroom", "living", "kitchen", "dining", "office", "other"],
      specialSpaces: ["home_office", "media_room", "laundry", "pantry", "mud_room", "gym"],
      storageNeeds: "Extensive storage required throughout. Walk-in closets in bedrooms, built-in cabinetry in living spaces, pantry in kitchen, and garage storage system.",
      spatialRelationships: "Kitchen must connect to dining and outdoor spaces. Primary bedroom should be separated from children's bedrooms. Office spaces need to be away from noisy areas.",
      accessibilityNeeds: "Single-level living preferred, or at minimum a primary bedroom suite on the ground floor for future aging-in-place considerations.",
      additionalNotes: "Need good flow between kitchen and living areas. Outdoor living space should feel like an extension of the indoor space. Storage is very important throughout the home. Spaces should be flexible to accommodate changing needs over time.",
      spacesNotes: "We value spaces that can serve multiple functions and adapt as our family's needs change. Storage solutions are extremely important to us throughout the home."
    },
    site: {
      existingConditions: "Urban site with existing structure that will be demolished. Level ground with good drainage. South-facing backyard with mature landscaping.",
      siteFeatures: ["level_ground", "mature_trees", "good_views", "privacy", "natural_water"],
      siteConstraints: ["access_limitations", "noise", "easements", "setbacks"],
      siteAccess: "Limited access from narrow driveway (3.5m wide). Construction vehicles will need special consideration.",
      siteViews: "Good southern exposure with city skyline visible from second floor. Western views to urban park worth preserving.",
      outdoorSpaces: ["garden", "patio", "pool", "outdoor_kitchen"],
      viewsOrientations: "Good southern exposure, views to urban park in west, neighboring properties on east and north sides. City skyline visible from second floor.",
      accessConstraints: "Narrow driveway access (3.5m wide), limited street parking, heritage overlay requires council approval for certain changes.",
      neighboringProperties: "Two-story houses on either side, three-story apartment building to the rear, park across the street. Privacy considerations needed for rear and side boundaries.",
      topographicSurvey: "Available and recently updated",
      existingHouseDrawings: "Available for current structure",
      septicDesign: "Not required - city sewage connection available",
      certificateOfTitle: "Available with no unexpected encumbrances",
      covenants: "Height restrictions (maximum 9m) and setback requirements apply, material restrictions prohibit certain cladding types",
      siteNotes: "The site has excellent solar access that we want to capitalize on with passive solar design principles. Privacy from neighboring properties is also important, especially in the backyard."
    },
    architecture: {
      stylePrefences: "Contemporary design with warm materials and timeless aesthetic. Preference for clean lines but not minimalist. Japanese-Scandinavian fusion influences with emphasis on natural materials and craftsmanship.",
      preferredStyles: ["contemporary", "minimalist", "scandinavian", "japanese"],
      externalMaterials: "Preference for sustainable timber cladding, natural stone elements, large glazing with high-performance glass, metal roofing, and concrete features.",
      materialPreferences: ["timber", "stone", "concrete", "glass", "metal"],
      internalFinishes: "Polished concrete floors in living areas, engineered timber in bedrooms, porcelain tiles in wet areas. White walls with feature timber paneling. Exposed concrete elements in select areas.",
      sustainabilityFeatures: ["solar_power", "rainwater_harvesting", "passive_design", "high_insulation", "energy_efficient"],
      technologyRequirements: ["smart_lighting", "home_automation", "security_system", "av_integration", "efficient_hvac"],
      sustainabilityGoals: "Targeting 8-star energy rating, solar-ready roof design, high-performance insulation, rainwater harvesting system, greywater recycling, passive solar design principles, and low-VOC materials throughout.",
      specialFeatures: "Double-height living space, indoor-outdoor flow with large sliding doors, feature staircase as sculptural element, skylight over kitchen, custom joinery throughout, and integrated smart home technology.",
      architectureNotes: "We're drawn to spaces that feel warm and inviting while maintaining clean lines and a contemporary aesthetic. Natural light and airflow are extremely important to us throughout the home."
    },
    contractors: {
      preferredBuilder: "Sustainable Homes Construction Ltd.",
      goToTender: true,
      professionals: [
        {
          id: crypto.randomUUID(),
          name: "Green Design Architects",
          type: "Architect",
          contact: "info@greendesign.com",
          notes: "Previous experience with passive house design"
        },
        {
          id: crypto.randomUUID(),
          name: "Structural Solutions Engineering",
          type: "Structural Engineer",
          contact: "engineering@structuralsolutions.com",
          notes: "Specializes in sustainable structural systems"
        },
        {
          id: crypto.randomUUID(),
          name: "EcoInteriors",
          type: "Interior Designer",
          contact: "designs@ecointeriors.com",
          notes: "Expertise in sustainable materials and finishes"
        },
        {
          id: crypto.randomUUID(),
          name: "Urban Landscapes",
          type: "Landscape Architect",
          contact: "info@urbanlandscapes.com",
          notes: "Specializes in native plantings and water-wise design"
        },
        {
          id: crypto.randomUUID(),
          name: "Efficient Systems MEP",
          type: "Electrical Engineer",
          contact: "info@efficientsystems.com",
          notes: "Mechanical, electrical, and plumbing specialists with focus on energy efficiency"
        },
        {
          id: crypto.randomUUID(),
          name: "Project Management Experts",
          type: "Project Manager",
          contact: "info@pmexperts.com",
          notes: "Specializes in residential construction project management"
        },
        {
          id: crypto.randomUUID(),
          name: "Cost Control Services",
          type: "Quantity Surveyor",
          contact: "info@costcontrol.com",
          notes: "Detailed cost estimation and budget management"
        },
        {
          id: crypto.randomUUID(),
          name: "GeoTech Surveying",
          type: "Surveyor",
          contact: "surveys@geotech.com",
          notes: "Comprehensive site surveys and reports"
        },
        {
          id: crypto.randomUUID(),
          name: "Innovative Plumbing Solutions",
          type: "Plumbing Engineer",
          contact: "info@innovativeplumbing.com",
          notes: "Specializes in water-efficient systems and rainwater harvesting"
        },
        {
          id: crypto.randomUUID(),
          name: "Sustainability Consultants",
          type: "other",
          contact: "info@sustainabilityconsult.com",
          notes: "Provides guidance on achieving sustainability certifications"
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
      additionalNotes: "Prefer detailed written summaries after major decisions and meetings. Happy to use project management software if available. Weekly update emails are appreciated.",
      communicationNotes: "We appreciate clear, regular communication with all team members. Documentation of all decisions is important to us."
    },
    inspiration: {
      inspirationNotes: "We're drawn to designs that balance modern aesthetics with warmth and natural elements. We particularly like the way natural light is handled in projects 3 and 7, and the indoor-outdoor flow shown in projects 2 and 5. The material palette in project 8 is close to what we envision for our home."
    }
  };
};

// Function to create dummy files for testing
export const generateTestFiles = () => {
  // Create a test image file from a canvas
  const createImageFile = (name: string, color = '#f3f4f6'): File => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustColor(color, -20));
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
  
  // Helper to adjust color brightness
  const adjustColor = (hex: string, amount: number): string => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Create a test PDF file
  const createPdfFile = (name: string): File => {
    // This is just a placeholder - in a real environment we'd generate actual PDF content
    const pdfContent = new Uint8Array([37, 80, 68, 70]); // "%PDF" in ASCII
    return new File([pdfContent], `${name}.pdf`, { type: 'application/pdf' });
  };
  
  // Generate a comprehensive set of test files
  const uploadedFiles = [
    createPdfFile('site_plan'),
    createPdfFile('floor_plans'),
    createPdfFile('elevations'),
    createPdfFile('structural_engineering_report'),
    createPdfFile('council_requirements'),
    createImageFile('site_photo_front', '#c8e6c9'),
    createImageFile('site_photo_back', '#c8e6c9'),
    createImageFile('site_photo_side_1', '#c8e6c9'),
    createImageFile('site_photo_side_2', '#c8e6c9'),
    createImageFile('view_from_property', '#bbdefb'),
    createImageFile('neighborhood_context', '#bbdefb'),
    createPdfFile('budget_spreadsheet'),
    createPdfFile('timeline_document'),
    createPdfFile('material_selections')
  ];
  
  // Generate diverse inspiration images
  const inspirationImages = [
    createImageFile('inspiration_kitchen', '#e0f7fa'),
    createImageFile('inspiration_bathroom', '#e1f5fe'),
    createImageFile('inspiration_exterior', '#f3e5f5'),
    createImageFile('inspiration_living_room', '#fff8e1'),
    createImageFile('inspiration_bedroom', '#fce4ec'),
    createImageFile('inspiration_garden', '#f1f8e9'),
    createImageFile('inspiration_materials', '#ede7f6'),
    createImageFile('inspiration_lighting', '#ffebee')
  ];
  
  // Generate comprehensive inspiration selections
  const inspirationSelections = {
    // Kitchen inspirations
    'modern_kitchen_01': true,
    'contemporary_kitchen_02': true,
    'minimalist_kitchen_03': true,
    
    // Bathroom inspirations
    'contemporary_bathroom_03': true,
    'spa_bathroom_04': true,
    'minimalist_bathroom_02': true,
    
    // Living room inspirations
    'scandinavian_living_02': true,
    'contemporary_living_04': true,
    'open_plan_living_01': true,
    
    // Exterior inspirations
    'modern_exterior_02': true,
    'contemporary_facade_03': true,
    'minimalist_exterior_01': true,
    
    // Garden/outdoor inspirations
    'japanese_garden_04': true,
    'modern_landscape_02': true,
    'sustainable_garden_03': true,
    
    // Material inspirations
    'sustainable_materials_01': true,
    'natural_materials_03': true,
    'warm_materials_02': true,
    
    // Additional categories
    'bedroom_02': true,
    'home_office_03': true,
    'media_room_01': true,
    'indoor_outdoor_flow_04': true,
    'lighting_design_02': true
  };
  
  return {
    uploadedFiles,
    inspirationImages,
    inspirationSelections
  };
};
