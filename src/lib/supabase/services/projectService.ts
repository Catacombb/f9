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
  technology_requirements?: string | null;
  architecture_notes?: string | null;
  communication_notes?: string | null;
}

export async function saveProject(projectData: ProjectData, userId: string) {
  try {
    // First, check if the project exists to determine if we're creating or updating
    let projectId = '';
    let isNewProject = true;
    
    // Try to get the project ID from local storage or some other source
    const storedProjectId = localStorage.getItem('current_project_id');
    
    if (storedProjectId) {
      // Check if this project exists and belongs to the current user
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('id', storedProjectId)
        .eq('user_id', userId)
        .single();
      
      if (existingProject) {
        projectId = existingProject.id;
        isNewProject = false;
      }
    }
    
    // If it's a new project, create the project record
    if (isNewProject) {
      projectId = uuidv4();
      
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
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
      
      // Store the project ID in local storage
      localStorage.setItem('current_project_id', projectId);
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
        .eq('id', projectId);
      
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
      .eq('project_id', projectId)
      .single();
    
    if (existingSettings) {
      // Update existing settings
      const { error: settingsError } = await supabase
        .from('project_settings')
        .update(settings)
        .eq('project_id', projectId);
      
      if (settingsError) {
        console.error('Error updating project settings:', settingsError);
      }
    } else {
      // Insert new settings
      const { error: settingsError } = await supabase
        .from('project_settings')
        .insert({
          project_id: projectId,
          ...settings
        });
      
      if (settingsError) {
        console.error('Error inserting project settings:', settingsError);
      }
    }
    
    // Save rooms - first delete any existing rooms
    const { error: deleteRoomsError } = await supabase
      .from('rooms')
      .delete()
      .eq('project_id', projectId);
    
    if (deleteRoomsError) {
      console.error('Error deleting rooms:', deleteRoomsError);
    }
    
    // Then insert the new rooms
    if (projectData.formData.spaces.rooms && projectData.formData.spaces.rooms.length > 0) {
      const roomsToInsert = projectData.formData.spaces.rooms.map(room => ({
        id: room.id,
        project_id: projectId,
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
      .eq('project_id', projectId);
    
    if (deleteOccupantsError) {
      console.error('Error deleting occupants:', deleteOccupantsError);
    }
    
    // Then insert the new occupants
    if (projectData.formData.lifestyle.occupantEntries && projectData.formData.lifestyle.occupantEntries.length > 0) {
      const occupantsToInsert = projectData.formData.lifestyle.occupantEntries.map(occupant => ({
        id: occupant.id,
        project_id: projectId,
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
      .eq('project_id', projectId);
    
    if (deleteProfessionalsError) {
      console.error('Error deleting professionals:', deleteProfessionalsError);
    }
    
    // Then insert the new professionals
    if (projectData.formData.contractors.professionals && projectData.formData.contractors.professionals.length > 0) {
      const professionalsToInsert = projectData.formData.contractors.professionals.map(professional => ({
        id: professional.id,
        project_id: projectId,
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
      .eq('project_id', projectId);
    
    if (deleteInspirationError) {
      console.error('Error deleting inspiration entries:', deleteInspirationError);
    }
    
    // Then insert the new inspiration entries
    if (projectData.formData.architecture.inspirationEntries && projectData.formData.architecture.inspirationEntries.length > 0) {
      const inspirationToInsert = projectData.formData.architecture.inspirationEntries.map(entry => ({
        project_id: projectId,
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
        .eq('project_id', projectId)
        .single();
      
      if (existingSummary) {
        // Update existing summary
        const { error: summaryError } = await supabase
          .from('summaries')
          .update({
            generated_summary: projectData.summary.generatedSummary,
            edited_summary: projectData.summary.editedSummary
          })
          .eq('project_id', projectId);
        
        if (summaryError) {
          console.error('Error updating summary:', summaryError);
        }
      } else {
        // Insert new summary
        const { error: summaryError } = await supabase
          .from('summaries')
          .insert({
            project_id: projectId,
            generated_summary: projectData.summary.generatedSummary,
            edited_summary: projectData.summary.editedSummary
          });
        
        if (summaryError) {
          console.error('Error inserting summary:', summaryError);
        }
      }
    }
    
    // Handle file uploads
    // Note: This would typically involve uploading to Supabase storage
    // and then recording the file metadata in the project_files table
    // This is more complex and would require additional code
    
    return {
      success: true,
      projectId
    };
  } catch (error) {
    console.error('Error in saveProject:', error);
    return {
      success: false,
      error
    };
  }
}

export async function loadProject(projectId: string) {
  // This function would load a project and all related data from Supabase
  // It would have similar but inverse logic to saveProject
  
  // For now, we'll return a placeholder
  return {
    success: false,
    error: new Error('Not implemented yet')
  };
}
