import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { changeProjectStatus } from '@/lib/supabase/services/statusService';
import { deleteProject } from '@/lib/supabase/services/projectService';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, FileEdit, MoreHorizontal, ArrowRight, CheckCircle, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type Status = 'brief' | 'sent' | 'complete';

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export function ProjectCard({ project, isAdmin = false, onDelete }: ProjectCardProps) {
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<Status | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Status helpers
  const statusColors = {
    brief: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    sent: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    complete: 'bg-green-100 text-green-800 hover:bg-green-200'
  };

  const statusLabels = {
    brief: 'Brief',
    sent: 'Sent',
    complete: 'Complete'
  };

  const statusIcons = {
    brief: <Clock className="h-3 w-3 mr-1" />,
    sent: <ArrowRight className="h-3 w-3 mr-1" />,
    complete: <CheckCircle className="h-3 w-3 mr-1" />
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle status change
  const handleStatusChange = async (newStatus: Status) => {
    if (!user || !project.id) return;
    
    setStatusToChange(newStatus);
    setConfirmDialogOpen(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!user || !project.id || !statusToChange) return;
    
    try {
      setLoading(true);
      await changeProjectStatus(project.id, statusToChange, user.id);
      toast({
        title: 'Status updated',
        description: `Project status changed to ${statusLabels[statusToChange]}`,
      });
      // In a real app, you'd update the project data or refetch it
    } catch (error) {
      console.error('Error changing status:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
      setStatusToChange(null);
    }
  };

  // Handle project deletion
  const handleDeleteProject = () => {
    if (!user || !project.id) return;
    setDeleteDialogOpen(true);
  };

  // Confirm project deletion
  const confirmDeleteProject = async () => {
    if (!user || !project.id) return;
    
    try {
      setLoading(true);
      const { success, error } = await deleteProject(project.id, user.id);
      
      if (success) {
        toast({
          title: 'Project deleted',
          description: 'The project has been successfully deleted',
        });
        
        // Call the onDelete callback if provided to refresh the project list
        if (onDelete) {
          onDelete();
        }
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
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Calculate next available status
  const getNextStatus = (): Status | null => {
    const currentStatus = project.status as Status;
    if (currentStatus === 'brief') return 'sent';
    if (currentStatus === 'sent') return 'complete';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold truncate">
                {project.client_name || 'Unnamed Project'}
              </h3>
              <p className="text-xs text-muted-foreground">
                ID: {project.id?.substring(0, 8)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[project.status as Status] || 'bg-gray-100'}>
                {statusIcons[project.status as Status]}
                {statusLabels[project.status as Status] || project.status}
              </Badge>
              
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/projects/${project.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/design-brief/${project.id}`}>Edit Brief</Link>
                    </DropdownMenuItem>
                    
                    {/* Status change options - only show valid transitions */}
                    {project.status !== 'complete' && (
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(nextStatus as Status)}
                        disabled={loading || !nextStatus}
                      >
                        Mark as {statusLabels[nextStatus as Status]}
                      </DropdownMenuItem>
                    )}
                    
                    {/* If complete, allow reverting to sent */}
                    {project.status === 'complete' && (
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange('sent')}
                        disabled={loading}
                      >
                        Revert to Sent
                      </DropdownMenuItem>
                    )}
                    
                    {/* If sent, allow reverting to brief */}
                    {project.status === 'sent' && (
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange('brief')}
                        disabled={loading}
                      >
                        Revert to Brief
                      </DropdownMenuItem>
                    )}
                    
                    {/* Delete project option */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleDeleteProject} 
                      disabled={loading}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.project_description || 'No description provided'}
          </p>
          
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Updated:
            </div>
            <div className="text-xs">
              {formatDate(project.updated_at)}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <FileEdit className="h-3 w-3 mr-1" />
              Created:
            </div>
            <div className="text-xs">
              {formatDate(project.created_at)}
            </div>
            
            {project.status_updated_at && (
              <>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Status Changed:
                </div>
                <div className="text-xs">
                  {formatDate(project.status_updated_at)}
                </div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/projects/${project.id}`}>
              View Details
            </Link>
          </Button>
          
          {isAdmin && nextStatus && (
            <Button 
              size="sm" 
              disabled={loading}
              onClick={() => handleStatusChange(nextStatus)}
            >
              Mark {statusLabels[nextStatus]}
            </Button>
          )}
          
          {!isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/design-brief/${project.id}`}>
                Edit Brief
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Project Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this project from
              "{statusLabels[project.status as Status]}" to "{statusLabels[statusToChange as Status]}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange} 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Confirm'}
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
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProject} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 