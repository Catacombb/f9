import { useEffect, useState, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const supabase = createBrowserSupabaseClient();

export interface SupabaseContextProps {
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { session: Session | null; user: User | null; } | null; // Modified to match Supabase signInWithPassword response
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  user: User | null;
  session: Session | null; // Added session state
  isLoading: boolean;
  isAdmin: boolean;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Added session state
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setIsLoading(false);
        return;
      }

      setSession(currentSession ?? null);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        try {
          const { data: adminStatus, error: rpcError } = await supabase.rpc('is_admin');
          if (rpcError) {
            console.error("Error calling is_admin RPC:", rpcError);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!adminStatus);
          }
        } catch (rpcCatchError) {
            console.error("Exception calling is_admin RPC:", rpcCatchError);
            setIsAdmin(false);
        }
      } else {
        setIsAdmin(false); // No user, so not an admin
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          try {
            const { data: adminStatus, error: rpcError } = await supabase.rpc('is_admin');
            if (rpcError) {
              console.error("Error calling is_admin RPC on auth change:", rpcError);
              setIsAdmin(false);
            } else {
              setIsAdmin(!!adminStatus);
            }
          } catch (rpcCatchError) {
            console.error("Exception calling is_admin RPC on auth change:", rpcCatchError);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false); // No user, so not an admin
        }
        setIsLoading(false); // Update loading state after auth change processed
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.session?.user) { // Check user on session from response
      try {
        const { data: adminStatus, error: rpcError } = await supabase.rpc('is_admin');
        if (rpcError) {
          console.error("Error calling is_admin RPC on sign in:", rpcError);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminStatus);
        }
      } catch (rpcCatchError) {
          console.error("Exception calling is_admin RPC on sign in:", rpcCatchError);
          setIsAdmin(false);
      }
    } else if (!data?.session) { // No session means sign in failed or no user
        setIsAdmin(false);
    }

    // Ensure the data structure matches SupabaseContextProps for signIn
    return { data: data ? { session: data.session, user: data.user } : null, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { data: { user: null, session: null }, error: signUpError };
    }

    if (signUpData.user) {
      // User registration was successful, now create a profile.
      // The user object might not have an email if it's a phone auth, but here it should.
      // Extract full_name if available, or default to something, or leave null as per schema.
      // For now, we'll just use the user ID.
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({ 
            id: signUpData.user.id, 
            // full_name can be added later, e.g., from a profile form
            // role defaults to 'client' in the database schema
          });

        if (profileError) {
          // Log the error, but the user is already created in auth.users.
          // This could lead to a state where auth user exists but profile doesn't.
          // Robust error handling might involve trying to delete the auth user or queueing profile creation.
          console.error('Error creating user profile:', profileError);
          // Decide if this error should be returned to the UI. 
          // For now, we proceed as signup itself was successful from auth perspective.
        }
      } catch (profileCatchError) {
        console.error('Exception creating user profile:', profileCatchError);
      }
    }
    
    return { data: { user: signUpData.user, session: signUpData.session }, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setIsAdmin(false); // Reset admin status on sign out
    setUser(null); // Reset user on sign out
    setSession(null); // Reset session on sign out
    return { error };
  };

  const value = {
    signIn,
    signUp,
    signOut,
    user,
    session, // expose session
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