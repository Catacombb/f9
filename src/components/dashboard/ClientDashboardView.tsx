import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { briefService, BriefFull } from '@/lib/supabase/services/briefService';
import { useStableAuth } from '@/hooks/useStableAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ReloadIcon, PlusCircledIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

export const ClientDashboardView: React.FC = () => {
  const { user, isLoading: authLoading } = useStableAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<BriefFull[]>([]);
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBrief, setEditingBrief] = useState<{id: string, title: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBriefs = useCallback(async () => {
    if (!user) return;
    setIsLoadingBriefs(true);
    setError(null);
    try {
      const { data, error: fetchError } = await briefService.getUserBriefs();
      if (fetchError) {
        console.error('[ClientDashboardView] Error fetching briefs:', fetchError);
        setError(fetchError.message || 'Failed to load briefs.');
        toast({
          title: "Error",
          description: "Could not fetch your design briefs. Please try again later.",
          variant: "destructive",
        });
      } else {
        setBriefs(data || []);
      }
    } catch (e: any) {
      console.error('[ClientDashboardView] Unexpected error fetching briefs:', e);
      setError('An unexpected error occurred.');
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching briefs.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBriefs(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchBriefs();
    }
  }, [user, fetchBriefs]);

  const handleDeleteBrief = async (briefId: string) => {
    try {
      const { error: deleteError } = await briefService.deleteBrief(briefId);
      if (deleteError) {
        console.error('[ClientDashboardView] Error deleting brief:', deleteError);
        toast({
          title: "Error Deleting Brief",
          description: deleteError.message || "Could not delete the brief. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Brief Deleted",
          description: "The brief has been successfully deleted.",
        });
        setBriefs(prevBriefs => prevBriefs.filter(b => b.id !== briefId));
      }
    } catch (e:any) {
      console.error('[ClientDashboardView] Unexpected error deleting brief:', e);
      toast({
        title: "Error Deleting Brief",
        description: "An unexpected error occurred while deleting the brief.",
        variant: "destructive",
      });
    }
  };

  const handleEditBrief = (brief: BriefFull) => {
    setEditingBrief({
      id: brief.id,
      title: brief.title || 'Untitled Brief'
    });
  };

  const handleUpdateBriefTitle = async () => {
    if (!editingBrief) return;
    
    setIsUpdating(true);
    try {
      const { error: updateError } = await briefService.updateBriefTitle(
        editingBrief.id,
        editingBrief.title
      );
      
      if (updateError) {
        console.error('[ClientDashboardView] Error updating brief title:', updateError);
        toast({
          title: "Error Updating Brief",
          description: updateError.message || "Could not update the brief. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Brief Updated",
          description: "The brief has been successfully updated.",
        });
        
        // Update the local state to reflect changes
        setBriefs(prevBriefs => 
          prevBriefs.map(b => 
            b.id === editingBrief.id 
              ? { ...b, title: editingBrief.title } 
              : b
          )
        );
        
        // Reset editing state
        setEditingBrief(null);
      }
    } catch (e:any) {
      console.error('[ClientDashboardView] Unexpected error updating brief:', e);
      toast({
        title: "Error Updating Brief",
        description: "An unexpected error occurred while updating the brief.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <ReloadIcon className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Loading user information...</p>
      </div>
    );
  }

  if (isLoadingBriefs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <ReloadIcon className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Loading your design briefs...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBriefs} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Design Briefs</h1>
        <Button onClick={() => navigate('/create-brief')}>
          <PlusCircledIcon className="mr-2 h-5 w-5" /> Create New Brief
        </Button>
      </div>

      {briefs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">You haven't created any design briefs yet.</p>
          <Button onClick={() => navigate('/create-brief')} size="lg">
            <PlusCircledIcon className="mr-2 h-5 w-5" /> Create Your First Brief
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {briefs.map(brief => (
            <Card key={brief.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{brief.title || 'Untitled Brief'}</CardTitle>
                <CardDescription>
                  Last updated: {new Date(brief.updated_at || brief.created_at || Date.now()).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">{brief.status || 'Draft'}</span></p>
                {/* Add more brief details here if needed */}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleEditBrief(brief)}>
                      <Pencil2Icon className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Brief</DialogTitle>
                      <DialogDescription>
                        Update the title of your brief. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    {editingBrief && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Brief Title</Label>
                          <Input 
                            id="title" 
                            value={editingBrief.title} 
                            onChange={(e) => setEditingBrief({...editingBrief, title: e.target.value})}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        onClick={handleUpdateBriefTitle} 
                        disabled={isUpdating || !editingBrief?.title.trim()}
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => navigate(`/design-brief/${brief.id}`)}>
                  <Pencil2Icon className="mr-2 h-4 w-4" /> Continue Editing
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the brief
                        "<strong>{brief.title || 'Untitled Brief'}</strong>".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteBrief(brief.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
    </div>
  );
}; 