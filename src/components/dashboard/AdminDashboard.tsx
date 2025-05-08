import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { getAdminDashboardData } from '@/lib/supabase/services/dashboardService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, CheckCircle, Clock, Clipboard, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusSummary } from './StatusSummary';
import { ActivityFeed } from './ActivityFeed';
import { RecentClients } from './RecentClients';

export function AdminDashboard() {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAdminDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
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

  // Render loading state
  if (loading) {
    return <AdminDashboardSkeleton />;
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
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage client projects and track progress.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button asChild>
            <Link to="/dashboard/projects">View All Projects</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/clients">Manage Clients</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Projects" 
          value={dashboardData.projectCounts.total.toString()} 
          description="All managed projects"
          icon={<Clipboard className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Briefs" 
          value={dashboardData.projectCounts.brief.toString()} 
          description="Projects in brief stage"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard 
          title="Sent" 
          value={dashboardData.projectCounts.sent.toString()} 
          description="Projects sent to clients"
          icon={<BarChart className="h-4 w-4 text-orange-500" />}
        />
        <StatsCard 
          title="Completed" 
          value={dashboardData.projectCounts.complete.toString()} 
          description="Completed projects"
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent-projects">Recent Projects</TabsTrigger>
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* StatusSummary Component */}
          <StatusSummary projectCounts={dashboardData.projectCounts} />
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Clients Component */}
            <RecentClients clients={dashboardData.recentClients} />

            {/* Client Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Clients
                </CardTitle>
                <CardDescription>Client account summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Clients:</span>
                    <span className="font-medium">{dashboardData.userCounts.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Administrators:</span>
                    <span className="font-medium">{dashboardData.userCounts.admins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Projects per Client:</span>
                    <span className="font-medium">
                      {dashboardData.userCounts.clients > 0 
                        ? (dashboardData.projectCounts.total / dashboardData.userCounts.clients).toFixed(1) 
                        : '0'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard/clients">View All Clients</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Projects Tab */}
        <TabsContent value="recent-projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest project updates</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentProjects && dashboardData.recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentProjects.map((project: any) => (
                    <div key={project.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{project.client_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'brief' 
                            ? 'bg-blue-100 text-blue-800' 
                            : project.status === 'sent'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.project_description || 'No description'}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Last updated: {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/dashboard/projects/${project.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No recent projects found
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/projects">View All Projects</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="recent-activity" className="space-y-4">
          {/* ActivityFeed Component */}
          <ActivityFeed 
            activities={dashboardData.recentActivity} 
            maxItems={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
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