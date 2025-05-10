import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();
const AUTH_STORAGE_KEY = 'f9_auth_state';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ 
    data: { user: User | null } | null; 
    error: Error | null 
  }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: new Error('Not implemented') }),
  signOut: async () => ({ error: new Error('Not implemented') }),
  signUp: async () => ({ data: null, error: new Error('Not implemented') })
});

export const StableAuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState<Omit<AuthContextType, 'signIn' | 'signOut' | 'signUp'>>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  });
  
  const authCheckRef = useRef<NodeJS.Timeout | null>(null);
  const authListenerRef = useRef<{ data: { subscription: { unsubscribe: () => void } } } | null>(null);
  
  // On mount, try to recover from localStorage first
  useEffect(() => {
    const recoveredState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (recoveredState) {
      try {
        const parsed = JSON.parse(recoveredState);
        // Only use if not expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          console.log('[StableAuth] Recovered auth state from storage');
          setAuthState({
            user: parsed.user,
            session: parsed.session,
            isLoading: false,
            isAuthenticated: true
          });
        }
      } catch (e) {
        console.error('[StableAuth] Failed to parse stored auth state', e);
      }
    }
    
    // Set up Supabase auth listener
    authListenerRef.current = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[StableAuth] Auth state changed:', event, session);
      
      if (session) {
        const user = session.user;
        setAuthState({
          user,
          session,
          isLoading: false,
          isAuthenticated: true
        });
        
        // Store in localStorage with expiry
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user,
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at
          },
          expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour cache
        }));
      } else { // This includes SIGNED_OUT and other events where session becomes null
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState({
          user: null,
          session: null,
          isLoading: false, 
          isAuthenticated: false
        });
      }
    });
    
    // Safety timeout - ensure loading state resolves after 5 seconds max
    authCheckRef.current = setTimeout(() => {
      if (authState.isLoading) {
        console.log('[StableAuth] Safety timeout reached, forcing loading state to resolve');
        // Check current session one last time before forcing loading to false
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                 setAuthState({
                    user: session.user,
                    session,
                    isLoading: false,
                    isAuthenticated: true
                 });
            } else {
                setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: !!prev.user }));
            }
        }).catch(() => {
             setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: !!prev.user }));
        });
      }
    }, 5000);
    
    return () => {
      if (authListenerRef.current?.data?.subscription) {
        authListenerRef.current.data.subscription.unsubscribe();
      }
      if (authCheckRef.current) {
        clearTimeout(authCheckRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount and unmount
  
  // Auth methods
  const signIn = async (email: string, password: string) => {
    console.log('[StableAuth] Attempting to sign in:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('[StableAuth] Sign in error:', error.message);
        return { error };
      }
      
      console.log('[StableAuth] Sign in successful');
      return { error: null };
    } catch (err) {
      console.error('[StableAuth] Sign in exception:', err);
      return { error: err instanceof Error ? err : new Error('Unknown error during sign in') };
    }
  };
  
  const signOut = async () => {
    console.log('[StableAuth] Signing out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[StableAuth] Sign out error:', error.message);
        return { error };
      }
      
      console.log('[StableAuth] Sign out successful');
      return { error: null };
    } catch (err) {
      console.error('[StableAuth] Sign out exception:', err);
      return { error: err instanceof Error ? err : new Error('Unknown error during sign out') };
    }
  };
  
  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('[StableAuth] Attempting to sign up:', email);
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('[StableAuth] Sign up error:', error.message);
        return { data: null, error };
      }
      
      // If registration is successful, also add entry to user_profiles table
      if (data.user?.id) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                full_name: fullName,
                email: email,
              },
            ]);
            
          if (profileError) {
            console.error('[StableAuth] Error creating user profile:', profileError.message);
            // We don't return this error as the auth part was successful
          }
        } catch (profileErr) {
          console.error('[StableAuth] Exception creating user profile:', profileErr);
        }
      }
      
      console.log('[StableAuth] Sign up successful');
      return { data: { user: data.user }, error: null };
    } catch (err) {
      console.error('[StableAuth] Sign up exception:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error during sign up') 
      };
    }
  };
  
  const contextValue = {
    ...authState,
    signIn,
    signOut,
    signUp
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useStableAuth = () => useContext(AuthContext); 