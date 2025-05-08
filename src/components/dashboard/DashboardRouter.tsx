import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { getUserRole } from '@/lib/supabase/services/roleService';
import { DashboardLayout } from './DashboardLayout';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

export function DashboardRouter() {
  const { user, loading } = useSupabase();
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      if (!user && !loading) {
        // Redirect to login if no user is authenticated
        navigate('/login');
        return;
      }

      if (user) {
        try {
          setRoleLoading(true);
          // Get the user's role
          const role = await getUserRole(user.id);
          setUserRole(role);
          setRoleLoading(false);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRoleLoading(false);
        }
      } else {
        setRoleLoading(false);
      }
    }

    checkUser();
  }, [user, loading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect in the useEffect
  }

  return (
    <DashboardLayout>
      {userRole === 'admin' ? (
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          {/* 
            Add additional admin routes here, such as:
            <Route path="/clients" element={<ClientsList />} />
            etc.
          */}
          {/* Fallback for undefined routes */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          {/* 
            Add additional client routes here as needed
          */}
          {/* Fallback for undefined routes */}
          <Route path="*" element={<ClientDashboard />} />
        </Routes>
      )}
    </DashboardLayout>
  );
} 