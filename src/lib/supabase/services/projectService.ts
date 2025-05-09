import { supabase } from '@/lib/supabase/schema';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
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
    let resolvedProjectId = projectId || projectData.projectId;
    
    if (!resolvedProjectId) {
      // If no projectId is provided at all, get or create one
      const result = await getOrCreateProject(userId);
      
      if (!result.success || !result.projectId) {
        throw new Error(`Failed to get or create project: ${result.error}`);
      }
      
      resolvedProjectId = result.projectId;
    }
    
    // Get the current version of the project for optimistic locking
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, updated_at, version')
      .eq('id', resolvedProjectId)
      .single();
      
    if (fetchError) {
      throw new Error(`Error fetching current project: ${fetchError.message}`);
    }
    
    if (!currentProject) {
      throw new Error(`Project not found with ID: ${resolvedProjectId}`);
    }
    
    // Check if the project has been modified since we last loaded it
    const lastSavedTimestamp = projectData.lastSaved ? new Date(projectData.lastSaved) : null;
    const dbTimestamp = currentProject.updated_at ? new Date(currentProject.updated_at) : null;
    
    // If the project has a version field and it doesn't match, or if we have timestamps and they don't match
    const currentVersion = currentProject.version || 1;
    const previousVersion = projectData.version || 1;
    
    // Check for conflict: Either by version mismatch or by timestamp
    const hasVersionConflict = currentVersion > previousVersion;
    const hasTimestampConflict = 
      lastSavedTimestamp && 
      dbTimestamp && 
      dbTimestamp > lastSavedTimestamp;
      
    // If there's a conflict, we can either:
    // 1. Throw an error and let the client handle it
    // 2. Merge changes (more complex)
    // 3. Force update anyway (potential data loss)
    // We'll go with option 1 for safety
    if (hasVersionConflict || hasTimestampConflict) {
      return {
        success: false,
        error: 'Conflict detected: The project has been modified since you last loaded it. Please refresh and try again.',
        conflict: true,
        projectId: resolvedProjectId
      };
    }
    
    // Increment version for this update
    const newVersion = currentVersion + 1;
    
    // Update the project with new version
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
        updated_at: new Date().toISOString(),
        version: newVersion
      })
      .eq('id', resolvedProjectId)
      .eq('version', currentVersion); // Ensure version matches for update
    
    if (projectError) {
      // If optimistic lock failed, it means someone else updated the project first
      if (projectError.message.includes('no rows affected') || projectError.code === '23514') {
        return {
          success: false,
          error: 'Conflict detected: The project was updated by someone else. Please refresh and try again.',
          conflict: true,
          projectId: resolvedProjectId
        };
      }
      
      throw new Error(`Error updating project: ${projectError.message}`);
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
        // More robust check for file objects
        const isFileObject = file instanceof File || 
                            (file && typeof file === 'object' && 
                             'name' in file && 'size' in file && 
                             (file.type !== undefined || file.mime !== undefined));
        
        // Check if this is an unprocessed file that needs uploading
        if (isFileObject && !file.publicUrl && !file.url && !file.path) {
          console.log(`Processing file for upload:`, file.name);
          try {
            const uploadResult = await uploadProjectFile(file, resolvedProjectId, fileType, category);
            
            if (uploadResult.success) {
              console.log(`Successfully uploaded file ${file.name}`);
              // Create a processed file entry with metadata
              processedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type || file.mime || 'application/octet-stream',
                url: uploadResult.publicUrl,
                publicUrl: uploadResult.publicUrl,
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
        } else if (file.publicUrl || file.url || file.path) {
          // File is already processed, just pass it through
          console.log(`File already processed, skipping upload: ${file.name || 'unnamed file'}`);
          processedFiles.push(file);
        } else {
          console.error(`Unrecognized file object:`, file);
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
    
    // Return updated project data with the project ID and new version
    const updatedProjectData = {
      ...projectData,
      projectId: resolvedProjectId,
      version: newVersion,
      files: updatedFiles,
      lastSaved: new Date().toISOString()
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

    // Group files by category
    const filesByCategory: Record<string, any[]> = {};

    // Initialize default file categories with empty arrays
    const defaultCategories = [
      'uploadedFiles',
      'uploadedInspirationImages',
      'inspirationSelections',
      'siteDocuments',
      'inspirationFiles',
      'supportingDocuments',
      'sitePhotos',
      'designFiles'
    ];
    
    defaultCategories.forEach(category => {
      filesByCategory[category] = [];
    });

    // Process files and categorize them
    if (files && files.length > 0) {
      console.log(`Processing ${files.length} files for project ${projectId}`);
      
      for (const file of files) {
        try {
          // Get public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from('project-files')
            .getPublicUrl(file.file_path);

          const fileData = {
            id: file.id,
            name: file.file_name,
            path: file.file_path,
            publicUrl: publicUrlData?.publicUrl || '',
            size: file.file_size,
            type: file.file_type,
            category: file.category
          };

          // Add to the appropriate category
          if (file.category && defaultCategories.includes(file.category)) {
            console.log(`Adding file ${file.id} to category ${file.category}`);
            filesByCategory[file.category].push(fileData);
          } else {
            // Default category if none exists or category is invalid
            console.log(`Adding file ${file.id} to default category uploadedFiles`);
            filesByCategory['uploadedFiles'].push(fileData);
          }
        } catch (error) {
          console.error(`Error processing file ${file.id}:`, error);
        }
      }
    } else {
      console.log(`No files found for project ${projectId}`);
    }

    // Create the ProjectData structure from the loaded data
    const projectData: ProjectData = {
      projectId: projectId, // Store the project ID directly in the project data
      userId: project.user_id, // Add userId to identify owner
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
        uploadedFiles: filesByCategory['uploadedFiles'] || [],
        uploadedInspirationImages: filesByCategory['uploadedInspirationImages'] || [],
        inspirationSelections: filesByCategory['inspirationSelections'] || [],
        siteDocuments: filesByCategory['siteDocuments'] || [],
        inspirationFiles: filesByCategory['inspirationFiles'] || [],
        supportingDocuments: filesByCategory['supportingDocuments'] || [],
        sitePhotos: filesByCategory['sitePhotos'] || [],
        designFiles: filesByCategory['designFiles'] || []
      },
      summary: {
        generatedSummary: summary?.generated_summary || '',
        editedSummary: summary?.edited_summary || ''
      },
      lastSaved: project.updated_at,
      version: project.version || 1, // Include version for optimistic locking
      currentSection: undefined
    };

    // Log summary of file loading
    console.log('Files loaded for project:', {
      projectId: projectId,
      totalFiles: files?.length || 0,
      byCategory: Object.entries(filesByCategory).map(([category, files]) => ({
        category,
        count: files.length
      }))
    });

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

    console.log(`Starting upload for file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Check if the storage API is available using admin client
    try {
      // Test if we can access the storage API with admin privileges
      const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
      
      if (bucketsError) {
        console.error("Storage API error:", bucketsError);
        throw new Error(`Storage API not available: ${bucketsError.message}`);
      }
      
      // Check if our bucket exists
      const bucketExists = buckets?.some(bucket => bucket.name === 'project-files');
      if (!bucketExists) {
        console.error("Bucket 'project-files' does not exist. Available buckets:", buckets?.map(b => b.name).join(', '));
        
        // Try to create the bucket using admin client
        try {
          console.log("Attempting to create 'project-files' bucket...");
          const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('project-files', {
            public: true
          });
          
          if (createError) {
            throw new Error(`Failed to create bucket: ${createError.message}`);
          }
          console.log("Successfully created bucket 'project-files'");
        } catch (createErr) {
          console.error("Failed to create bucket:", createErr);
          throw new Error(`Bucket 'project-files' does not exist and could not be created automatically`);
        }
      }
    } catch (storageCheckError) {
      console.error("Error checking storage:", storageCheckError);
      throw new Error(`Storage service check failed: ${storageCheckError.message}`);
    }

    // Create a unique file path using the project ID and a timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const bucketPath = `${fileType}/${projectId}/${timestamp}_${file.name}`;
    
    console.log(`Uploading to path: ${bucketPath}`);
    
    // Upload the file to Supabase Storage using admin client
    const { data, error } = await supabaseAdmin.storage
      .from('project-files')
      .upload(bucketPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`Storage upload error:`, error);
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    console.log(`File uploaded successfully, getting public URL`);
    
    // Get the public URL for the file using admin client
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('project-files')
      .getPublicUrl(bucketPath);
    
    if (!publicUrlData?.publicUrl) {
      console.warn(`Could not get public URL for ${bucketPath}`);
    } else {
      console.log(`Public URL obtained: ${publicUrlData.publicUrl}`);
    }
    
    // Save the file metadata to the project_files table using regular client
    // This ensures proper RLS applies to the metadata
    console.log(`Saving file metadata to database`);
    const { data: fileMetadata, error: fileMetadataError } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        file_path: bucketPath,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        category: category
      })
      .select();
    
    if (fileMetadataError) {
      console.error('Error saving file metadata:', fileMetadataError);
    } else {
      console.log(`File metadata saved successfully`);
    }
    
    return {
      success: true,
      path: bucketPath,
      publicUrl: publicUrlData?.publicUrl || '',
      fileName: file.name,
      fileType,
      fileSize: file.size,
      category,
      metadataId: fileMetadata?.[0]?.id
    };
  } catch (error) {
    console.error('Error in uploadProjectFile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get all files for a project with their public URLs for direct access
 * @param projectId The ID of the project
 * @returns Object with success flag and files array
 */
export async function getProjectFiles(projectId: string) {
  try {
    // Fetch file metadata from the database
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching project files: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return { success: true, files: [] };
    }
    
    // Generate public URLs for each file
    const filesWithUrls = await Promise.all(data.map(async (file) => {
      try {
        // Use the file_path directly from the database record
        const storagePath = file.file_path;
        
        // Get public URL for the file using admin client for storage access
        const { data: urlData } = await supabaseAdmin.storage
          .from('project-files')
          .createSignedUrl(storagePath, 60 * 60); // 1 hour expiration
        
        return {
          ...file,
          publicUrl: urlData?.signedUrl || null
        };
      } catch (urlError) {
        console.error(`Error getting URL for file ${file.file_name}:`, urlError);
        return {
          ...file,
          publicUrl: null
        };
      }
    }));
    
    return {
      success: true,
      files: filesWithUrls
    };
  } catch (error) {
    console.error('Error in getProjectFiles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error getting project files',
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
    // Delete the file from storage using admin client
    const { error: storageError } = await supabaseAdmin.storage
      .from('project-files')
      .remove([storagePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
    
    // Delete the file metadata using regular client (subject to RLS)
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

/**
 * Single source of truth for getting or creating a project
 * This function ensures a user always has exactly one project and prevents duplicates
 * @param userId The ID of the user to get or create a project for
 * @returns An object containing success status, project ID, and whether the project was newly created
 */
export async function getOrCreateProject(userId: string): Promise<{
  success: boolean;
  projectId?: string;
  isNewProject?: boolean;
  error?: any;
}> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('getOrCreateProject called for user ID:', userId);
    
    // First, try to get an existing project for this user
    // This is our first attempt to find an existing project
    const { data: existingProjects, error: findError } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // get newest first
      .limit(1);
    
    if (findError) {
      console.error('Error finding existing projects:', findError);
    } else if (existingProjects && existingProjects.length > 0) {
      console.log('Found existing project:', existingProjects[0].id);
      return {
        success: true,
        projectId: existingProjects[0].id,
        isNewProject: false
      };
    }
    
    // No existing project found, we need to create a new one
    // Try using the RPC function first (atomic transaction approach)
    console.log('No existing project found, attempting to create via RPC');
    
    // Attempt the RPC call but catch errors
    let rpcResult = null;
    let rpcError = null;
    
    try {
      const rpcResponse = await supabase.rpc('get_or_create_project', {
        p_user_id: userId
      });
      rpcResult = rpcResponse.data;
      rpcError = rpcResponse.error;
    } catch (err) {
      console.error('Exception during RPC call:', err);
      rpcError = err;
    }

    // Log the RPC result for debugging
    if (rpcResult) {
      console.log('RPC get_or_create_project result:', rpcResult);
    }
    if (rpcError) {
      console.error('RPC get_or_create_project error:', rpcError);
    }

    // If RPC worked, use its result
    if (!rpcError && rpcResult && rpcResult.project_id) {
      console.log('Project created/found via RPC:', rpcResult.project_id);
      return {
        success: true,
        projectId: rpcResult.project_id,
        isNewProject: rpcResult.is_new_project
      };
    }
    
    // RPC failed, use direct DB operations as fallback
    console.log('RPC method failed, falling back to direct DB operations');
    
    // Try direct database creation
    // Get user's email for the client_name field
    const user_email = await getUserEmail(userId);
    console.log('User email for project creation:', user_email);
    
    // Create a client timestamp ID to reduce chance of conflicts
    const timestamp = new Date().getTime();
    
    // Create a new project with our best effort
    const { data: newProject, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        client_name: user_email || `New Client-${timestamp}`,
        project_description: 'Project created via getOrCreateProject (fallback method)',
        status: 'brief'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating project via direct insert:', insertError);
      
      // Final fallback: check again for any existing projects
      // This covers the race condition where a project was created between our first check and now
      console.log('Checking one last time for existing projects');
      const { data: lastResortProjects, error: lastResortError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) // get newest first
        .limit(1);
      
      if (!lastResortError && lastResortProjects && lastResortProjects.length > 0) {
        console.log('Found existing project in last resort check:', lastResortProjects[0].id);
        return {
          success: true,
          projectId: lastResortProjects[0].id,
          isNewProject: false
        };
      }
      
      // If we still can't find or create a project, return the error
      throw new Error(`Failed to create project: ${insertError.message || 'Unknown error'}`);
    }
    
    console.log('New project created via direct method:', newProject?.id);
    
    // Log the project creation in activities
    try {
      await supabase
        .from('activities')
        .insert({
          project_id: newProject.id,
          user_id: userId,
          activity_type: 'system_event',
          details: {
            event: 'project_created',
            message: 'Project created via getOrCreateProject function'
          },
          is_system_generated: true
        });
    } catch (activityError) {
      // Non-critical error, just log it
      console.warn('Error logging project creation activity:', activityError);
    }
    
    return {
      success: true,
      projectId: newProject.id,
      isNewProject: true
    };
  } catch (error) {
    console.error('Error in getOrCreateProject:', error);
    
    // Enhanced error logging
    const errorDetail = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : String(error);
    
    console.error('Detailed error:', errorDetail);
    
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error in project creation',
        details: errorDetail
      }
    };
  }
}

/**
 * Helper function to get a user's email from their ID
 * @param userId The ID of the user
 * @returns The user's email or null if not found
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    if (!userId) return null;
    
    // First try to get from user_profiles which is in public schema
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (!profileError && profileData?.email) {
      return profileData.email;
    }
    
    // Fallback to auth.users if we can't get it from profiles
    // This requires proper permissions setup
    console.log('Getting email from auth.users (fallback)');
    
    try {
      // Using RPC is safer as it can be permission-controlled
      const { data: userData, error: userError } = await supabase.rpc(
        'get_user_email_by_id',
        { user_id: userId }
      );
      
      if (!userError && userData) {
        return userData;
      }
    } catch (err) {
      console.warn('Error getting email via RPC:', err);
    }
    
    console.log('Could not find email for user');
    return null;
  } catch (error) {
    console.error('Error in getUserEmail:', error);
    return null;
  }
}

/**
 * Deletes a project and all its related data
 * @param projectId The ID of the project to delete
 * @param userId The ID of the user requesting the deletion
 * @returns An object indicating success or error
 */
export async function deleteProject(projectId: string, userId: string): Promise<{
  success: boolean;
  error?: any;
}> {
  try {
    // First verify that the user is an admin or the owner of the project
    const { data: userRole } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    const isUserAdmin = userRole?.role === 'admin';
    
    if (!isUserAdmin) {
      // If user is not an admin, check if they own the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
        
      if (projectError || !project) {
        return {
          success: false,
          error: 'Project not found or you don\'t have permission to delete it'
        };
      }
      
      if (project.user_id !== userId) {
        return {
          success: false,
          error: 'You do not have permission to delete this project'
        };
      }
    }
    
    // Get all files for this project to delete from storage
    const { data: projectFiles } = await supabase
      .from('project_files')
      .select('id, storage_path')
      .eq('project_id', projectId);
    
    // Use the admin client for storage operations
    if (projectFiles && projectFiles.length > 0) {
      // Delete files from storage
      const storagePaths = projectFiles.map(file => file.storage_path);
      
      for (const path of storagePaths) {
        if (path) {
          await supabaseAdmin.storage.from('project-files').remove([path]);
        }
      }
    }
    
    // Delete related records in transaction
    // Note: This relies on foreign key cascades being set up in the database
    const { error: deleteError } = await supabase.rpc('delete_project_and_related_data', {
      p_project_id: projectId
    });
    
    if (deleteError) {
      // If the RPC function doesn't exist, do manual deletion
      // Delete activities first (if they exist)
      const { error: activitiesError } = await supabase
        .from('activities')
        .delete()
        .eq('project_id', projectId);
      
      if (activitiesError) {
        console.error('Error deleting project activities:', activitiesError);
      }
      
      // Delete project files
      const { error: filesError } = await supabase
        .from('project_files')
        .delete()
        .eq('project_id', projectId);
      
      if (filesError) {
        console.error('Error deleting project files:', filesError);
      }
      
      // Delete rooms
      const { error: roomsError } = await supabase
        .from('rooms')
        .delete()
        .eq('project_id', projectId);
      
      if (roomsError) {
        console.error('Error deleting rooms:', roomsError);
      }
      
      // Delete project settings
      const { error: settingsError } = await supabase
        .from('project_settings')
        .delete()
        .eq('project_id', projectId);
      
      if (settingsError) {
        console.error('Error deleting project settings:', settingsError);
      }
      
      // Finally delete the project itself
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (projectError) {
        return {
          success: false,
          error: `Failed to delete project: ${projectError.message}`
        };
      }
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
