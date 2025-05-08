import React, { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { ProjectList } from '../ProjectList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function ProjectsPage() {
  const { user } = useSupabase();
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  
  // Check if the user is an admin when the component mounts
  React.useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;
      
      try {
        const adminStatus = await isAdmin(user.id);
        setUserIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
    
    checkAdminStatus();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{userIsAdmin ? 'All Projects' : 'My Projects'}</h1>
          <p className="text-muted-foreground">
            {userIsAdmin
              ? 'View and manage all client projects'
              : 'View and manage your design brief projects'}
          </p>
        </div>
        <div className="flex mt-4 md:mt-0">
          <Button asChild>
            <Link to="/design-brief">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      <ProjectList isAdmin={userIsAdmin} />
    </div>
  );
} 