import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase/schema';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { getProjectActivities } from '@/lib/supabase/services/activitiesService';
import { changeProjectStatus, getStatusDisplayName } from '@/lib/supabase/services/statusService';
import { deleteProject } from '@/lib/supabase/services/projectService';
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
  Activity,
  FolderOpen,
  Trash2
} from 'lucide-react';
import { Database } from '@/lib/supabase/database.types';
import { ProjectFilesViewer } from '../ProjectFilesViewer';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  // Handle project deletion
  const handleDeleteProject = () => {
    if (!user || !project) return;
    setDeleteDialogOpen(true);
  };

  // Confirm project deletion
  const confirmDeleteProject = async () => {
    if (!user || !project) return;
    
    try {
      setActionLoading(true);
      const { success, error } = await deleteProject(project.id, user.id);
      
      if (success) {
        toast({
          title: 'Project deleted',
          description: 'The project has been successfully deleted',
        });
        
        // Navigate back to the dashboard
        navigate('/dashboard');
      } else {
        throw new Error(error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete project',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {userIsAdmin && (
          <div className="flex gap-2">
            {nextStatus && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => handleStatusChange(nextStatus)}
                disabled={actionLoading}
              >
                {statusIcons[nextStatus]}
                Mark as {getStatusDisplayName(nextStatus)}
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={handleDeleteProject}
              disabled={actionLoading}
            >
              <Trash2 className="h-4 w-4" />
              Delete Project
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <ProjectDetailSkeleton />
      ) : project ? (
        <>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {project.client_name || 'Untitled Project'}
                  </CardTitle>
                  <CardDescription className="text-base flex items-center mt-2">
                    <Badge 
                      variant="outline" 
                      className={statusColors[project.status as Status]}
                    >
                      {statusIcons[project.status as Status]}
                      {getStatusDisplayName(project.status as Status)}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {userIsAdmin && nextStatus && (
                    <Button 
                      onClick={() => handleStatusChange(nextStatus)}
                      variant="default"
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span>Updating...</span>
                      ) : (
                        <>
                          {statusIcons[nextStatus]}
                          Mark as {getStatusDisplayName(nextStatus)}
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Redirect to design brief with the project
                      window.open(`/design-brief?projectId=${project.id}`, '_blank');
                    }}
                  >
                    <FileEdit className="mr-2 h-4 w-4" />
                    {userIsAdmin ? 'View Brief' : 'Continue Brief'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="activities">Activity</TabsTrigger>
                    <TabsTrigger value="files">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Files
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Information */}
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold">Client Information</h4>
                          
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
                          <h4 className="text-base font-semibold">Project Timeline</h4>
                          
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
                            <h5 className="font-medium mb-2">Status History</h5>
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
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activities">
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
                  
                  <TabsContent value="files">
                    <ProjectFilesViewer projectId={project.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center p-12">
          <p className="text-lg text-muted-foreground">Project not found</p>
        </div>
      )}

      {/* Status change confirmation dialog */}
      <AlertDialog 
        open={confirmDialogOpen} 
        onOpenChange={setConfirmDialogOpen}
      >
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
              {actionLoading ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone. 
              All project data, including design brief, files, and settings will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProject} 
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-full" />
          </TabsList>
          <div className="space-y-4 mt-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
} 