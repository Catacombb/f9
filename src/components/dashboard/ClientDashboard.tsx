import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { getClientDashboardData } from '@/lib/supabase/services/dashboardService';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, File, Clock, CheckCircle, FileEdit, PieChart, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ActivityFeed } from './ActivityFeed';
import { setForceProjectCreation } from '@/context/DesignBriefContext';

export function ClientDashboard() {
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [error, setError] = useState<string | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getClientDashboardData(user.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Error loading client dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error loading dashboard',
          description: 'There was a problem loading your dashboard data.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, toast]);

  // Handler for creating a new design brief
  const handleCreateNewBrief = () => {
    // Set the force creation flag before navigating
    setForceProjectCreation();
    navigate('/design-brief?create=true');
  };

  // Render loading state
  if (loading) {
    return <ClientDashboardSkeleton />;
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Safeguard against null data
  if (!dashboardData) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No dashboard data is available. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {userIsAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {userIsAdmin 
            ? 'Manage client projects and track activity'
            : 'Track your projects and view recent activity'}
        </p>
      </div>

      {/* Project Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <File className="h-4 w-4 mr-2 text-primary" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {userIsAdmin ? 'All client projects' : 'All your projects'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.inProgressProjects}</div>
            <p className="text-xs text-muted-foreground">Projects being processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Finalized projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Button - Different for admins and clients */}
      <div className="flex justify-center">
        {!userIsAdmin ? (
          // Client users see "Create New Design Brief" button
          <Button onClick={handleCreateNewBrief} className="w-full md:w-auto">
            <FileEdit className="mr-2 h-4 w-4" />
            Create New Design Brief
          </Button>
        ) : (
          // Admin users see "Manage Client Projects" button
          <Button asChild className="w-full md:w-auto">
            <Link to="/dashboard/projects">
              <Users className="mr-2 h-4 w-4" />
              Manage Client Projects
            </Link>
          </Button>
        )}
      </div>

      {/* Tabs for projects and activity */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">
            {userIsAdmin ? 'Recent Projects' : 'My Projects'}
          </TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {userIsAdmin ? 'Recent Projects' : 'My Projects'}
              </CardTitle>
              <CardDescription>
                {userIsAdmin 
                  ? 'Recently updated client design briefs' 
                  : 'All your design briefs and their current status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.projects && dashboardData.projects.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.projects.map((project: any) => (
                    <div key={project.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{project.client_name || 'Unnamed Project'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'brief' 
                            ? 'bg-blue-100 text-blue-800' 
                            : project.status === 'sent'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {project.status === 'brief' ? 'In Progress' : 
                           project.status === 'sent' ? 'Under Review' : 'Complete'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.project_description || 'No description provided'}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Last updated: {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          {!userIsAdmin && (
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/design-brief?projectId=${project.id}`}>
                                Edit
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/dashboard/projects/${project.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  {!userIsAdmin ? (
                    <>
                      <p className="text-muted-foreground mb-4">
                        Create a new design brief to get started with your project.
                      </p>
                      <Button onClick={handleCreateNewBrief}>
                        Create Design Brief
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      There are no client projects available at this time.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed 
            activities={dashboardData.activities || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading skeleton
function ClientDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Button Skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div>
        <Skeleton className="h-10 w-full mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 