import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { briefService, BriefFull } from '@/lib/supabase/services/briefService';
import { useStableAuth } from '@/hooks/useStableAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ReloadIcon, PlusCircledIcon, Pencil2Icon, TrashIcon, EyeOpenIcon, CheckIcon, DownloadIcon } from '@radix-ui/react-icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export const ClientDashboardView: React.FC = () => {
  const { user, isLoading: authLoading } = useStableAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<BriefFull[]>([]);
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBrief, setEditingBrief] = useState<{id: string, title: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [acceptingProposal, setAcceptingProposal] = useState<{id: string, title: string} | null>(null);
  const [acceptanceMessage, setAcceptanceMessage] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);
  const supabase = createBrowserSupabaseClient();

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

  const handleSubmitBrief = async (briefId: string) => {
    try {
      const { error } = await briefService.updateBriefStatus(briefId, 'brief_ready');
      
      if (error) {
        console.error('[ClientDashboardView] Error submitting brief:', error);
        toast({
          title: "Error Submitting Brief",
          description: "Could not submit your brief to F9. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Brief Submitted",
          description: "Your brief has been successfully submitted to F9 for review.",
        });
        
        // Update the local state to reflect changes
        setBriefs(prevBriefs => 
          prevBriefs.map(b => 
            b.id === briefId 
              ? { ...b, status: 'brief_ready' } 
              : b
          )
        );
      }
    } catch (e:any) {
      console.error('[ClientDashboardView] Unexpected error submitting brief:', e);
      toast({
        title: "Error Submitting Brief",
        description: "An unexpected error occurred while submitting your brief.",
        variant: "destructive",
      });
    }
  };

  const downloadProposal = async (brief: BriefFull) => {
    if (!brief.proposal_file_id) {
      toast({
        title: "No Proposal Available",
        description: "There is no proposal available for this brief yet.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // First, get the file record
      const { data: fileData } = await supabase
        .from('brief_files')
        .select('storage_path, bucket_id')
        .eq('id', brief.proposal_file_id)
        .single();
        
      if (!fileData) {
        toast({
          title: "Error",
          description: "Could not find the proposal file.",
          variant: "destructive",
        });
        return;
      }
      
      // Then get a temporary URL for the file
      const { data: urlData } = await supabase.storage
        .from(fileData.bucket_id)
        .createSignedUrl(fileData.storage_path, 3600); // URL valid for 1 hour
        
      if (urlData?.signedUrl) {
        // Open the proposal in a new tab
        window.open(urlData.signedUrl, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Could not generate a link to the proposal.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error('[ClientDashboardView] Error downloading proposal:', e);
      toast({
        title: "Error",
        description: "An error occurred while retrieving the proposal.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptProposal = (brief: BriefFull) => {
    setAcceptingProposal({
      id: brief.id,
      title: brief.title || 'Untitled Brief'
    });
    setAcceptanceMessage('');
  };

  const submitAcceptProposal = async () => {
    if (!acceptingProposal) return;
    
    setIsAccepting(true);
    try {
      const { error } = await briefService.acceptProposal(
        acceptingProposal.id,
        acceptanceMessage
      );
      
      if (error) {
        console.error('[ClientDashboardView] Error accepting proposal:', error);
        toast({
          title: "Error Accepting Proposal",
          description: error.message || "Could not accept the proposal. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Proposal Accepted",
          description: "You have successfully accepted the proposal.",
        });
        
        // Update the local state to reflect changes
        setBriefs(prevBriefs => 
          prevBriefs.map(b => 
            b.id === acceptingProposal.id 
              ? { ...b, status: 'proposal_accepted' } 
              : b
          )
        );
        
        // Reset acceptance state
        setAcceptingProposal(null);
      }
    } catch (e:any) {
      console.error('[ClientDashboardView] Unexpected error accepting proposal:', e);
      toast({
        title: "Error Accepting Proposal",
        description: "An unexpected error occurred while accepting the proposal.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
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
                {/* Progress Tracker */}
                <ProgressTracker 
                  status={brief.status as any || 'draft'} 
                  className="mb-4" 
                />
                
                <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">{brief.status || 'Draft'}</span></p>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-2">
                {/* Actions based on status */}
                {brief.status === 'draft' && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEditBrief(brief)}>
                          <Pencil2Icon className="mr-2 h-4 w-4" /> Edit Title
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
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleSubmitBrief(brief.id)}
                    >
                      Submit to F9
                    </Button>
                  </>
                )}
                
                {brief.status === 'brief_ready' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/design-brief/${brief.id}`)}>
                      <EyeOpenIcon className="mr-2 h-4 w-4" /> View Brief
                    </Button>
                    <Button variant="secondary" size="sm" disabled>
                      Awaiting Proposal
                    </Button>
                  </>
                )}
                
                {brief.status === 'proposal_sent' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadProposal(brief)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download Proposal
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          <CheckIcon className="mr-2 h-4 w-4" /> Accept Proposal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Accept Proposal</DialogTitle>
                          <DialogDescription>
                            Accept the proposal for "{brief.title || 'Untitled Brief'}". You can leave a message with your acceptance.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea 
                              id="message" 
                              placeholder="Add any comments or questions here..." 
                              rows={4}
                              value={acceptanceMessage}
                              onChange={(e) => setAcceptanceMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button 
                            onClick={submitAcceptProposal} 
                            disabled={isAccepting}
                          >
                            {isAccepting ? 'Accepting...' : 'Accept Proposal'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                
                {brief.status === 'proposal_accepted' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadProposal(brief)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download Proposal
                    </Button>
                    
                    <Button variant="secondary" size="sm" disabled>
                      <CheckIcon className="mr-2 h-4 w-4" /> Proposal Accepted
                    </Button>
                  </>
                )}
                
                {/* Delete button always shown */}
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