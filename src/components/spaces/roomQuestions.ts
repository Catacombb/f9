export const roomSpecificQuestions = {
  Bedroom: [
    {
      id: 'furnitureNeeds',
      question: 'Are there specific furniture needs?',
      type: 'select',
      options: ['King Bed', 'Queen Bed', 'Twin Beds', 'Workspace', 'Seating Area', 'Other']
    },
    {
      id: 'directAccess',
      question: 'Do you want this room to have direct access to outdoor space or an ensuite?',
      type: 'select',
      options: ['Outdoor Access', 'Ensuite', 'Both', 'Neither']
    },
    {
      id: 'importantAspect',
      question: 'Is privacy or morning/evening sun more important in this room?',
      type: 'select',
      options: ['Privacy', 'Morning Sun', 'Evening Sun', 'Both Equally Important']
    }
  ],
  Bathroom: [
    {
      id: 'bathroomUse',
      question: 'Is this bathroom for guests, family, or private use?',
      type: 'select',
      options: ['Guest Use', 'Family Use', 'Private Use']
    },
    {
      id: 'fixturePreference',
      question: 'Do you prefer a shower, bath, or both?',
      type: 'select',
      options: ['Shower Only', 'Bath Only', 'Both Shower and Bath']
    },
    {
      id: 'accessibilityNeeds',
      question: 'Any accessibility needs?',
      type: 'select',
      options: ['Walk-in Shower', 'Handrails', 'Wider Doorways', 'None']
    },
    {
      id: 'bathroomExtras',
      question: 'Would you like any extras?',
      type: 'select',
      options: ['Underfloor Heating', 'Double Vanity', 'Natural Light', 'Storage', 'None']
    }
  ],
  Powder: [
    {
      id: 'powderUse',
      question: 'Will this space be used regularly by guests?',
      type: 'boolean'
    },
    {
      id: 'designStatement',
      question: 'Should it reflect a unique mood or design statement?',
      type: 'boolean'
    },
    {
      id: 'proximityImportant',
      question: 'Is proximity to the main living/entertaining areas important?',
      type: 'boolean'
    }
  ],
  Living: [
    {
      id: 'livingUse',
      question: 'How do you use your main living space day-to-day?',
      type: 'select',
      options: ['Family Gathering', 'Entertaining', 'Relaxing', 'All of the Above']
    },
    {
      id: 'livingFeel',
      question: 'Should it feel open and social or more cozy and enclosed?',
      type: 'select',
      options: ['Open and Social', 'Cozy and Enclosed', 'Balance of Both']
    },
    {
      id: 'livingFeatures',
      question: 'Are any of these features important?',
      type: 'select',
      options: ['Fireplace', 'Large Windows', 'Indoor-Outdoor Flow', 'All of the Above']
    },
    {
      id: 'livingMood',
      question: 'What kind of mood should this space create?',
      type: 'select',
      options: ['Calm and Relaxing', 'Vibrant and Energetic', 'Formal and Elegant', 'Warm and Cozy']
    }
  ],
  Kitchen: [
    {
      id: 'kitchenType',
      question: 'Should the kitchen be open and social, or performance-focused and enclosed?',
      type: 'select',
      options: ['Open and Social', 'Performance-Focused', 'Balance of Both']
    },
    {
      id: 'kitchenUse',
      question: 'Will it also be used for casual dining, or just food preparation?',
      type: 'select',
      options: ['Also for Casual Dining', 'Just for Food Preparation', 'Both']
    },
    {
      id: 'kitchenAreas',
      question: 'Do you need a scullery, walk-in pantry, or other prep areas?',
      type: 'select',
      options: ['Scullery', 'Walk-in Pantry', 'Both', 'Neither']
    },
    {
      id: 'kitchenNeeds',
      question: 'Are there specific appliances or storage needs we should consider?',
      type: 'text'
    }
  ],
  Dining: [
    {
      id: 'diningType',
      question: 'Is this a formal, casual, or flexible dining space?',
      type: 'select',
      options: ['Formal', 'Casual', 'Flexible']
    },
    {
      id: 'seatingCapacity',
      question: 'How many people should it accommodate comfortably?',
      type: 'select',
      options: ['2-4 People', '6-8 People', '8-12 People', '12+ People']
    },
    {
      id: 'diningConnections',
      question: 'Should it connect directly to the kitchen, outdoors, or both?',
      type: 'select',
      options: ['Kitchen', 'Outdoors', 'Both', 'Neither']
    },
    {
      id: 'builtInStorage',
      question: 'Would you like built-in storage or buffet-style cabinetry?',
      type: 'boolean'
    }
  ],
  Office: [
    {
      id: 'workFromHome',
      question: 'Do you work from home regularly?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'officeType',
          question: 'Would you like a dedicated office, a shared zone, or a flexible setup?',
          type: 'select',
          options: ['Dedicated Office', 'Shared Zone', 'Flexible Setup']
        }
      ]
    },
    {
      id: 'quietArea',
      question: 'Should it be in a quiet area of the house?',
      type: 'boolean'
    },
    {
      id: 'officeNeeds',
      question: 'Will you need space for meetings, dual monitors, or equipment?',
      type: 'select',
      options: ['Meetings', 'Dual Monitors', 'Equipment', 'All of the Above', 'None']
    }
  ],
  Garage: [
    {
      id: 'vehicleCount',
      question: 'How many car spaces do you want in the garage?',
      type: 'select',
      options: ['1', '2', '3', '4+']
    },
    {
      id: 'garageUse',
      question: 'Should it also include a workshop, equipment storage, or utility zone?',
      type: 'select',
      options: ['Workshop', 'Equipment Storage', 'Utility Zone', 'Multiple Uses', 'Just for Vehicles']
    },
    {
      id: 'internalAccess',
      question: 'Do you want internal access to the home from here?',
      type: 'boolean'
    },
    {
      id: 'garageVisibility',
      question: 'Should the garage be hidden from view or on display?',
      type: 'select',
      options: ['Hidden from View', 'On Display']
    }
  ],
  Media: [
    {
      id: 'mediaUse',
      question: 'Is this space for TV, movies, music, or all three?',
      type: 'select',
      options: ['TV', 'Movies', 'Music', 'All Three']
    },
    {
      id: 'soundTreatment',
      question: 'Should it be soundproofed or acoustically treated?',
      type: 'boolean'
    },
    {
      id: 'mediaEquipment',
      question: 'What kind of equipment will be used?',
      type: 'select',
      options: ['Surround Sound', 'Projector', 'Gaming Console', 'All of the Above', 'Other']
    },
    {
      id: 'mediaLayout',
      question: 'Do you want it open to other spaces or completely separate?',
      type: 'select',
      options: ['Open to Other Spaces', 'Completely Separate']
    }
  ],
  Library: [
    {
      id: 'dedicatedReading',
      question: 'Do you enjoy reading in dedicated spaces?',
      type: 'boolean'
    },
    {
      id: 'libraryType',
      question: 'Would you prefer a cozy nook or a full wall of shelving?',
      type: 'select',
      options: ['Cozy Nook', 'Full Wall of Shelving', 'Both']
    },
    {
      id: 'dualFunction',
      question: 'Should this room double as another function?',
      type: 'select',
      options: ['Lounge', 'Office', 'Both', 'Neither']
    },
    {
      id: 'lightingPreference',
      question: 'Do you want natural light, moody lighting, or blackout options?',
      type: 'select',
      options: ['Natural Light', 'Moody Lighting', 'Blackout Options', 'Multiple Options']
    }
  ],
  Gym: [
    {
      id: 'fitnessActivities',
      question: 'What kind of fitness or wellness activities will take place here?',
      type: 'text'
    },
    {
      id: 'equipmentNeeds',
      question: 'Do you have specific equipment that requires space, ceiling height, or layout planning?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'equipmentDetails',
          question: 'Please describe your equipment needs:',
          type: 'text'
        }
      ]
    },
    {
      id: 'gymFeatures',
      question: 'Should it include ventilation, mirrors, or soundproofing?',
      type: 'select',
      options: ['Ventilation', 'Mirrors', 'Soundproofing', 'All of the Above', 'None']
    },
    {
      id: 'gymUsage',
      question: 'Will this be used solo or shared by family members?',
      type: 'select',
      options: ['Solo Use', 'Shared Use']
    }
  ]
};

// Add the missing getRoomQuestions function
export function getRoomQuestions(roomType: string) {
  const roomTypeKey = roomType as keyof typeof roomSpecificQuestions;
  
  if (roomSpecificQuestions[roomTypeKey]) {
    // Transform the array of question objects into a more usable format for the RoomItem component
    return roomSpecificQuestions[roomTypeKey].map(question => ({
      id: question.id,
      label: question.question,
      type: question.type === 'select' ? 'select' : 'checkbox',
      placeholder: `Select ${question.question.toLowerCase()}`,
      checkboxLabel: question.question,
      options: question.type === 'select' ? 
        question.options.map((option: string) => ({ 
          value: option.toLowerCase().replace(/\s+/g, '-'), 
          label: option 
        })) : 
        undefined
    }));
  }
  
  // Return empty array if room type not found
  return [];
}
