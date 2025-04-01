
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormData, ProjectFiles, BriefSummary, ProjectData, SectionKey, SpaceRoom, Professional } from '@/types';

// Default values for the form
const defaultFormData: FormData = {
  projectInfo: {
    clientName: '',
    projectAddress: '',
    contactEmail: '',
    contactPhone: '',
    projectType: '',
    projectDescription: '',
    coordinates: undefined,
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
  },
  contractors: {
    preferredBuilder: '',
    goToTender: false,
    professionals: [],
    additionalNotes: '',
  },
  communication: {
    preferredMethods: [], // Changed from a single value to an array
    bestTimes: [],
    availableDays: [],
    frequency: '',
    urgentContact: '',
    responseTime: '',
    additionalNotes: '',
  }
};

const defaultProjectFiles: ProjectFiles = {
  uploadedFiles: [],
  uploadedInspirationImages: [],
  inspirationSelections: [],
};

const defaultBriefSummary: BriefSummary = {
  generatedSummary: '',
  editedSummary: '',
};

// Define the context type
interface DesignBriefContextType {
  formData: FormData;
  files: ProjectFiles;
  summary: BriefSummary;
  currentSection: SectionKey;
  lastSaved: string | null;
  updateFormData: (sectionKey: keyof FormData, data: any) => void;
  updateFiles: (files: Partial<ProjectFiles>) => void;
  updateSummary: (summary: Partial<BriefSummary>) => void;
  setCurrentSection: (section: SectionKey) => void;
  resetForm: () => void;
  generateSummary: () => Promise<string>;
  sendByEmail: (recipientEmail: string) => Promise<boolean>;
  exportAsPDF: () => Promise<void>;
  addRoom: (room: Omit<SpaceRoom, 'id'>) => string;
  updateRoom: (room: SpaceRoom) => void;
  removeRoom: (roomId: string) => void;
  addProfessional: (professional: Omit<Professional, 'id'>) => string;
  updateProfessional: (professional: Professional) => void;
  removeProfessional: (professionalId: string) => void;
}

// Create the context
const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

// Create a provider component
export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [files, setFiles] = useState<ProjectFiles>(defaultProjectFiles);
  const [summary, setSummary] = useState<BriefSummary>(defaultBriefSummary);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('designBriefData');
    if (savedData) {
      try {
        const parsedData: ProjectData = JSON.parse(savedData);
        setFormData(parsedData.formData || defaultFormData);
        setSummary(parsedData.summary || defaultBriefSummary);
        
        // We can't store actual File objects in localStorage, so we only restore the inspirationSelections
        setFiles({
          uploadedFiles: [],
          uploadedInspirationImages: [],
          inspirationSelections: parsedData.files?.inspirationSelections || [],
        });
        
        if (parsedData.currentSection) {
          setCurrentSection(parsedData.currentSection as SectionKey);
        }
        
        setLastSaved(parsedData.lastSaved || new Date().toISOString());
      } catch (error) {
        console.error('Error parsing saved design brief data', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const now = new Date().toISOString();
    setLastSaved(now);
    
    const dataToSave: ProjectData = {
      formData,
      files: {
        uploadedFiles: [], // We don't save File objects to localStorage
        uploadedInspirationImages: [], // We don't save File objects to localStorage
        inspirationSelections: files.inspirationSelections,
      },
      summary,
      lastSaved: now,
      currentSection,
    };
    
    localStorage.setItem('designBriefData', JSON.stringify(dataToSave));
  }, [formData, files.inspirationSelections, summary, currentSection]);

  // Update form data for a specific section
  const updateFormData = (sectionKey: keyof FormData, data: any) => {
    setFormData(prevData => ({
      ...prevData,
      [sectionKey]: {
        ...prevData[sectionKey],
        ...data,
      },
    }));
  };

  // Update files state
  const updateFiles = (newFiles: Partial<ProjectFiles>) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      ...newFiles,
    }));
  };

  // Update summary state
  const updateSummary = (newSummary: Partial<BriefSummary>) => {
    setSummary(prevSummary => ({
      ...prevSummary,
      ...newSummary,
    }));
  };

  // Reset the form to default values
  const resetForm = () => {
    setFormData(defaultFormData);
    setFiles(defaultProjectFiles);
    setSummary(defaultBriefSummary);
    setCurrentSection('intro');
    localStorage.removeItem('designBriefData');
  };

  // Spaces section methods
  const addRoom = (room: Omit<SpaceRoom, 'id'>) => {
    const id = crypto.randomUUID();
    const newRoom: SpaceRoom = { ...room, id };
    
    setFormData(prevData => ({
      ...prevData,
      spaces: {
        ...prevData.spaces,
        rooms: [...prevData.spaces.rooms, newRoom],
      },
    }));
    
    return id;
  };
  
  const updateRoom = (room: SpaceRoom) => {
    setFormData(prevData => ({
      ...prevData,
      spaces: {
        ...prevData.spaces,
        rooms: prevData.spaces.rooms.map(r => 
          r.id === room.id ? room : r
        ),
      },
    }));
  };
  
  const removeRoom = (roomId: string) => {
    setFormData(prevData => ({
      ...prevData,
      spaces: {
        ...prevData.spaces,
        rooms: prevData.spaces.rooms.filter(r => r.id !== roomId),
      },
    }));
  };

  // Contractors section methods
  const addProfessional = (professional: Omit<Professional, 'id'>) => {
    const id = crypto.randomUUID();
    const newProfessional: Professional = { ...professional, id };
    
    setFormData(prevData => ({
      ...prevData,
      contractors: {
        ...prevData.contractors,
        professionals: [...prevData.contractors.professionals, newProfessional],
      },
    }));
    
    return id;
  };
  
  const updateProfessional = (professional: Professional) => {
    setFormData(prevData => ({
      ...prevData,
      contractors: {
        ...prevData.contractors,
        professionals: prevData.contractors.professionals.map(p => 
          p.id === professional.id ? professional : p
        ),
      },
    }));
  };
  
  const removeProfessional = (professionalId: string) => {
    setFormData(prevData => ({
      ...prevData,
      contractors: {
        ...prevData.contractors,
        professionals: prevData.contractors.professionals.filter(p => p.id !== professionalId),
      },
    }));
  };

  // Generate an AI summary based on the form data
  const generateSummary = async (): Promise<string> => {
    // For MVP, we'll create a simple summary from the form data
    // In a real app, this would call an AI service
    try {
      // Create a simple summary by concatenating key information
      const summaryText = `
Design Brief Summary for ${formData.projectInfo.clientName}

Project Address: ${formData.projectInfo.projectAddress}

Project Type: ${formData.projectInfo.projectType}

Overview: ${formData.projectInfo.projectDescription}

Budget: ${formData.budget.budgetRange}
${formData.budget.flexibilityNotes ? `Budget Notes: ${formData.budget.flexibilityNotes}` : ''}
${formData.budget.priorityAreas ? `Priority Areas: ${formData.budget.priorityAreas}` : ''}
${formData.budget.timeframe ? `Timeframe: ${formData.budget.timeframe}` : ''}

Lifestyle Considerations:
${formData.lifestyle.occupants ? `• Occupants: ${formData.lifestyle.occupants}` : ''}
${formData.lifestyle.occupationDetails ? `• Occupations: ${formData.lifestyle.occupationDetails}` : ''}
${formData.lifestyle.dailyRoutine ? `• Daily Routines: ${formData.lifestyle.dailyRoutine}` : ''}
${formData.lifestyle.entertainmentStyle ? `• Entertainment Style: ${formData.lifestyle.entertainmentStyle}` : ''}
${formData.lifestyle.specialRequirements ? `• Special Requirements: ${formData.lifestyle.specialRequirements}` : ''}

Spaces Required:
${formData.spaces.rooms.length > 0 
  ? formData.spaces.rooms.map(room => 
      `• ${room.quantity} ${room.type}${room.quantity > 1 ? 's' : ''}: ${room.description || 'No specific requirements'}`
    ).join('\n')
  : '• No spaces defined yet'}

${formData.spaces.additionalNotes ? `\nAdditional Space Notes: ${formData.spaces.additionalNotes}` : ''}

Site Analysis:
${formData.site.existingConditions ? `• Existing Conditions: ${formData.site.existingConditions}` : ''}
${formData.site.siteFeatures ? `• Site Features: ${formData.site.siteFeatures}` : ''}
${formData.site.viewsOrientations ? `• Views/Orientations: ${formData.site.viewsOrientations}` : ''}
${formData.site.accessConstraints ? `• Access Constraints: ${formData.site.accessConstraints}` : ''}
${formData.site.neighboringProperties ? `• Neighboring Properties: ${formData.site.neighboringProperties}` : ''}

Architectural Preferences:
${formData.architecture.stylePrefences ? `• Style Preferences: ${formData.architecture.stylePrefences}` : ''}
${formData.architecture.externalMaterials ? `• External Materials: ${formData.architecture.externalMaterials}` : ''}
${formData.architecture.internalFinishes ? `• Internal Finishes: ${formData.architecture.internalFinishes}` : ''}
${formData.architecture.sustainabilityGoals ? `• Sustainability Goals: ${formData.architecture.sustainabilityGoals}` : ''}
${formData.architecture.specialFeatures ? `• Special Features: ${formData.architecture.specialFeatures}` : ''}

Contractors & Professionals:
${formData.contractors.preferredBuilder ? `• Preferred Builder: ${formData.contractors.preferredBuilder}` : ''}
${formData.contractors.goToTender ? '• Client would like to go to tender for builder selection' : ''}
${formData.contractors.professionals.length > 0 
  ? '\nOther Professionals:\n' + formData.contractors.professionals.map(prof => 
      `• ${prof.type}: ${prof.name}${prof.contact ? ` (${prof.contact})` : ''}${prof.notes ? `\n  Note: ${prof.notes}` : ''}`
    ).join('\n')
  : ''}
${formData.contractors.additionalNotes ? `\nAdditional Contractor Notes: ${formData.contractors.additionalNotes}` : ''}

Communication Preferences:
${formData.communication.preferredMethod ? `• Preferred Contact Method: ${formData.communication.preferredMethod}` : ''}
${formData.communication.bestTimes?.length > 0 
  ? `• Best Times for Contact: ${formData.communication.bestTimes.join(', ')}` : ''}
${formData.communication.availableDays?.length > 0 
  ? `• Available Days: ${formData.communication.availableDays.join(', ')}` : ''}
${formData.communication.frequency ? `• Communication Frequency: ${formData.communication.frequency}` : ''}
${formData.communication.urgentContact ? `• Urgent Contact Method: ${formData.communication.urgentContact}` : ''}
${formData.communication.responseTime ? `• Preferred Response Time: ${formData.communication.responseTime}` : ''}
${formData.communication.additionalNotes ? `• Additional Notes: ${formData.communication.additionalNotes}` : ''}

This project summary reflects the client's input to date. Further consultation may reveal additional requirements or modifications to these initial preferences.
      `;

      // Update the summary state
      updateSummary({
        generatedSummary: summaryText,
        editedSummary: summaryText
      });

      return summaryText;
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Error generating summary. Please try again later.';
    }
  };

  // Send the brief by email
  const sendByEmail = async (recipientEmail: string): Promise<boolean> => {
    // For MVP, we'll just simulate email sending
    // In a real app, this would call an API endpoint or email service
    try {
      console.log('Sending email to:', recipientEmail);
      
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Email sent successfully');
          resolve(true);
        }, 1500);
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  // Export the brief as a PDF
  const exportAsPDF = async (): Promise<void> => {
    // For MVP, we'll just simulate PDF export
    // In a real app, this would generate a PDF using a library
    try {
      console.log('Exporting brief as PDF');
      
      // Simulate PDF generation
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('PDF generated successfully');
          
          // Create a title for the PDF using client name and address
          const pdfTitle = `Northstar Brief - ${formData.projectInfo.clientName} - ${formData.projectInfo.projectAddress}`;
          console.log('PDF Title:', pdfTitle);
          
          resolve();
        }, 1500);
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  // Create the context value object
  const contextValue: DesignBriefContextType = {
    formData,
    files,
    summary,
    currentSection,
    lastSaved,
    updateFormData,
    updateFiles,
    updateSummary,
    setCurrentSection,
    resetForm,
    generateSummary,
    sendByEmail,
    exportAsPDF,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional
  };

  return (
    <DesignBriefContext.Provider value={contextValue}>
      {children}
    </DesignBriefContext.Provider>
  );
};

// Custom hook to use the context
export const useDesignBrief = () => {
  const context = useContext(DesignBriefContext);
  if (context === undefined) {
    throw new Error('useDesignBrief must be used within a DesignBriefProvider');
  }
  return context;
};
