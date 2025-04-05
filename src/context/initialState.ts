
import { ProjectData } from '@/types';

export const initialProjectData: ProjectData = {
  formData: {
    projectInfo: {
      clientName: '',
      projectAddress: '',
      contactEmail: '',
      contactPhone: '',
      projectType: '',
      projectDescription: '',
      moveInPreference: '',
      projectGoals: '',
      moveInDate: '',
    },
    budget: {
      budgetRange: '',
      flexibilityNotes: '',
      priorityAreas: '',
      timeframe: '',
      budgetFlexibility: '',
      budgetPriorities: [],
      budgetNotes: ''
    },
    lifestyle: {
      occupants: '',
      occupationDetails: '',
      dailyRoutine: '',
      entertainmentStyle: '',
      specialRequirements: '',
      pets: '',
      specialNeeds: '',
      hobbies: [],
      entertaining: '',
      workFromHome: '',
      lifestyleNotes: ''
    },
    site: {
      existingConditions: '',
      siteFeatures: [],
      viewsOrientations: '',
      accessConstraints: '',
      neighboringProperties: '',
      topographicSurvey: '',
      existingHouseDrawings: '',
      septicDesign: '',
      certificateOfTitle: '',
      covenants: '',
      siteConstraints: [],
      siteAccess: '',
      siteViews: '',
      outdoorSpaces: [],
      siteNotes: ''
    },
    spaces: {
      rooms: [],
      additionalNotes: '',
      roomTypes: [],
      specialSpaces: [],
      storageNeeds: '',
      spatialRelationships: '',
      accessibilityNeeds: '',
      spacesNotes: '',
      homeLevelType: '',
      levelAssignmentNotes: '',
      homeSize: '',
      eliminableSpaces: '',
      roomArrangement: ''
    },
    architecture: {
      stylePrefences: '',
      externalMaterials: '',
      internalFinishes: '',
      sustainabilityGoals: '',
      specialFeatures: '',
      inspirationNotes: '',
      preferredStyles: [],
      materialPreferences: [],
      sustainabilityFeatures: [],
      technologyRequirements: [],
      architectureNotes: '',
      externalMaterialsSelected: [],
      internalMaterialsSelected: []
    },
    contractors: {
      preferredBuilder: '',
      goToTender: false,
      professionals: [],
      additionalNotes: ''
    },
    communication: {
      preferredMethods: [],
      bestTimes: [],
      availableDays: [],
      frequency: '',
      urgentContact: '',
      responseTime: '',
      additionalNotes: '',
      communicationNotes: ''
    },
    feedback: {
      usabilityRating: 0,
      performanceRating: 0,
      functionalityRating: 0,
      designRating: 0,
      likeMost: '',
      improvements: '',
      nextFeature: '',
      additionalFeedback: '',
      customVersionInterest: '',
      userRole: [],
      otherRoleSpecify: '',
      teamSize: '',
      wouldRecommend: '',
      canContact: '',
      contactInfo: '',
      feedbackComments: '' // Keep for backward compatibility
    }
  },
  files: {
    uploadedFiles: [],
    uploadedInspirationImages: [],
    inspirationSelections: [],
    siteDocuments: []
  },
  summary: {
    generatedSummary: '',
    editedSummary: ''
  },
  lastSaved: new Date().toISOString(),
  currentSection: 'intro',
};
