import React from 'react';
import { useStableAuth } from '@/hooks/useStableAuth';
import { ClientDashboardView } from '@/components/dashboard/ClientDashboardView';
import { ReloadIcon } from '@radix-ui/react-icons';

// Placeholder for AdminDashboardView - to be created in Phase 5
const AdminDashboardViewPlaceholder: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Admin Dashboard (Placeholder)</h1>
    <p className="mt-4">Full admin view with all briefs will be implemented in Phase 5.</p>
    {/* You can add a link to a generic list of all briefs here if briefService.getAllBriefs() is ready */}
  </div>
);

const DashboardPage: React.FC = () => {
  const { user, isLoading, isAdmin } = useStableAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ReloadIcon className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute, but as a safeguard:
    return <p>Redirecting to login...</p>; 
  }
  
  // For Phase 5, this will be a more fleshed-out AdminDashboardView
  // For now, we show a placeholder or the ClientDashboardView if they happen to be admin but no admin view is ready
  if (isAdmin) {
    // return <AdminDashboardViewPlaceholder />;
    // For Phase 3, let's allow admins to see the client view as well, or a specific message.
    // Later, this will be a proper AdminDashboardView.
    console.log("[DashboardPage] Admin user detected. Showing client view for now, or admin placeholder if preferred.");
    // If you want a distinct placeholder for admins until Phase 5 is ready:
    // return <AdminDashboardViewPlaceholder />;
    // For now, let's let admins also use the ClientDashboardView to see their own briefs.
    // In Phase 5, a proper AdminDashboardView will show all briefs.
    return <ClientDashboardView />; 
  }

  return <ClientDashboardView />;
};

export default DashboardPage; 