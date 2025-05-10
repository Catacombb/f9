import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();

// LocalStorage keys for persistence
const AUTH_STORAGE_KEY = 'supabase_auth_state';
const LAST_AUTH_CHECK_KEY = 'supabase_last_auth_check';

export interface SupabaseContextProps {
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { session: Session | null; user: User | null; } | null;
  }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const authCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);
  const sessionRecoveryAttemptedRef = useRef(false);
  const loadingSafetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add safety mechanism to ensure loading state resolves after a maximum timeout
  useEffect(() => {
    // Clear any existing safety timeout
    if (loadingSafetyTimeoutRef.current) {
      clearTimeout(loadingSafetyTimeoutRef.current);
    }
    
    // If not loading, no need for safety timeout
    if (!isLoading) {
      return;
    }
    
    // Set a maximum timeout for loading state (6 seconds)
    loadingSafetyTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.log("[Auth] Loading safety timeout reached, forcing loading to false");
        setIsLoading(false);
      }
    }, 6000);
    
    return () => {
      if (loadingSafetyTimeoutRef.current) {
        clearTimeout(loadingSafetyTimeoutRef.current);
      }
    };
  }, [isLoading]);

  // Save auth state to localStorage for persistence
  const persistAuthState = (currentUser: User | null, currentSession: Session | null, adminStatus: boolean) => {
    try {
      if (currentUser && currentSession) {
        const persistedData = {
          user: currentUser,
          session: {
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
            expires_at: currentSession.expires_at,
            expires_in: currentSession.expires_in,
          },
          isAdmin: adminStatus,
          timestamp: Date.now(),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(persistedData));
        localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
        console.log("[Auth] Persisted auth state to localStorage");
      } else {
        // Clear persisted state if user is logged out
        localStorage.removeItem(AUTH_STORAGE_KEY);
        console.log("[Auth] Cleared persisted auth state from localStorage");
      }
    } catch (error) {
      console.error("[Auth] Error persisting auth state:", error);
    }
  };

  // Try to recover session from localStorage during initialization
  const tryRecoverSession = async (): Promise<boolean> => {
    try {
      const persistedDataStr = localStorage.getItem(AUTH_STORAGE_KEY);
      const lastAuthCheck = localStorage.getItem(LAST_AUTH_CHECK_KEY);
      
      if (!persistedDataStr) {
        console.log("[Auth] No persisted auth state found");
        return false;
      }
      
      // Check if the last auth check was too long ago (default 1 hour)
      if (lastAuthCheck) {
        const lastCheck = parseInt(lastAuthCheck, 10);
        const oneHourMs = 60 * 60 * 1000; 
        if (Date.now() - lastCheck > oneHourMs) {
          console.log("[Auth] Persisted auth state is too old, requiring fresh check");
          return false;
        }
      }
      
      const persistedData = JSON.parse(persistedDataStr);
      
      // Check if we have the minimum required data
      if (!persistedData.user || !persistedData.session?.access_token) {
        console.log("[Auth] Incomplete persisted auth state");
        return false;
      }
      
      console.log("[Auth] Recovered auth state from localStorage, attempting to use it");
      setUser(persistedData.user);
      setIsAdmin(persistedData.isAdmin);
      
      // Note: We don't set session directly from localStorage
      // Instead we rely on Supabase's own session recovery via cookies
      return true;
    } catch (error) {
      console.error("[Auth] Error recovering session:", error);
      return false;
    }
  };

  // This function handles all auth state changes to prevent race conditions
  const handleAuthStateChange = async (currentSession: Session | null) => {
    console.log("[Auth] Auth state change handler called with session:", currentSession ? "exists" : "null");
    
    if (isCheckingRef.current) {
      console.log("[Auth] Already checking auth state, skipping duplicate check");
      return;
    }
    
    isCheckingRef.current = true;
    
    try {
      // Update the session state
      setSession(currentSession);
      
      // Update user based on the session
      if (!currentSession?.user) {
        console.log("[Auth] No active session, clearing user and admin status");
        setUser(null);
        setIsAdmin(false);
        persistAuthState(null, null, false);
        setIsLoading(false);
        isCheckingRef.current = false;
        return;
      }
      
      // We have a session with user, update the user state
      setUser(currentSession.user);
      
      // Check if user is admin
      try {
        console.log("[Auth] Checking admin status");
        const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error("[Auth] Error checking admin status:", adminError);
          setIsAdmin(false);
        } else {
          console.log("[Auth] Admin status result:", isAdminData);
          setIsAdmin(!!isAdminData);
        }
        
        // Persist the auth state to localStorage
        persistAuthState(currentSession.user, currentSession, !!isAdminData);
      } catch (error) {
        console.error("[Auth] Exception checking admin status:", error);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("[Auth] Exception in auth state change handler:", error);
    } finally {
      // Always ensure these states are updated, even if errors occur
      setIsLoading(false);
      isCheckingRef.current = false;
      console.log("[Auth] Auth check completed, isLoading set to false");
    }
  };

  useEffect(() => {
    console.log("[Auth] SupabaseProvider initializing");
    
    // Cancel any pending auth checks on mount
    if (authCheckTimeoutRef.current) {
      clearTimeout(authCheckTimeoutRef.current);
    }
    
    // First try to recover from localStorage to reduce flash of loading state
    if (!sessionRecoveryAttemptedRef.current) {
      sessionRecoveryAttemptedRef.current = true;
      tryRecoverSession().then(recovered => {
        if (recovered) {
          console.log("[Auth] Successfully used recovered auth state");
          // Still check with Supabase to confirm the session is valid
          authCheckTimeoutRef.current = setTimeout(async () => {
            console.log("[Auth] Getting session to validate recovered state");
            try {
              const { data: { session: initialSession }, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("[Auth] Error validating recovered session:", error);
                // Clear bad session data and finish loading
                setUser(null);
                setSession(null);
                setIsAdmin(false);
                persistAuthState(null, null, false);
                setIsLoading(false);
                return;
              }
              
              // If no current user but we have a session, handle auth state change
              if (!user && initialSession) {
                await handleAuthStateChange(initialSession);
              } else if (user && !initialSession) {
                // We have a user but no session - clear auth state
                await handleAuthStateChange(null);
              } else {
                // Just update loading state to ensure we're not stuck
                setIsLoading(false);
              }
            } catch (error) {
              console.error("[Auth] Error validating recovered session:", error);
              setIsLoading(false);
            }
          }, 100);
        } else {
          // If recovery failed, check normally
          authCheckTimeoutRef.current = setTimeout(async () => {
            try {
              console.log("[Auth] Getting initial session");
              const { data: { session: initialSession }, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("[Auth] Error getting initial session:", error);
                setIsLoading(false);
                return;
              }
              
              await handleAuthStateChange(initialSession || null);
            } catch (error) {
              console.error("[Auth] Error getting initial session:", error);
              setIsLoading(false);
            }
          }, 100);
        }
      }).catch(error => {
        console.error("[Auth] Error during session recovery:", error);
        // Ensure loading state is resolved even if recovery fails
        setIsLoading(false);
      });
    }
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, changedSession) => {
        console.log("[Auth] Auth state change event:", _event);
        await handleAuthStateChange(changedSession);
      }
    );
    
    // Cleanup on unmount
    return () => {
      console.log("[Auth] SupabaseProvider unmounting, cleaning up");
      subscription?.unsubscribe();
      
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
      
      if (loadingSafetyTimeoutRef.current) {
        clearTimeout(loadingSafetyTimeoutRef.current);
      }
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    console.log("[Auth] Signing in with email:", email);
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Auth state change handler will update the user and session
      return { data, error };
    } catch (error) {
      console.error("[Auth] Exception during sign in:", error);
      setIsLoading(false);
      return { data: null, error: error as Error };
    }
  };
  
  // Sign up with email, password, and optional full name
  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log("[Auth] Signing up with email:", email, "and fullName:", fullName || "not provided");
    
    setIsLoading(true);
    
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });
      
      if (error) {
        console.error("[Auth] Error during sign up:", error);
        setIsLoading(false);
        return { data: { user: null, session: null }, error };
      }
      
      // If registration is successful and we have a session (email confirmation not required)
      if (data.session) {
        console.log("[Auth] Sign up successful with immediate session");
        
        // Create user profile with the full name
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user?.id,
              full_name: fullName || '',
              role: 'client',
            });
            
          if (profileError) {
            console.error("[Auth] Error creating user profile:", profileError);
          }
        } catch (profileError) {
          console.error("[Auth] Exception creating user profile:", profileError);
        }
      } else {
        console.log("[Auth] Sign up successful, awaiting email confirmation");
        setIsLoading(false);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("[Auth] Exception during sign up:", error);
      setIsLoading(false);
      return { data: { user: null, session: null }, error: error as Error };
    }
  };
  
  // Sign out
  const signOut = async () => {
    console.log("[Auth] Signing out");
    
    setIsLoading(true);
    
    try {
      // Clear persisted state before signing out
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(LAST_AUTH_CHECK_KEY);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error("[Auth] Exception during sign out:", error);
      setIsLoading(false);
      return { error: error as Error };
    }
  };
  
  const value = {
    signIn,
    signUp,
    signOut,
    user,
    session,
    isLoading,
    isAdmin,
  };
  
  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 