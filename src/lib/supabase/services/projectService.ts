import { supabase } from '@/lib/supabase/schema';
import { FormData, ProjectData, SectionKey, SpaceRoom, Professional, InspirationEntry, OccupantEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define type for project settings to match the database schema
interface ProjectSettings {
  budget_flexibility?: string | null;
  budget_priorities?: string[] | null;
  budget_notes?: string | null;
  lifestyle_notes?: string | null;
  home_feeling?: string | null;
  site_constraints?: string[] | null;
  site_access?: string | null;
  site_views?: string | null;
  outdoor_spaces?: string[] | null;
  site_notes?: string | null;
  home_level_type?: string | null;
  level_assignment_notes?: string | null;
  home_size?: string | null;
  eliminable_spaces?: string | null;
  room_arrangement?: string | null;
  preferred_styles?: string[] | null;
  material_preferences?: string[] | null;
  external_materials_selected?: string[] | null;
  internal_materials_selected?: string[] | null;
  sustainability_features?: string[] | null;
  technology_requirements?: string[] | null; // Fixed: changed from string to string[]
  architecture_notes?: string | null;
  communication_notes?: string | null;
}

/**
 * Saves a project to Supabase
 * @param projectData The project data to save
 * @param userId The ID of the user saving the project
 * @param projectId Optional project ID. If provided, the function will update that project.
 *                   If not provided, it will check if a project ID exists in the project data.
 * @returns An object containing success status and project ID
 */
export async function saveProject(projectData: ProjectData, userId: string, projectId?: string) {
  try {
    // First, check if the project exists to determine if we're creating or updating
    let resolvedProjectId = projectId || '';
    let isNewProject = true;
    
    // If no projectId was provided, check if we have one in the project data
    if (!resolvedProjectId && projectData.projectId) {
      resolvedProjectId = projectData.projectId;
    }
    
    // If we have a projectId, check if the project exists and belongs to the user
    if (resolvedProjectId) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('id', resolvedProjectId)
        .eq('user_id', userId)
        .single();
      
      if (existingProject) {
        isNewProject = false;
      } else {
        // If project doesn't exist or doesn't belong to user, treat as new project
        resolvedProjectId = '';
        isNewProject = true;
      }
    }
    
    // If it's a new project, create the project record
    if (isNewProject) {
      resolvedProjectId = uuidv4();
      
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: resolvedProjectId,
          user_id: userId,
          client_name: projectData.formData.projectInfo.clientName,
          project_address: projectData.formData.projectInfo.projectAddress,
          contact_email: projectData.formData.projectInfo.contactEmail,
          contact_phone: projectData.formData.projectInfo.contactPhone,
          project_type: projectData.formData.projectInfo.projectType,
          project_description: projectData.formData.projectInfo.projectDescription,
          budget_range: projectData.formData.budget.budgetRange,
          move_in_preference: projectData.formData.projectInfo.moveInPreference,
          move_in_date: projectData.formData.projectInfo.moveInDate,
          project_goals: projectData.formData.projectInfo.projectGoals,
          coordinates: projectData.formData.projectInfo.coordinates
        });
      
      if (projectError) {
        throw new Error(`Error creating project: ${projectError.message}`);
      }
    } else {
      // Update the existing project
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          client_name: projectData.formData.projectInfo.clientName,
          project_address: projectData.formData.projectInfo.projectAddress,
          contact_email: projectData.formData.projectInfo.contactEmail,
          contact_phone: projectData.formData.projectInfo.contactPhone,
          project_type: projectData.formData.projectInfo.projectType,
          project_description: projectData.formData.projectInfo.projectDescription,
          budget_range: projectData.formData.budget.budgetRange,
          move_in_preference: projectData.formData.projectInfo.moveInPreference,
          move_in_date: projectData.formData.projectInfo.moveInDate,
          project_goals: projectData.formData.projectInfo.projectGoals,
          coordinates: projectData.formData.projectInfo.coordinates,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedProjectId);
      
      if (projectError) {
        throw new Error(`Error updating project: ${projectError.message}`);
      }
    }
    
    // Now handle all the related tables
    
    // Save project settings
    const settings: ProjectSettings = {
      // Budget settings
      budget_flexibility: projectData.formData.budget.budgetFlexibility || null,
      budget_priorities: projectData.formData.budget.budgetPriorities || null,
      budget_notes: projectData.formData.budget.budgetNotes || null,
      
      // Lifestyle settings
      lifestyle_notes: projectData.formData.lifestyle.lifestyleNotes || null,
      home_feeling: projectData.formData.lifestyle.homeFeeling || null,
      
      // Site settings
      site_constraints: Array.isArray(projectData.formData.site.siteConstraints) 
        ? projectData.formData.site.siteConstraints 
        : null,
      site_access: projectData.formData.site.siteAccess || null,
      site_views: projectData.formData.site.siteViews || null,
      outdoor_spaces: Array.isArray(projectData.formData.site.outdoorSpaces) 
        ? projectData.formData.site.outdoorSpaces 
        : null,
      site_notes: projectData.formData.site.siteNotes || null,
      
      // Space settings
      home_level_type: projectData.formData.spaces.homeLevelType || null,
      level_assignment_notes: projectData.formData.spaces.levelAssignmentNotes || null,
      home_size: projectData.formData.spaces.homeSize || null,
      eliminable_spaces: projectData.formData.spaces.eliminableSpaces || null,
      room_arrangement: projectData.formData.spaces.roomArrangement || null,
      
      // Architecture settings
      preferred_styles: Array.isArray(projectData.formData.architecture.preferredStyles) 
        ? projectData.formData.architecture.preferredStyles 
        : null,
      material_preferences: Array.isArray(projectData.formData.architecture.materialPreferences) 
        ? projectData.formData.architecture.materialPreferences 
        : null,
      sustainability_features: Array.isArray(projectData.formData.architecture.sustainabilityFeatures) 
        ? projectData.formData.architecture.sustainabilityFeatures 
        : null,
      // Fixed: technology_requirements - ensure it's an array
      technology_requirements: Array.isArray(projectData.formData.architecture.technologyRequirements) 
        ? projectData.formData.architecture.technologyRequirements 
        : null,
      architecture_notes: projectData.formData.architecture.architectureNotes || null,
      external_materials_selected: Array.isArray(projectData.formData.architecture.externalMaterialsSelected) 
        ? projectData.formData.architecture.externalMaterialsSelected 
        : null,
      internal_materials_selected: Array.isArray(projectData.formData.architecture.internalMaterialsSelected) 
        ? projectData.formData.architecture.internalMaterialsSelected 
        : null,
      
      // Communication settings
      communication_notes: projectData.formData.communication.communicationNotes || null
    };
    
    // Check if settings exist and update or insert accordingly
    const { data: existingSettings } = await supabase
      .from('project_settings')
      .select('id')
      .eq('project_id', resolvedProjectId)
      .single();
    
    if (existingSettings) {
      // Update existing settings
      const { error: settingsError } = await supabase
        .from('project_settings')
        .update(settings)
        .eq('project_id', resolvedProjectId);
      
      if (settingsError) {
        console.error('Error updating project settings:', settingsError);
      }
    } else {
      // Insert new settings with project_id
      const settingsWithProjectId = {
        ...settings,
        project_id: resolvedProjectId
      };
      
      const { error: settingsError } = await supabase
        .from('project_settings')
        .insert(settingsWithProjectId);
      
      if (settingsError) {
        console.error('Error inserting project settings:', settingsError);
      }
    }
    
    // Save rooms - first delete any existing rooms
    const { error: deleteRoomsError } = await supabase
      .from('rooms')
      .delete()
      .eq('project_id', resolvedProjectId);
    
    if (deleteRoomsError) {
      console.error('Error deleting rooms:', deleteRoomsError);
    }
    
    // Then insert the new rooms
    if (projectData.formData.spaces.rooms && projectData.formData.spaces.rooms.length > 0) {
      const roomsToInsert = projectData.formData.spaces.rooms.map(room => ({
        id: room.id,
        project_id: resolvedProjectId,
        type: room.type,
        quantity: room.quantity,
        description: room.description,
        is_custom: room.isCustom,
        custom_name: room.customName,
        display_name: room.displayName,
        primary_users: room.primaryUsers
      }));
      
      const { error: roomsError } = await supabase
        .from('rooms')
        .insert(roomsToInsert);
      
      if (roomsError) {
        console.error('Error inserting rooms:', roomsError);
      }
    }
    
    // Save occupants - first delete any existing occupants
    const { error: deleteOccupantsError } = await supabase
      .from('occupants')
      .delete()
      .eq('project_id', resolvedProjectId);
    
    if (deleteOccupantsError) {
      console.error('Error deleting occupants:', deleteOccupantsError);
    }
    
    // Then insert the new occupants
    if (projectData.formData.lifestyle.occupantEntries && projectData.formData.lifestyle.occupantEntries.length > 0) {
      const occupantsToInsert = projectData.formData.lifestyle.occupantEntries.map(occupant => ({
        id: occupant.id,
        project_id: resolvedProjectId,
        type: occupant.type,
        name: occupant.name,
        notes: occupant.notes
      }));
      
      const { error: occupantsError } = await supabase
        .from('occupants')
        .insert(occupantsToInsert);
      
      if (occupantsError) {
        console.error('Error inserting occupants:', occupantsError);
      }
    }
    
    // Save professionals - first delete any existing professionals
    const { error: deleteProfessionalsError } = await supabase
      .from('professionals')
      .delete()
      .eq('project_id', resolvedProjectId);
    
    if (deleteProfessionalsError) {
      console.error('Error deleting professionals:', deleteProfessionalsError);
    }
    
    // Then insert the new professionals
    if (projectData.formData.contractors.professionals && projectData.formData.contractors.professionals.length > 0) {
      const professionalsToInsert = projectData.formData.contractors.professionals.map(professional => ({
        id: professional.id,
        project_id: resolvedProjectId,
        type: professional.type,
        name: professional.name,
        contact: professional.contact,
        notes: professional.notes,
        is_custom: professional.isCustom || false
      }));
      
      const { error: professionalsError } = await supabase
        .from('professionals')
        .insert(professionalsToInsert);
      
      if (professionalsError) {
        console.error('Error inserting professionals:', professionalsError);
      }
    }
    
    // Save inspiration entries - first delete any existing entries
    const { error: deleteInspirationError } = await supabase
      .from('inspiration_entries')
      .delete()
      .eq('project_id', resolvedProjectId);
    
    if (deleteInspirationError) {
      console.error('Error deleting inspiration entries:', deleteInspirationError);
    }
    
    // Then insert the new inspiration entries
    if (projectData.formData.architecture.inspirationEntries && projectData.formData.architecture.inspirationEntries.length > 0) {
      const inspirationToInsert = projectData.formData.architecture.inspirationEntries.map(entry => ({
        project_id: resolvedProjectId,
        link: entry.link,
        description: entry.description
      }));
      
      const { error: inspirationError } = await supabase
        .from('inspiration_entries')
        .insert(inspirationToInsert);
      
      if (inspirationError) {
        console.error('Error inserting inspiration entries:', inspirationError);
      }
    }
    
    // Save summary if it exists
    if (projectData.summary.generatedSummary || projectData.summary.editedSummary) {
      // Check if summary exists and update or insert accordingly
      const { data: existingSummary } = await supabase
        .from('summaries')
        .select('id')
        .eq('project_id', resolvedProjectId)
        .single();
      
      if (existingSummary) {
        // Update existing summary
        const { error: summaryError } = await supabase
          .from('summaries')
          .update({
            generated_summary: projectData.summary.generatedSummary,
            edited_summary: projectData.summary.editedSummary
          })
          .eq('project_id', resolvedProjectId);
        
        if (summaryError) {
          console.error('Error updating summary:', summaryError);
        }
      } else {
        // Insert new summary
        const { error: summaryError } = await supabase
          .from('summaries')
          .insert({
            project_id: resolvedProjectId,
            generated_summary: projectData.summary.generatedSummary,
            edited_summary: projectData.summary.editedSummary
          });
        
        if (summaryError) {
          console.error('Error inserting summary:', summaryError);
        }
      }
    }
    
    // Handle file uploads
    // For each file category in the files object, process any unprocessed files
    const updatedFiles = { ...projectData.files };
    
    // Helper function to process files for a category
    const processFilesForCategory = async (
      files: any[], 
      category: string, 
      fileType: string
    ) => {
      const processedFiles = [];
      
      for (const file of files) {
        // Check if file is a File object (needs to be uploaded)
        if (file instanceof File) {
          try {
            const uploadResult = await uploadProjectFile(file, resolvedProjectId, fileType, category);
            
            if (uploadResult.success) {
              // Create a processed file entry with metadata
              processedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                url: uploadResult.publicUrl,
                path: uploadResult.path,
                category
              });
            } else {
              console.error(`Failed to upload file ${file.name}:`, uploadResult.error);
              // Keep file as-is so we can try again later
              processedFiles.push(file);
            }
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            processedFiles.push(file);
          }
        } else {
          // File is already processed, just pass it through
          processedFiles.push(file);
        }
      }
      
      return processedFiles;
    };
    
    // Process each file category
    if (updatedFiles.uploadedFiles?.length) {
      updatedFiles.uploadedFiles = await processFilesForCategory(
        updatedFiles.uploadedFiles, 
        'uploadedFiles', 
        'design'
      );
    }
    
    if (updatedFiles.uploadedInspirationImages?.length) {
      updatedFiles.uploadedInspirationImages = await processFilesForCategory(
        updatedFiles.uploadedInspirationImages, 
        'inspirationImages', 
        'inspiration'
      );
    }
    
    if (updatedFiles.inspirationSelections?.length) {
      updatedFiles.inspirationSelections = await processFilesForCategory(
        updatedFiles.inspirationSelections, 
        'inspirationSelections', 
        'inspiration'
      );
    }
    
    if (updatedFiles.siteDocuments?.length) {
      updatedFiles.siteDocuments = await processFilesForCategory(
        updatedFiles.siteDocuments, 
        'siteDocuments', 
        'site'
      );
    }
    
    if (updatedFiles.inspirationFiles?.length) {
      updatedFiles.inspirationFiles = await processFilesForCategory(
        updatedFiles.inspirationFiles, 
        'inspirationFiles', 
        'inspiration'
      );
    }
    
    if (updatedFiles.supportingDocuments?.length) {
      updatedFiles.supportingDocuments = await processFilesForCategory(
        updatedFiles.supportingDocuments, 
        'supportingDocuments', 
        'documents'
      );
    }
    
    if (updatedFiles.sitePhotos?.length) {
      updatedFiles.sitePhotos = await processFilesForCategory(
        updatedFiles.sitePhotos, 
        'sitePhotos', 
        'site'
      );
    }
    
    if (updatedFiles.designFiles?.length) {
      updatedFiles.designFiles = await processFilesForCategory(
        updatedFiles.designFiles, 
        'designFiles', 
        'design'
      );
    }
    
    // Return updated project data with the project ID
    const updatedProjectData = {
      ...projectData,
      projectId: resolvedProjectId,
      files: updatedFiles
    };
    
    return {
      success: true,
      projectId: resolvedProjectId,
      projectData: updatedProjectData
    };
  } catch (error) {
    console.error('Error in saveProject:', error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Loads a project from Supabase
 * @param projectId The ID of the project to load
 * @returns An object containing success status and project data
 */
export async function loadProject(projectId: string) {
  try {
    // Load the core project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      throw new Error(`Error loading project: ${projectError.message}`);
    }

    if (!project) {
      throw new Error(`Project not found with ID: ${projectId}`);
    }

    // Load project settings
    const { data: settings, error: settingsError } = await supabase
      .from('project_settings')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" - not an error for us
      console.error('Error loading project settings:', settingsError);
    }

    // Load rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId);

    if (roomsError) {
      console.error('Error loading rooms:', roomsError);
    }

    // Load occupants
    const { data: occupants, error: occupantsError } = await supabase
      .from('occupants')
      .select('*')
      .eq('project_id', projectId);

    if (occupantsError) {
      console.error('Error loading occupants:', occupantsError);
    }

    // Load professionals
    const { data: professionals, error: professionalsError } = await supabase
      .from('professionals')
      .select('*')
      .eq('project_id', projectId);

    if (professionalsError) {
      console.error('Error loading professionals:', professionalsError);
    }

    // Load inspiration entries
    const { data: inspirationEntries, error: inspirationError } = await supabase
      .from('inspiration_entries')
      .select('*')
      .eq('project_id', projectId);

    if (inspirationError) {
      console.error('Error loading inspiration entries:', inspirationError);
    }

    // Load summary
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (summaryError && summaryError.code !== 'PGRST116') {
      console.error('Error loading summary:', summaryError);
    }

    // Load project files (file metadata only, not actual file contents)
    const { data: files, error: filesError } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId);

    if (filesError) {
      console.error('Error loading project files:', filesError);
    }

    // Create the ProjectData structure from the loaded data
    const projectData: ProjectData = {
      projectId: projectId, // Store the project ID directly in the project data
      formData: {
        projectInfo: {
          clientName: project.client_name,
          projectAddress: project.project_address || '',
          contactEmail: project.contact_email || '',
          contactPhone: project.contact_phone || '',
          projectType: project.project_type || '',
          projectDescription: project.project_description || '',
          moveInPreference: project.move_in_preference || '',
          moveInDate: project.move_in_date || '',
          projectGoals: project.project_goals || '',
          coordinates: project.coordinates || undefined
        },
        budget: {
          budgetRange: project.budget_range || '',
          flexibilityNotes: '', // These fields aren't in the project table
          priorityAreas: '',
          timeframe: '',
          budgetFlexibility: settings?.budget_flexibility || undefined,
          budgetPriorities: settings?.budget_priorities || undefined,
          budgetNotes: settings?.budget_notes || undefined
        },
        lifestyle: {
          occupants: '', // This field is now represented by occupantEntries
          occupationDetails: '',
          dailyRoutine: '',
          entertainmentStyle: '',
          specialRequirements: '',
          pets: '',
          specialNeeds: '',
          hobbies: [],
          entertaining: '',
          workFromHome: '',
          lifestyleNotes: settings?.lifestyle_notes || undefined,
          homeFeeling: settings?.home_feeling || undefined,
          occupantEntries: occupants?.map(occupant => ({
            id: occupant.id,
            type: occupant.type,
            name: occupant.name,
            notes: occupant.notes || undefined
          })) || []
        },
        site: {
          existingConditions: '',
          siteFeatures: settings?.site_constraints,
          viewsOrientations: '',
          accessConstraints: '',
          neighboringProperties: '',
          siteFeaturesAndViews: '',
          topographicSurvey: '',
          existingHouseDrawings: '',
          septicDesign: '',
          certificateOfTitle: '',
          covenants: '',
          siteConstraints: settings?.site_constraints,
          siteAccess: settings?.site_access || undefined,
          siteViews: settings?.site_views || undefined,
          outdoorSpaces: settings?.outdoor_spaces || undefined,
          siteNotes: settings?.site_notes || undefined
        },
        spaces: {
          rooms: rooms?.map(room => ({
            id: room.id,
            type: room.type,
            quantity: room.quantity,
            description: room.description || '',
            isCustom: room.is_custom,
            customName: room.custom_name || undefined,
            displayName: room.display_name || undefined,
            primaryUsers: room.primary_users || undefined
          })) || [],
          additionalNotes: '',
          roomTypes: [],
          specialSpaces: [],
          storageNeeds: '',
          spatialRelationships: '',
          accessibilityNeeds: '',
          spacesNotes: '',
          homeLevelType: settings?.home_level_type || undefined,
          levelAssignmentNotes: settings?.level_assignment_notes || undefined,
          homeSize: settings?.home_size || undefined,
          eliminableSpaces: settings?.eliminable_spaces || undefined,
          roomArrangement: settings?.room_arrangement || undefined
        },
        architecture: {
          stylePrefences: '',
          externalMaterials: '',
          internalFinishes: '',
          sustainabilityGoals: '',
          specialFeatures: '',
          inspirationNotes: '',
          preferredStyles: settings?.preferred_styles || undefined,
          materialPreferences: settings?.material_preferences || undefined,
          sustainabilityFeatures: settings?.sustainability_features || undefined,
          technologyRequirements: settings?.technology_requirements || undefined,
          architectureNotes: settings?.architecture_notes || undefined,
          externalMaterialsSelected: settings?.external_materials_selected || undefined,
          internalMaterialsSelected: settings?.internal_materials_selected || undefined,
          inspirationLinks: '',
          inspirationComments: '',
          inspirationEntries: inspirationEntries?.map(entry => ({
            link: entry.link,
            description: entry.description || ''
          })) || []
        },
        contractors: {
          preferredBuilder: '',
          goToTender: false,
          wantF9Build: false,
          f9Build: false,
          structuralEngineer: '',
          civilEngineer: '',
          otherConsultants: '',
          professionals: professionals?.map(professional => ({
            id: professional.id,
            type: professional.type,
            name: professional.name,
            contact: professional.contact || undefined,
            notes: professional.notes || undefined,
            isCustom: professional.is_custom
          })) || [],
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
          communicationNotes: settings?.communication_notes || undefined
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
          customVersionDetails: '',
          userRole: [],
          otherRoleSpecify: '',
          teamSize: '',
          wouldRecommend: '',
          canContact: '',
          contactInfo: '',
          feedbackComments: '',
          callAvailability: ''
        }
      },
      files: {
        uploadedFiles: [],
        uploadedInspirationImages: [],
        inspirationSelections: [],
        siteDocuments: [],
        inspirationFiles: [],
        supportingDocuments: [],
        sitePhotos: [],
        designFiles: []
      },
      summary: {
        generatedSummary: summary?.generated_summary || '',
        editedSummary: summary?.edited_summary || ''
      },
      lastSaved: project.updated_at,
      currentSection: undefined
    };

    return {
      success: true,
      projectId,
      projectData
    };
  } catch (error) {
    console.error('Error in loadProject:', error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param projectId The project ID to associate the file with
 * @param fileType The type of file (e.g., 'site', 'inspiration', 'design')
 * @param category The category of the file (e.g., 'siteDocuments', 'inspirationFiles')
 * @returns An object with the success status, file path, and public URL
 */
export async function uploadProjectFile(file: File, projectId: string, fileType: string, category: string) {
  try {
    if (!file || !projectId) {
      throw new Error('File and projectId are required');
    }

    // Create a unique file path using the project ID and a timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const bucketPath = `${fileType}/${projectId}/${timestamp}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(bucketPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from('project-files')
      .getPublicUrl(bucketPath);
    
    // Save the file metadata to the project_files table
    const { error: fileMetadataError } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        file_path: bucketPath,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        category: category
      });
    
    if (fileMetadataError) {
      console.error('Error saving file metadata:', fileMetadataError);
    }
    
    return {
      success: true,
      path: bucketPath,
      publicUrl: publicUrlData?.publicUrl || '',
      fileName: file.name,
      fileType,
      fileSize: file.size,
      category
    };
  } catch (error) {
    console.error('Error in uploadProjectFile:', error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Gets file metadata for a project
 * @param projectId The project ID to get files for
 * @param fileType Optional filter by file type
 * @returns An array of file metadata objects
 */
export async function getProjectFiles(projectId: string, fileType?: string) {
  try {
    let query = supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId);
      
    if (fileType) {
      query = query.eq('file_type', fileType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching project files: ${error.message}`);
    }
    
    return {
      success: true,
      files: data || []
    };
  } catch (error) {
    console.error('Error in getProjectFiles:', error);
  return {
    success: false,
      error,
      files: []
    };
  }
}

/**
 * Deletes a file from Supabase Storage and removes its metadata
 * @param fileId The ID of the file metadata record to delete
 * @param storagePath The storage path of the file
 * @returns Success status
 */
export async function deleteProjectFile(fileId: string, storagePath: string) {
  try {
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .remove([storagePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
    
    // Delete the file metadata
    const { error: metadataError } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId);
    
    if (metadataError) {
      throw new Error(`Error deleting file metadata: ${metadataError.message}`);
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in deleteProjectFile:', error);
    return {
      success: false,
      error
  };
  }
}
