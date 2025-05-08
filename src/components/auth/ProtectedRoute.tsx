import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useSupabase();
  const location = useLocation();
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

  if (!user) {
    // Redirect to login page if not authenticated
    // and save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children or the outlet for nested routes
  return <>{children || <Outlet />}</>;
} 