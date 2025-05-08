import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase/schema';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { getProjectActivities } from '@/lib/supabase/services/activitiesService';
import { changeProjectStatus, getStatusDisplayName } from '@/lib/supabase/services/statusService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft,
  Clock, 
  FileEdit, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Activity
} from 'lucide-react';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];
type Status = 'brief' | 'sent' | 'complete';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSupabase();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<Status | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Status helpers
  const statusColors = {
    brief: 'bg-blue-100 text-blue-800',
    sent: 'bg-orange-100 text-orange-800',
    complete: 'bg-green-100 text-green-800'
  };

  const statusIcons = {
    brief: <Clock className="h-4 w-4 mr-2" />,
    sent: <ArrowRight className="h-4 w-4 mr-2" />,
    complete: <CheckCircle className="h-4 w-4 mr-2" />
  };

  // Check admin status
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

  // Load project data
  useEffect(() => {
    async function loadProject() {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error(`Error fetching project: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('Project not found');
        }
        
        // Check if user has access to this project (is admin or project owner)
        if (!userIsAdmin && data.user_id !== user.id) {
          toast({
            variant: 'destructive',
            title: 'Access denied',
            description: 'You do not have permission to view this project',
          });
          navigate('/dashboard');
          return;
        }
        
        setProject(data);
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading project',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    
    loadProject();
  }, [id, user, userIsAdmin, navigate, toast]);

  // Load project activities
  useEffect(() => {
    async function loadActivities() {
      if (!id) return;
      
      try {
        setActivitiesLoading(true);
        const activities = await getProjectActivities(id);
        setActivities(activities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    }
    
    loadActivities();
  }, [id]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time helper
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  // Calculate next available status
  const getNextStatus = (): Status | null => {
    if (!project) return null;
    
    const currentStatus = project.status as Status;
    if (currentStatus === 'brief') return 'sent';
    if (currentStatus === 'sent') return 'complete';
    return null;
  };

  const nextStatus = getNextStatus();

  // Handle status change
  const handleStatusChange = (newStatus: Status) => {
    if (!user || !project) return;
    
    setStatusToChange(newStatus);
    setConfirmDialogOpen(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!user || !project || !statusToChange) return;
    
    try {
      setActionLoading(true);
      const updatedProject = await changeProjectStatus(project.id, statusToChange, user.id);
      
      setProject(updatedProject);
      
      // Refresh activities
      const activities = await getProjectActivities(project.id);
      setActivities(activities);
      
      toast({
        title: 'Status updated',
        description: `Project status changed to ${getStatusDisplayName(statusToChange)}`,
      });
    } catch (error) {
      console.error('Error changing status:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setActionLoading(false);
      setConfirmDialogOpen(false);
      setStatusToChange(null);
    }
  };

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Project Details</h1>
        </div>
        
        {/* Project Overview Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">{project.client_name || 'Unnamed Project'}</CardTitle>
                <CardDescription>{project.project_description || 'No description provided'}</CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className={`text-sm px-3 py-1 ${statusColors[project.status as Status] || 'bg-gray-100'}`}>
                  {statusIcons[project.status as Status]}
                  {getStatusDisplayName(project.status as Status)}
                </Badge>
                
                {userIsAdmin && nextStatus && (
                  <Button 
                    size="sm" 
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(nextStatus)}
                  >
                    Mark as {getStatusDisplayName(nextStatus)}
                  </Button>
                )}
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/design-brief/${project.id}`}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit Brief
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Client Information</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Client Name</p>
                          <p className="text-muted-foreground">{project.client_name || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{project.contact_email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{project.contact_phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-muted-foreground">{project.project_address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-muted-foreground">{formatDate(project.created_at)} at {formatTime(project.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileEdit className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-muted-foreground">{formatDate(project.updated_at)} at {formatTime(project.updated_at)}</p>
                        </div>
                      </div>
                      
                      {project.status_updated_at && (
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Status Last Changed</p>
                            <p className="text-muted-foreground">
                              {formatDate(project.status_updated_at)} at {formatTime(project.status_updated_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Status History</h4>
                      <div className="space-y-2">
                        {activitiesLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                          </div>
                        ) : activities.length > 0 ? (
                          activities
                            .filter(activity => activity.activity_type === 'status_change')
                            .map((activity, index) => (
                              <div key={activity.id} className="flex items-center text-sm">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  (activity.details as any).new_status === 'brief' ? 'bg-blue-500' :
                                  (activity.details as any).new_status === 'sent' ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`} />
                                <span>
                                  Changed from <strong>{getStatusDisplayName((activity.details as any).previous_status)}</strong> to{' '}
                                  <strong>{getStatusDisplayName((activity.details as any).new_status)}</strong>{' '}
                                  on {formatDate(activity.created_at)}
                                </span>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No status changes recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Timeline Tab */}
              <TabsContent value="timeline" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Activity Timeline</h3>
                  
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-8">
                      {activities.map((activity, index) => (
                        <div key={activity.id} className="relative pl-8">
                          {/* Timeline line */}
                          {index < activities.length - 1 && (
                            <div className="absolute top-6 bottom-0 left-4 w-px bg-border"></div>
                          )}
                          
                          {/* Timeline dot */}
                          <div className={`absolute top-1 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.activity_type === 'status_change' 
                              ? 'bg-blue-100' 
                              : 'bg-gray-100'
                          }`}>
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          
                          {/* Activity content */}
                          <div className="pb-8">
                            <p className="font-medium">
                              {activity.activity_type === 'status_change'
                                ? `Status changed from "${getStatusDisplayName((activity.details as any).previous_status)}" to "${getStatusDisplayName((activity.details as any).new_status)}"`
                                : activity.activity_type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(activity.created_at)} at {formatTime(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-md">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No activity recorded</h3>
                      <p className="text-muted-foreground">
                        There is no activity history for this project yet.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Documents</h3>
                  
                  <div className="text-center p-8 border rounded-md">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Design Brief</h3>
                    <p className="text-muted-foreground mb-4">
                      View or edit the complete design brief for this project.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button asChild>
                        <Link to={`/design-brief/${project.id}`}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Brief
                        </Link>
                      </Button>
                      <Button variant="outline">
                        View PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Project Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this project from
              "{getStatusDisplayName(project.status as Status)}" to "{getStatusDisplayName(statusToChange as Status)}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : 'Yes, Change Status'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-48" />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 