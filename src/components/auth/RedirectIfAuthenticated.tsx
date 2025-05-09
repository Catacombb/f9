import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { Loader2 } from 'lucide-react';

/**
 * Component that redirects users to the dashboard if they're already logged in
 * Use this to wrap public routes like login and register
 */
export function RedirectIfAuthenticated() {
  const { user, loading } = useSupabase();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure the auth state is properly loaded
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, loading]);

  if (isCheckingAuth || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (user) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, render the outlet
  return <Outlet />;
} 