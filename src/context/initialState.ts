
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
      moveInPreference: 'as_soon_as_possible',
    },
    budget: {
      budgetRange: '',
      flexibilityNotes: '',
      priorityAreas: '',
      timeframe: '',
    },
    lifestyle: {
      occupants: '',
      occupationDetails: '',
      dailyRoutine: '',
      entertainmentStyle: '',
      specialRequirements: '',
    },
    site: {
      existingConditions: '',
      siteFeatures: '',
      viewsOrientations: '',
      accessConstraints: '',
      neighboringProperties: '',
      topographicSurvey: '',
      existingHouseDrawings: '',
      septicDesign: '',
      certificateOfTitle: '',
      covenants: '',
    },
    spaces: {
      rooms: [],
      additionalNotes: '',
    },
    architecture: {
      stylePrefences: '',
      externalMaterials: '',
      internalFinishes: '',
      sustainabilityGoals: '',
      specialFeatures: '',
      inspirationNotes: '',
    },
    contractors: {
      preferredBuilder: '',
      goToTender: false,
      professionals: [],
      additionalNotes: '',
    },
    communication: {
      preferredMethods: [],
      bestTimes: [],
      availableDays: [],
      frequency: '',
      urgentContact: '',
      responseTime: '',
      additionalNotes: '',
    },
  },
  files: {
    uploadedFiles: [],
    uploadedInspirationImages: [],
    inspirationSelections: [],
    siteDocuments: [], // Initialize the siteDocuments array
  },
  summary: {
    generatedSummary: '',
    editedSummary: '',
  },
  lastSaved: new Date().toISOString(),
  currentSection: 'intro',
};
