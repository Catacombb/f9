import { saveProject } from '../services/projectService';

/**
 * This test function demonstrates the file reconciliation feature
 * It will create a minimal project data structure that doesn't include
 * the test file we created, then call saveProject which should
 * detect and delete the orphaned file.
 */
export async function testFileReconciliation() {
  try {
    // Use the project ID that contains our test file
    const projectId = 'the-project-id-from-test'; // Replace with actual project ID
    
    // Create minimal project data that doesn't include the test file
    const projectData = {
      projectId,
      formData: {
        projectInfo: {
          clientName: 'Reconciliation Test',
          projectAddress: '',
          contactEmail: '',
          contactPhone: '',
          projectType: '',
          projectDescription: '',
          moveInPreference: '',
          moveInDate: '',
          projectGoals: '',
          coordinates: undefined
        },
        budget: {
          budgetRange: '',
          flexibilityNotes: '',
          priorityAreas: '',
          timeframe: '',
          budgetFlexibility: undefined,
          budgetPriorities: undefined,
          budgetNotes: undefined
        },
        lifestyle: { occupantEntries: [] },
        site: {},
        spaces: { rooms: [] },
        architecture: { inspirationEntries: [] },
        contractors: { professionals: [] },
        communication: {},
        feedback: {}
      },
      files: {
        // Empty files array - our test file should be detected as orphaned
        uploadedFiles: [],
        uploadedInspirationImages: [],
        inspirationSelections: [],
        siteDocuments: [], // The test file we created is in this category
        inspirationFiles: [],
        supportingDocuments: [],
        sitePhotos: [],
        designFiles: []
      },
      summary: {
        generatedSummary: '',
        editedSummary: ''
      }
    };
    
    // Call saveProject which should trigger reconciliation
    const result = await saveProject(projectData, 'test-user-id', projectId);
    
    console.log('Reconciliation test result:', result);
    return result;
  } catch (error) {
    console.error('Error in reconciliation test:', error);
    return { success: false, error };
  }
} 