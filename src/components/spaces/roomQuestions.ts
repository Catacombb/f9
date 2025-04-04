
export const roomSpecificQuestions = {
  Office: [
    {
      id: 'workFromHome',
      question: 'Do you work from home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'officeType',
          question: 'Do you need a dedicated office, shared space, or adaptable work area?',
          type: 'select',
          options: ['Dedicated Office', 'Shared Space', 'Adaptable Work Area']
        }
      ]
    }
  ],
  Kitchen: [
    {
      id: 'kitchenType',
      question: 'Should the kitchen be open and designed for social gatherings, or include high-performance appliances for serious cooking?',
      type: 'select',
      options: ['Social Gathering Space', 'Serious Cooking Space', 'Both']
    },
    {
      id: 'kitchenLayout',
      question: 'Do you envision a kitchen that is open to other spaces or enclosed and separate?',
      type: 'select',
      options: ['Open to Other Spaces', 'Enclosed and Separate']
    },
    {
      id: 'kitchenUse',
      question: 'Will it also be a place to eat, or just for food preparation?',
      type: 'select',
      options: ['Also for Eating', 'Just for Food Preparation', 'Both']
    }
  ],
  Living: [
    {
      id: 'entertainmentFocus',
      question: 'Is TV, movie viewing, or music a focus in your home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'entertainmentDesign',
          question: 'Should it be incorporated into the design?',
          type: 'boolean'
        },
        {
          id: 'entertainmentSpace',
          question: 'How does it relate to your living spaces?',
          type: 'select',
          options: ['Separate Space', 'Integrated with Living Areas']
        }
      ]
    },
    {
      id: 'acousticNeeds',
      question: 'Do you have any acoustic needs or large instruments to accommodate (e.g., piano, drums)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'instrumentDetails',
          question: 'What instruments do you need to accommodate?',
          type: 'text'
        }
      ]
    }
  ],
  Media: [
    {
      id: 'entertainmentFocus',
      question: 'Is TV, movie viewing, or music a focus in your home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'entertainmentDesign',
          question: 'Should it be incorporated into the design?',
          type: 'boolean'
        },
        {
          id: 'entertainmentSpace',
          question: 'How does it relate to your living spaces?',
          type: 'select',
          options: ['Separate Space', 'Integrated with Living Areas']
        }
      ]
    },
    {
      id: 'acousticNeeds',
      question: 'Do you have any acoustic needs or large instruments to accommodate (e.g., piano, drums)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'instrumentDetails',
          question: 'What instruments do you need to accommodate?',
          type: 'text'
        }
      ]
    }
  ],
  Library: [
    {
      id: 'readingForPleasure',
      question: 'Do you enjoy reading for pleasure?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'readingSpace',
          question: 'Would you like a cozy reading nook or dedicated space for bookshelves?',
          type: 'select',
          options: ['Cozy Reading Nook', 'Dedicated Space for Bookshelves', 'Both']
        }
      ]
    }
  ],
  Gym: [
    {
      id: 'specialEquipment',
      question: 'Do you have any specialized equipment (e.g., exercise gear)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'equipmentStorage',
          question: 'Would you like dedicated storage or usage space for them?',
          type: 'select',
          options: ['Dedicated Storage', 'Usage Space', 'Both']
        }
      ]
    }
  ],
  Garage: [
    {
      id: 'specialEquipment',
      question: 'Do you have any specialized equipment (e.g., workshop tools, hobby supplies)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'equipmentStorage',
          question: 'Would you like dedicated storage or usage space for them?',
          type: 'select',
          options: ['Dedicated Storage', 'Usage Space', 'Both']
        }
      ]
    }
  ]
};
