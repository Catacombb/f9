import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStableAuth } from '@/hooks/useStableAuth';
import { ReloadIcon } from '@radix-ui/react-icons'; // For loading state

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: for role-based access control later
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, session, isLoading, isAuthenticated } = useStableAuth();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  console.log('[ProtectedRoute] Current state:', { 
    user: user ? `${user.id} (${user.email})` : 'null', 
    session: session ? 'active' : 'null',
    isLoading, 
    pathname: location.pathname 
  });

  // Use an effect to handle the initial loading state
  useEffect(() => {
    // Set a timeout to stop showing the loading spinner after a reasonable time
    // This prevents indefinite loading if there's an issue with auth
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('[ProtectedRoute] Auth check taking too long, stopping initial load state');
        setInitialLoad(false);
      }
    }, 5000); // 5 seconds max loading time

    // When isLoading becomes false, we've completed the auth check
    if (!isLoading) {
      console.log('[ProtectedRoute] Auth check completed, user:', user ? 'authenticated' : 'not authenticated');
      setInitialLoad(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isLoading, user]);

  // Only show loading during initial page load
  if (initialLoad && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ReloadIcon className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Verifying authentication...</p>
      </div>
    );
  }

  // After initial load, if we've determined there's no authentication, redirect to login
  if (!isAuthenticated || !user) {
    console.log('[ProtectedRoute] No authenticated session found, redirecting to /login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0) {
    // Get role from user object if available, otherwise assume 'client'
    const userRole = user.app_metadata?.role === 'admin' ? 'admin' : 'client';
    if (!allowedRoles.includes(userRole)) {
      console.log('[ProtectedRoute] User role not allowed, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has appropriate role
  console.log('[ProtectedRoute] Authentication verified, rendering protected content');
  return <Outlet />;
}; 