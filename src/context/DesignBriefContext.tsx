import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, SectionKey } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';
import { useSupabase } from '@/hooks/useSupabase';
import { loadProject, getOrCreateProject } from '@/lib/supabase/services/projectService';
import { supabase } from '@/lib/supabase/schema';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { useToast } from '@/hooks/use-toast';
import { createDiagnosticSession } from '@/lib/supabase/services/diagnosticService';

// Session storage key for project ID
const PROJECT_ID_STORAGE_KEY = 'currentProjectId';
// Key to track project creation attempts to prevent duplicates
const PROJECT_CREATION_ATTEMPT_KEY = 'projectCreationAttempt';
// Key to track force creation from dashboard
const FORCE_CREATION_KEY = 'forceProjectCreation';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default empty state
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get authentication from useSupabase hook
  const { user, session } = useSupabase();

  // Initialize or get project ID
  useEffect(() => {
    async function initializeProject() {
      if (!user) {
        // No authenticated user, use empty state
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First check if user is an admin - admins don't have their own projects
        const userIsAdmin = await isAdmin(user.id);
        
        if (userIsAdmin) {
          console.log('Admin user detected, using empty state');
          // Admin users should just use empty state
          setProjectData(initialProjectData);
          setIsLoading(false);
          return;
        }

        // Get URL params to check if we should create a new project
        const urlParams = new URLSearchParams(window.location.search);
        const createNewParam = urlParams.get('create');
        const projectIdParam = urlParams.get('projectId');
        
        // Check for force creation flag (set when user clicks "Create New Design Brief")
        const forceCreation = (createNewParam === 'true') && 
          sessionStorage.getItem(FORCE_CREATION_KEY) === 'true';
        
        console.log('Force creation mode:', forceCreation);
        
        // Clear the force creation flag (one-time use)
        if (forceCreation) {
          sessionStorage.removeItem(FORCE_CREATION_KEY);
        }
        
        // Special handling if projectId is in the URL - prioritize this
        if (projectIdParam) {
          console.log('Project ID found in URL:', projectIdParam);
          // Try to load this specific project
          const result = await loadProject(projectIdParam);
          
          if (result.success && result.projectData) {
            console.log('Successfully loaded project from URL parameter');
            setProjectData(result.projectData);
            // Store the project ID in session storage
            sessionStorage.setItem(PROJECT_ID_STORAGE_KEY, projectIdParam);
            setIsLoading(false);
            return;
          } else {
            console.error('Failed to load project from URL parameter:', result.error);
            toast({
              variant: 'destructive',
              title: 'Error Loading Project',
              description: 'The specified project could not be loaded. It may not exist or you may not have permission to view it.'
            });
          }
        }
        
        // Set the create flag based on URL parameter
        const createNew = createNewParam === 'true';
        
        console.log('URL create parameter:', createNewParam);
        console.log('Should create new project:', createNew);

        // If we're in force creation mode from dashboard, bypass all other checks
        if (forceCreation) {
          console.log('Force creation mode active - creating new project regardless of session state');
          await createNewProject(user.id);
          return;
        }
        
        // Check session storage for existing project ID if not in force mode
        const storedProjectId = sessionStorage.getItem(PROJECT_ID_STORAGE_KEY);
        
        if (storedProjectId) {
          console.log('Found stored project ID:', storedProjectId);
          // Validate that the stored project belongs to this user
          const { data, error } = await supabase
            .from('projects')
            .select('id')
            .eq('id', storedProjectId)
            .eq('user_id', user.id)
            .single();
            
          if (data) {
            console.log('Validated stored project ID:', data.id);
            // Valid project ID, load it
            const result = await loadProject(storedProjectId);
            
            if (result.success && result.projectData) {
              setProjectData(result.projectData);
              setIsLoading(false);
              return;
            } else {
              console.error('Error loading stored project:', result.error);
            }
          } else {
            console.log('Invalid stored project ID or validation error:', error);
          }
          
          // If we get here, the stored project ID was invalid or not found
          // Clear it from session storage
          sessionStorage.removeItem(PROJECT_ID_STORAGE_KEY);
        }
        
        // Only create a new project if explicitly requested by URL parameter
        if (createNew) {
          console.log('Create=true parameter found, creating new project');
          await createNewProject(user.id);
        } else {
          console.log('Not creating a new project, using empty state');
          // User visiting design brief without a specific project
          // and not requesting to create new one - use empty state
          setProjectData(initialProjectData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error during project initialization:', err);
        // Enhanced error logging
        if (err instanceof Error) {
          console.error(`Error name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`);
        }
        
        setError('An unexpected error occurred during project initialization');
        toast({
          variant: 'destructive',
          title: 'Initialization Error',
          description: 'An unexpected error occurred. Please refresh and try again.'
        });
        
        // Clear any partial state to prevent issues
        sessionStorage.removeItem(PROJECT_CREATION_ATTEMPT_KEY);
        setIsLoading(false);
      }
    }
    
    // Function to create a new project
    const createNewProject = async (userId: string) => {
      const diagnostic = createDiagnosticSession(userId, 'design_brief_project_creation');
      
      try {
        await diagnostic.log('info', 'start_creation', {
          userId,
          timestamp: new Date().toISOString()
        });
        
        console.log('Creating new project for user:', userId);
        
        // Try to create a new project using up to 3 attempts
        let result: any = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          attempts++;
          await diagnostic.log('info', 'attempt', {
            attemptNumber: attempts,
            maxAttempts
          });
          
          console.log(`Project creation attempt ${attempts} of ${maxAttempts}`);
          
          // Get the user role first to determine if this user is allowed to create projects
          const userIsAdmin = await diagnostic.timeAndLog('check_admin_status', async () => {
            return isAdmin(userId);
          });
          
          // Create a new project using the dedicated function with diagnostics
          // Note: For admin users, this will now work properly with the updated stored procedure
          result = await diagnostic.timeAndLog('get_or_create_project', async () => {
            return getOrCreateProject(userId);
          });
          
          await diagnostic.log('info', 'attempt_result', {
            success: result?.success || false,
            projectId: result?.projectId,
            isNewProject: result?.isNewProject,
            diagnosticId: result?.diagnosticId,
            error: result?.error ? JSON.stringify(result.error) : null
          });
          
          if (result.success && result.projectId) {
            await diagnostic.log('success', 'creation_succeeded', {
              projectId: result.projectId,
              isNewProject: result.isNewProject,
              diagnosticId: result.diagnosticId
            });
            break; // Exit the retry loop if successful
          } else if (result.error) {
            await diagnostic.log('error', 'creation_attempt_failed', {
              attempt: attempts,
              errorMessage: result.error.message,
              diagnosticId: result.diagnosticId
            }, result.error.message);
            
            console.error(`Project creation attempt ${attempts} failed:`, result.error);
            
            // If the error is about admin users not being allowed to create projects,
            // and we are in force creation mode, we might want to handle it specially
            if (result.error.message && 
                result.error.message.includes('Admin users cannot') && 
                sessionStorage.getItem(FORCE_CREATION_KEY) === 'true') {
              await diagnostic.log('info', 'admin_force_creation', {
                userId,
                isAdmin: userIsAdmin
              });
              
              console.log('Admin user is forcing project creation, using special handling...');
              toast({
                title: 'Admin Project Creation',
                description: 'Admins should create projects for clients, not themselves.',
                duration: 5000
              });
              
              // Clear the force creation flag
              sessionStorage.removeItem(FORCE_CREATION_KEY);
              setIsLoading(false);
              
              await diagnostic.end(false, {
                reason: 'admin_force_creation_rejected'
              });
              
              return;
            }
          }
          
          // Small delay before retry
          if (attempts < maxAttempts) {
            await diagnostic.log('info', 'retry_delay', {
              attemptNumber: attempts,
              delayMs: 500
            });
            
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (result?.success && result.projectId) {
          await diagnostic.log('success', 'project_created', {
            projectId: result.projectId,
            attemptsMade: attempts,
            diagnosticId: result.diagnosticId
          });
          
          console.log('New project created, ID:', result.projectId);
          // Store the project ID in session storage
          sessionStorage.setItem(PROJECT_ID_STORAGE_KEY, result.projectId);
          
          // Log this to make sure we can audit project creations
          console.log('Project ID stored in session storage:', result.projectId);
          
          // Load the project data
          await diagnostic.log('info', 'loading_project_data', {
            projectId: result.projectId
          });
          
          const loadResult = await diagnostic.timeAndLog('load_project', async () => {
            return loadProject(result.projectId);
          });
          
          if (loadResult.success && loadResult.projectData) {
            await diagnostic.log('success', 'project_data_loaded', {
              projectId: result.projectId
            });
            
            setProjectData(loadResult.projectData);
            toast({
              title: 'New Project Created',
              description: 'Your new design brief has been created.',
              duration: 3000
            });
            
            await diagnostic.end(true, {
              result: 'project_created_and_loaded',
              projectId: result.projectId
            });
          } else if (loadResult.error) {
            await diagnostic.log('error', 'project_load_failed', {
              projectId: result.projectId,
              error: loadResult.error instanceof Error ? loadResult.error.message : String(loadResult.error)
            }, loadResult.error instanceof Error ? loadResult.error.message : 'Unknown error');
            
            console.error('Error loading project:', loadResult.error);
            setError('Failed to load project data');
            toast({
              variant: 'destructive',
              title: 'Error Loading Project',
              description: 'Failed to load project data. Please try again.'
            });
            
            await diagnostic.end(false, {
              result: 'project_created_but_load_failed',
              projectId: result.projectId
            });
          }
        } else {
          await diagnostic.log('error', 'project_creation_failed', {
            attempts,
            error: result?.error ? JSON.stringify(result.error) : 'Unknown error'
          }, result?.error?.message || 'Failed to create project after multiple attempts');
          
          console.error('Failed to create project after multiple attempts:', result?.error);
          setError('Failed to create project');
          toast({
            variant: 'destructive',
            title: 'Error Creating Project',
            description: result?.error?.message || 'Failed to create project. Please try again.',
            action: (
              <div className="flex flex-col">
                <div className="text-xs text-gray-400 mt-1">
                  Diagnostic ID: {result?.diagnosticId || 'Not available'}
                </div>
              </div>
            )
          });
          
          await diagnostic.end(false, {
            result: 'project_creation_failed_after_attempts',
            attempts,
            error: result?.error?.message
          });
        }
      } catch (error) {
        await diagnostic.log('error', 'unexpected_exception', {
          error: error instanceof Error ? error.message : String(error)
        }, error instanceof Error ? error.message : 'Unknown error');
        
        console.error('Unexpected error during project creation:', error);
        setError('An unexpected error occurred during project creation');
        toast({
          variant: 'destructive',
          title: 'Unexpected Error',
          description: 'An unexpected error occurred during project creation. Please try again.'
        });
        
        await diagnostic.end(false, {
          result: 'unexpected_exception',
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setIsLoading(false);
      }
    }

    initializeProject();
  }, [user, toast]);

  // Form data update functions
  const updateFormData: DesignBriefContextType['updateFormData'] = useCallback((section, updates) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData = {
        ...updatedDraft.formData,
        [section]: { 
          ...updatedDraft.formData[section], 
          ...updates 
        }
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  // Room management hooks
  const { addRoom, updateRoom, removeRoom } = useRoomsManagement(projectData, setProjectData);
  
  // Professional management hooks
  const { addProfessional, updateProfessional, removeProfessional } = useProfessionalsManagement(projectData, setProjectData);
  
  // File and summary management hooks
  const { updateFiles, updateSummary, saveProjectData, exportAsPDF, sendByEmail, deleteFile } = useFileAndSummaryManagement(projectData, setProjectData);

  // Load an existing project by ID
  const loadProjectById = useCallback(async (projectId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if user is an admin
      const userIsAdmin = await isAdmin(user.id);
      
      // Admins can view any project, clients can only view their own
      let result;
      if (userIsAdmin) {
        // Admin can load any project (without user_id check)
        result = await loadProject(projectId);
      } else {
        // For regular users, validate project ownership in the service
        result = await loadProject(projectId);
        
        // Extra check to ensure user can only load their own projects
        if (result.success && result.projectData?.userId !== user.id) {
          result = { 
            success: false, 
            error: "You don't have permission to view this project" 
          };
        }
      }
      
      if (result.success && result.projectData) {
        setProjectData(result.projectData);
        // Store the project ID in session storage
        sessionStorage.setItem(PROJECT_ID_STORAGE_KEY, projectId);
      } else if (result.error) {
        console.error('Error loading project:', result.error);
        setError(result.error instanceof Error ? result.error.message : 'Failed to load project data');
        toast({
          variant: 'destructive',
          title: 'Error Loading Project',
          description: result.error instanceof Error ? result.error.message : 'Failed to load project data'
        });
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('An unexpected error occurred loading the project');
      toast({
        variant: 'destructive',
        title: 'Error Loading Project',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Auto-save to Supabase when data changes
  useEffect(() => {
    // Skip auto-save if not authenticated, if this is initial load, or if we don't have a project ID
    if (!user || isLoading || !projectData.projectId) return;
    
    // Use a debounce to avoid too many saves
    const timer = setTimeout(() => {
      saveProjectData().catch(err => {
        console.error('Auto-save failed:', err);
      });
    }, 2000); // 2 second debounce
    
    return () => clearTimeout(timer);
  }, [projectData, user, isLoading, saveProjectData]);

  const value: DesignBriefContextType = {
    projectData,
    formData: projectData.formData,
    files: projectData.files,
    summary: projectData.summary,
    updateFormData,
    updateFiles,
    updateSummary,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional,
    currentSection,
    setCurrentSection,
    saveProjectData,
    exportAsPDF,
    isLoading,
    error,
    sendByEmail,
    loadProject: loadProjectById,
    deleteFile
  };

  return (
    <DesignBriefContext.Provider value={value}>
      {children}
    </DesignBriefContext.Provider>
  );
};

export const useDesignBrief = () => {
  const context = useContext(DesignBriefContext);
  if (context === undefined) {
    throw new Error('useDesignBrief must be used within a DesignBriefProvider');
  }
  return context;
};

// Function to set the force creation flag - call this before redirecting to design-brief
export const setForceProjectCreation = () => {
  sessionStorage.setItem(FORCE_CREATION_KEY, 'true');
};
