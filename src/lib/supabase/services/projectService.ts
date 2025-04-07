
import { supabase } from '../schema';
import { ProjectData } from '@/types';

export const projectService = {
  /**
   * Create a new project in the database
   */
  async createProject(projectData: ProjectData, userId: string) {
    // First create the base project record
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
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
        user_id: userId
      })
      .select('id')
      .single();
    
    if (projectError) throw projectError;
    const projectId = project.id;
    
    // Insert project settings
    await supabase.from('project_settings').insert({
      project_id: projectId,
      budget_flexibility: projectData.formData.budget.budgetFlexibility,
      budget_priorities: projectData.formData.budget.budgetPriorities,
      budget_notes: projectData.formData.budget.budgetNotes,
      lifestyle_notes: projectData.formData.lifestyle.lifestyleNotes,
      home_feeling: projectData.formData.lifestyle.homeFeeling,
      site_constraints: projectData.formData.site.siteConstraints,
      site_access: projectData.formData.site.siteAccess,
      site_views: projectData.formData.site.siteViews,
      outdoor_spaces: projectData.formData.site.outdoorSpaces,
      site_notes: projectData.formData.site.siteNotes,
      home_level_type: projectData.formData.spaces.homeLevelType,
      level_assignment_notes: projectData.formData.spaces.levelAssignmentNotes,
      home_size: projectData.formData.spaces.homeSize,
      eliminable_spaces: projectData.formData.spaces.eliminableSpaces,
      room_arrangement: projectData.formData.spaces.roomArrangement,
      preferred_styles: projectData.formData.architecture.preferredStyles,
      material_preferences: projectData.formData.architecture.materialPreferences,
      external_materials_selected: projectData.formData.architecture.externalMaterialsSelected,
      internal_materials_selected: projectData.formData.architecture.internalMaterialsSelected,
      sustainability_features: projectData.formData.architecture.sustainabilityFeatures,
      technology_requirements: projectData.formData.architecture.technologyRequirements,
      architecture_notes: projectData.formData.architecture.architectureNotes,
      communication_notes: projectData.formData.communication.communicationNotes
    });
    
    // Insert rooms
    if (projectData.formData.spaces.rooms && projectData.formData.spaces.rooms.length > 0) {
      const rooms = projectData.formData.spaces.rooms.map(room => ({
        project_id: projectId,
        type: room.type,
        quantity: room.quantity,
        description: room.description,
        is_custom: room.isCustom,
        custom_name: room.customName,
        display_name: room.displayName,
        primary_users: room.primaryUsers
      }));
      
      await supabase.from('rooms').insert(rooms);
    }
    
    // Insert occupants
    if (projectData.formData.lifestyle.occupantEntries && projectData.formData.lifestyle.occupantEntries.length > 0) {
      const occupants = projectData.formData.lifestyle.occupantEntries.map(occupant => ({
        project_id: projectId,
        type: occupant.type,
        name: occupant.name,
        notes: occupant.notes
      }));
      
      await supabase.from('occupants').insert(occupants);
    }
    
    // Insert professionals
    if (projectData.formData.contractors.professionals && projectData.formData.contractors.professionals.length > 0) {
      const professionals = projectData.formData.contractors.professionals.map(professional => ({
        project_id: projectId,
        type: professional.type,
        name: professional.name,
        contact: professional.contact,
        notes: professional.notes,
        is_custom: professional.isCustom || false
      }));
      
      await supabase.from('professionals').insert(professionals);
    }
    
    // Insert inspiration entries
    if (projectData.formData.architecture.inspirationEntries && projectData.formData.architecture.inspirationEntries.length > 0) {
      const inspirationEntries = projectData.formData.architecture.inspirationEntries.map(entry => ({
        project_id: projectId,
        link: entry.link,
        description: entry.description
      }));
      
      await supabase.from('inspiration_entries').insert(inspirationEntries);
    }
    
    // Insert summary
    await supabase.from('summaries').insert({
      project_id: projectId,
      generated_summary: projectData.summary.generatedSummary,
      edited_summary: projectData.summary.editedSummary
    });
    
    return { projectId };
  },
  
  /**
   * Get a project by its ID
   */
  async getProject(projectId: string): Promise<ProjectData | null> {
    // Get the base project data
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) throw projectError;
    if (!projectData) return null;
    
    // Get the project settings
    const { data: settingsData } = await supabase
      .from('project_settings')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    // Get the rooms
    const { data: roomsData } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId);
    
    // Get the occupants
    const { data: occupantsData } = await supabase
      .from('occupants')
      .select('*')
      .eq('project_id', projectId);
    
    // Get the professionals
    const { data: professionalsData } = await supabase
      .from('professionals')
      .select('*')
      .eq('project_id', projectId);
    
    // Get the inspiration entries
    const { data: inspirationData } = await supabase
      .from('inspiration_entries')
      .select('*')
      .eq('project_id', projectId);
    
    // Get the summary
    const { data: summaryData } = await supabase
      .from('summaries')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    // Initialize settings with default empty object and handle potential null values
    const settings = settingsData || {};
    
    const projectFormData = {
      projectInfo: {
        clientName: projectData.client_name,
        projectAddress: projectData.project_address || '',
        contactEmail: projectData.contact_email || '',
        contactPhone: projectData.contact_phone || '',
        projectType: projectData.project_type || '',
        projectDescription: projectData.project_description || '',
        moveInPreference: projectData.move_in_preference || '',
        projectGoals: projectData.project_goals || '',
        moveInDate: projectData.move_in_date || '',
        coordinates: projectData.coordinates || undefined,
      },
      budget: {
        budgetRange: projectData.budget_range || '',
        flexibilityNotes: '',
        priorityAreas: '',
        timeframe: '',
        budgetFlexibility: settings?.budget_flexibility || '',
        budgetPriorities: settings?.budget_priorities || [],
        budgetNotes: settings?.budget_notes || '',
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
        lifestyleNotes: settings?.lifestyle_notes || '',
        homeFeeling: settings?.home_feeling || '',
        occupantEntries: occupantsData ? occupantsData.map(o => ({
          id: o.id,
          type: o.type,
          name: o.name,
          notes: o.notes || ''
        })) : [],
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
        siteConstraints: settings?.site_constraints || [],
        siteAccess: settings?.site_access || '',
        siteViews: settings?.site_views || '',
        outdoorSpaces: settings?.outdoor_spaces || [],
        siteNotes: settings?.site_notes || '',
      },
      spaces: {
        rooms: roomsData ? roomsData.map(r => ({
          id: r.id,
          type: r.type,
          quantity: r.quantity,
          description: r.description || '',
          isCustom: r.is_custom,
          customName: r.custom_name || undefined,
          displayName: r.display_name || undefined,
          primaryUsers: r.primary_users || undefined
        })) : [],
        additionalNotes: '',
        roomTypes: [],
        specialSpaces: [],
        storageNeeds: '',
        spatialRelationships: '',
        accessibilityNeeds: '',
        spacesNotes: '',
        homeLevelType: settings?.home_level_type || '',
        levelAssignmentNotes: settings?.level_assignment_notes || '',
        homeSize: settings?.home_size || '',
        eliminableSpaces: settings?.eliminable_spaces || '',
        roomArrangement: settings?.room_arrangement || '',
      },
      architecture: {
        stylePrefences: '',
        externalMaterials: '',
        internalFinishes: '',
        sustainabilityGoals: '',
        specialFeatures: '',
        inspirationNotes: '',
        preferredStyles: settings?.preferred_styles || [],
        materialPreferences: settings?.material_preferences || [],
        sustainabilityFeatures: settings?.sustainability_features || [],
        technologyRequirements: settings?.technology_requirements || [],
        architectureNotes: settings?.architecture_notes || '',
        externalMaterialsSelected: settings?.external_materials_selected || [],
        internalMaterialsSelected: settings?.internal_materials_selected || [],
        inspirationLinks: '',
        inspirationComments: '',
        inspirationEntries: inspirationData ? inspirationData.map(i => ({
          link: i.link,
          description: i.description || ''
        })) : [],
      },
      contractors: {
        preferredBuilder: '',
        goToTender: false,
        professionals: professionalsData ? professionalsData.map(p => ({
          id: p.id,
          type: p.type,
          name: p.name,
          contact: p.contact || '',
          notes: p.notes || '',
          isCustom: p.is_custom
        })) : [],
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
        communicationNotes: settings?.communication_notes || '',
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
        teamSize: '',
        wouldRecommend: '',
        canContact: '',
        contactInfo: '',
        feedbackComments: '',
      },
    };
    
    return {
      formData: projectFormData,
      files: {
        uploadedFiles: [],
        uploadedInspirationImages: [],
        inspirationSelections: [],
        siteDocuments: [],
        sitePhotos: [],
        designFiles: [],
        inspirationFiles: []
      },
      summary: {
        generatedSummary: summaryData?.generated_summary || '',
        editedSummary: summaryData?.edited_summary || '',
      },
      lastSaved: projectData.updated_at,
    };
  },
  
  /**
   * Update an existing project
   */
  async updateProject(projectId: string, projectData: ProjectData) {
    // Update base project info
    await supabase
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
      
    // Update or create project settings
    const { count } = await supabase
      .from('project_settings')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);
    
    if (count && count > 0) {
      await supabase
        .from('project_settings')
        .update({
          budget_flexibility: projectData.formData.budget.budgetFlexibility,
          budget_priorities: projectData.formData.budget.budgetPriorities,
          budget_notes: projectData.formData.budget.budgetNotes,
          lifestyle_notes: projectData.formData.lifestyle.lifestyleNotes,
          home_feeling: projectData.formData.lifestyle.homeFeeling,
          site_constraints: projectData.formData.site.siteConstraints,
          site_access: projectData.formData.site.siteAccess,
          site_views: projectData.formData.site.siteViews,
          outdoor_spaces: projectData.formData.site.outdoorSpaces,
          site_notes: projectData.formData.site.siteNotes,
          home_level_type: projectData.formData.spaces.homeLevelType,
          level_assignment_notes: projectData.formData.spaces.levelAssignmentNotes,
          home_size: projectData.formData.spaces.homeSize,
          eliminable_spaces: projectData.formData.spaces.eliminableSpaces,
          room_arrangement: projectData.formData.spaces.roomArrangement,
          preferred_styles: projectData.formData.architecture.preferredStyles,
          material_preferences: projectData.formData.architecture.materialPreferences,
          external_materials_selected: projectData.formData.architecture.externalMaterialsSelected,
          internal_materials_selected: projectData.formData.architecture.internalMaterialsSelected,
          sustainability_features: projectData.formData.architecture.sustainabilityFeatures,
          technology_requirements: projectData.formData.architecture.technologyRequirements,
          architecture_notes: projectData.formData.architecture.architectureNotes,
          communication_notes: projectData.formData.communication.communicationNotes,
        })
        .eq('project_id', projectId);
    } else {
      await supabase
        .from('project_settings')
        .insert({
          project_id: projectId,
          budget_flexibility: projectData.formData.budget.budgetFlexibility,
          budget_priorities: projectData.formData.budget.budgetPriorities,
          budget_notes: projectData.formData.budget.budgetNotes,
          lifestyle_notes: projectData.formData.lifestyle.lifestyleNotes,
          home_feeling: projectData.formData.lifestyle.homeFeeling,
          site_constraints: projectData.formData.site.siteConstraints,
          site_access: projectData.formData.site.siteAccess,
          site_views: projectData.formData.site.siteViews,
          outdoor_spaces: projectData.formData.site.outdoorSpaces,
          site_notes: projectData.formData.site.siteNotes,
          home_level_type: projectData.formData.spaces.homeLevelType,
          level_assignment_notes: projectData.formData.spaces.levelAssignmentNotes,
          home_size: projectData.formData.spaces.homeSize,
          eliminable_spaces: projectData.formData.spaces.eliminableSpaces,
          room_arrangement: projectData.formData.spaces.roomArrangement,
          preferred_styles: projectData.formData.architecture.preferredStyles,
          material_preferences: projectData.formData.architecture.materialPreferences,
          external_materials_selected: projectData.formData.architecture.externalMaterialsSelected,
          internal_materials_selected: projectData.formData.architecture.internalMaterialsSelected,
          sustainability_features: projectData.formData.architecture.sustainabilityFeatures,
          technology_requirements: projectData.formData.architecture.technologyRequirements,
          architecture_notes: projectData.formData.architecture.architectureNotes,
          communication_notes: projectData.formData.communication.communicationNotes,
        });
    }
    
    // Update summary
    const { count: summaryCount } = await supabase
      .from('summaries')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);
      
    if (summaryCount && summaryCount > 0) {
      await supabase
        .from('summaries')
        .update({
          generated_summary: projectData.summary.generatedSummary,
          edited_summary: projectData.summary.editedSummary,
        })
        .eq('project_id', projectId);
    } else {
      await supabase
        .from('summaries')
        .insert({
          project_id: projectId,
          generated_summary: projectData.summary.generatedSummary,
          edited_summary: projectData.summary.editedSummary,
        });
    }
    
    return { success: true };
  },
  
  /**
   * Delete a project by its ID
   */
  async deleteProject(projectId: string) {
    // Delete all related data first (foreign key relationships)
    await Promise.all([
      supabase.from('rooms').delete().eq('project_id', projectId),
      supabase.from('occupants').delete().eq('project_id', projectId),
      supabase.from('professionals').delete().eq('project_id', projectId),
      supabase.from('inspiration_entries').delete().eq('project_id', projectId),
      supabase.from('project_files').delete().eq('project_id', projectId),
      supabase.from('project_settings').delete().eq('project_id', projectId),
      supabase.from('summaries').delete().eq('project_id', projectId),
    ]);
    
    // Then delete the project itself
    await supabase.from('projects').delete().eq('id', projectId);
    
    return { success: true };
  },
  
  /**
   * List all projects for a user
   */
  async listProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('id, client_name, project_address, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  }
};
