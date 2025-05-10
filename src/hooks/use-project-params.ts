import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSupabase } from './useSupabase';
import { isAdmin } from '@/lib/supabase/services/roleService';

/**
 * Hook to validate and handle URL parameters for project creation and loading
 * This helps prevent accidental duplicate project creation
 */
export function useProjectParams() {
  const [searchParams] = useSearchParams();
  const [validatedParams, setValidatedParams] = useState({
    shouldCreate: false,
    projectId: null as string | null,
    isValid: false,
    isProcessing: true
  });
  const { user } = useSupabase();

  useEffect(() => {
    async function validateParams() {
      if (!user) {
        setValidatedParams({
          shouldCreate: false,
          projectId: null,
          isValid: false,
          isProcessing: false
        });
        return;
      }

      try {
        // Check if user is admin - admins shouldn't create projects for themselves
        const userIsAdmin = await isAdmin(user.id);
        
        // Get the parameters
        const createParam = searchParams.get('create');
        const projectIdParam = searchParams.get('projectId');
        
        // Priority 1: Check projectId parameter first - takes precedence over create
        if (projectIdParam) {
          console.log('Project ID found in URL:', projectIdParam);
          setValidatedParams({
            shouldCreate: false,
            projectId: projectIdParam,
            isValid: true,
            isProcessing: false
          });
          return;
        }
        
        // Priority 2: Check create=true parameter
        if (createParam === 'true') {
          // Only allow non-admin users to create projects
          if (userIsAdmin) {
            console.log('Admin user cannot create projects for themselves');
            setValidatedParams({
              shouldCreate: false,
              projectId: null,
              isValid: false,
              isProcessing: false
            });
            return;
          }
          
          console.log('Valid create parameter found');
          setValidatedParams({
            shouldCreate: true,
            projectId: null,
            isValid: true,
            isProcessing: false
          });
          return;
        }
        
        // No valid parameters found
        setValidatedParams({
          shouldCreate: false,
          projectId: null,
          isValid: false,
          isProcessing: false
        });
      } catch (error) {
        console.error('Error validating project parameters:', error);
        setValidatedParams({
          shouldCreate: false,
          projectId: null,
          isValid: false,
          isProcessing: false
        });
      }
    }
    
    validateParams();
  }, [searchParams, user]);
  
  return validatedParams;
} 