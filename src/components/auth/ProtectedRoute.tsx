import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { ReloadIcon } from '@radix-ui/react-icons'; // For loading state

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: for role-based access control later
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, session, isLoading, isAdmin } = useSupabase();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner or a blank page while auth state is being determined
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ReloadIcon className="mr-2 h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !user) {
    // User not authenticated, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Role-based access control (can be expanded in Phase 5)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = isAdmin ? 'admin' : 'client'; // Simplified role determination for now
    if (!allowedRoles.includes(userRole)) {
      // User role not allowed, redirect to an unauthorized page or dashboard
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
      // Consider creating a specific /unauthorized page later
    }
  }

  // User is authenticated and (if applicable) has an allowed role
  return <Outlet />; // Render the child route elements
}; 