
import { ProjectData } from "@/types";

export const generateTestData = (): Partial<ProjectData['formData']> => {
  return {
    projectInfo: {
      clientName: "Test User",
      projectAddress: "123 Test Street, Test City",
      contactEmail: "test@example.com",
      contactPhone: "555-123-4567",
      projectType: "new_build",
      projectDescription: "This is a test project description generated for testing purposes.",
      coordinates: [51.505, -0.09] // Example coordinates (London)
    },
    budget: {
      budgetRange: "100000-150000",
      flexibilityNotes: "Flexible on finishing materials, prioritizing structural elements",
      priorityAreas: "Kitchen and main bathroom",
      timeframe: "6-8 months"
    },
    lifestyle: {
      occupants: "2 adults, 1 child, 1 dog",
      projectTimeframe: "Starting in 3 months",
      occupationDetails: "Work from home professionals",
      dailyRoutine: "Early risers, active lifestyle",
      entertainmentStyle: "Frequent small gatherings",
      specialRequirements: "Home office needs, child-friendly spaces"
    },
    spaces: {
      rooms: [
        {
          id: crypto.randomUUID(),
          type: "bedroom",
          quantity: 3,
          description: "Master bedroom with ensuite, two standard bedrooms",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "bathroom",
          quantity: 2,
          description: "One main bathroom, one ensuite",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "living",
          quantity: 1,
          description: "Open plan living area",
          isCustom: false
        },
        {
          id: crypto.randomUUID(),
          type: "kitchen",
          quantity: 1,
          description: "Modern kitchen with island",
          isCustom: false
        }
      ],
      additionalNotes: "Need good flow between kitchen and living areas"
    },
    site: {
      existingConditions: "Flat site with existing structure",
      siteFeatures: "Large garden to the north, mature trees",
      viewsOrientations: "Good northern exposure, views to hills in west",
      accessConstraints: "Narrow driveway, limited street parking",
      neighboringProperties: "Two-story houses on either side, park at rear",
      topographicSurvey: "Available",
      existingHouseDrawings: "Partially available",
      septicDesign: "Not required - city sewage",
      certificateOfTitle: "Available",
      covenants: "Height restrictions apply"
    },
    architecture: {
      stylePrefences: "Modern minimalist with warm materials",
      externalMaterials: "Wood cladding, concrete, large glazing",
      internalFinishes: "Concrete floors, white walls, timber accents",
      sustainabilityGoals: "Solar-ready, high insulation, rainwater collection",
      specialFeatures: "Double-height living space, indoor-outdoor flow"
    },
    contractors: {
      preferredBuilder: "Test Builder",
      goToTender: true,
      professionals: [
        {
          id: crypto.randomUUID(),
          name: "Test Architect",
          type: "architect", // Changed 'role' to 'type'
          contact: "architect@test.com",
          company: "Test Architecture Ltd"
        },
        {
          id: crypto.randomUUID(),
          name: "Test Engineer",
          type: "structural_engineer", // Changed 'role' to 'type'
          contact: "engineer@test.com",
          company: "Test Engineering Ltd"
        }
      ],
      additionalNotes: "Would like to involve landscape designer at later stage"
    },
    communication: {
      preferredMethods: ["email", "phone"],
      bestTimes: ["morning", "evening"],
      availableDays: ["monday", "wednesday", "friday"],
      frequency: "weekly",
      urgentContact: "Phone or text message",
      responseTime: "Within 24 hours for non-urgent matters",
      additionalNotes: "Prefer detailed written summaries after major decisions"
    }
  };
};
