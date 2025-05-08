import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { getUserRole } from '@/lib/supabase/services/roleService';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useSupabase();
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setRoleLoading(false);
        }
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop view */}
      {!isMobile && (
        <div className="w-64 hidden md:block">
          <DashboardSidebar userRole={userRole} />
        </div>
      )}

      {/* Sidebar - Mobile view */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 left-4 z-50 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[80%] max-w-[280px]">
            <DashboardSidebar userRole={userRole} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader userRole={userRole} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
} 