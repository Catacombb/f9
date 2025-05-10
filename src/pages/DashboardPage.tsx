import React from 'react';
import { useStableAuth } from '@/hooks/useStableAuth';
import { ClientDashboardView } from '@/components/dashboard/ClientDashboardView';
import { AdminDashboardView } from '@/components/dashboard/AdminDashboardView';
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
  
  if (isAdmin) {
    return <AdminDashboardView />;
  }

  return <ClientDashboardView />;
};

export default DashboardPage; 