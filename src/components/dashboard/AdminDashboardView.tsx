import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefService, BriefFull } from '@/lib/supabase/services/briefService';
import { useStableAuth } from '@/hooks/useStableAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ReloadIcon, Pencil2Icon, TrashIcon, UploadIcon, CheckIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export const AdminDashboardView: React.FC = () => {
  const { user, isLoading: authLoading } = useStableAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<BriefFull[]>([]);
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBrief, setEditingBrief] = useState<{id: string, title: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingProposal, setUploadingProposal] = useState<{id: string, title: string} | null>(null);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const fetchBriefs = useCallback(async () => {
    if (!user) return;
    setIsLoadingBriefs(true);
    setError(null);
    try {
      const { data, error: fetchError } = await briefService.getAllBriefs();
      if (fetchError) {
        console.error('[AdminDashboardView] Error fetching briefs:', fetchError);
        setError(fetchError.message || 'Failed to load briefs.');
        toast({
          title: "Error",
          description: "Could not fetch design briefs. Please try again later.",
          variant: "destructive",
        });
      } else {
        setBriefs(data || []);
      }
    } catch (e: any) {
      console.error('[AdminDashboardView] Unexpected error fetching briefs:', e);
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
        console.error('[AdminDashboardView] Error deleting brief:', deleteError);
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
      console.error('[AdminDashboardView] Unexpected error deleting brief:', e);
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
        console.error('[AdminDashboardView] Error updating brief title:', updateError);
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
      console.error('[AdminDashboardView] Unexpected error updating brief:', e);
      toast({
        title: "Error Updating Brief",
        description: "An unexpected error occurred while updating the brief.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadProposal = (brief: BriefFull) => {
    setUploadingProposal({
      id: brief.id,
      title: brief.title || 'Untitled Brief'
    });
    setProposalFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setProposalFile(file);
    }
  };

  const submitProposalUpload = async () => {
    if (!uploadingProposal || !proposalFile) return;
    
    setIsUploading(true);
    try {
      const { fileId, error } = await briefService.uploadProposal(
        uploadingProposal.id,
        proposalFile
      );
      
      if (error) {
        console.error('[AdminDashboardView] Error uploading proposal:', error);
        toast({
          title: "Error Uploading Proposal",
          description: error.message || "Could not upload the proposal. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Proposal Uploaded",
          description: "The proposal has been successfully uploaded and sent to the client.",
        });
        
        // Update the local state to reflect changes
        setBriefs(prevBriefs => 
          prevBriefs.map(b => 
            b.id === uploadingProposal.id 
              ? { 
                  ...b, 
                  status: 'proposal_sent',
                  proposal_file_id: fileId || undefined
                } 
              : b
          )
        );
        
        // Reset upload state
        setUploadingProposal(null);
        setProposalFile(null);
      }
    } catch (e:any) {
      console.error('[AdminDashboardView] Unexpected error uploading proposal:', e);
      toast({
        title: "Error Uploading Proposal",
        description: "An unexpected error occurred while uploading the proposal.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
      console.error('[AdminDashboardView] Error downloading proposal:', e);
      toast({
        title: "Error",
        description: "An error occurred while retrieving the proposal.",
        variant: "destructive",
      });
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
        <p className="text-lg">Loading all design briefs...</p>
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
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 pb-4 border-b">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Administrator Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-1">Manage all design briefs and system settings.</p>
        </div>
        <Badge variant="outline" className="text-sm font-semibold mt-4 md:mt-0">ADMIN MODE</Badge>
      </div>

      {briefs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">There are no design briefs in the system yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {briefs.map(brief => (
            <Card key={brief.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{brief.title || 'Untitled Brief'}</CardTitle>
                <CardDescription>
                  User: {brief.user_profiles?.full_name || brief.owner_id}
                </CardDescription>
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
                <p className="text-sm text-muted-foreground mt-1">Owner ID: <span className="font-mono text-xs">{brief.owner_id}</span></p>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-2">
                {/* Edit Title and View Brief buttons for all statuses */}
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
                        Update the title of the brief for {brief.user_profiles?.full_name || 'user'}.
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
                  <EyeOpenIcon className="mr-2 h-4 w-4" /> View Brief
                </Button>

                {/* Additional buttons based on status */}
                {brief.status === 'brief_ready' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" onClick={() => handleUploadProposal(brief)}>
                        <UploadIcon className="mr-2 h-4 w-4" /> Upload Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Proposal</DialogTitle>
                        <DialogDescription>
                          Upload a proposal PDF for "{brief.title || 'Untitled Brief'}" to send to the client.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="proposal-file">Proposal PDF</Label>
                          <Input 
                            id="proposal-file" 
                            type="file" 
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload a PDF file (max 10MB). This will be shared with the client.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          onClick={submitProposalUpload} 
                          disabled={isUploading || !proposalFile}
                        >
                          {isUploading ? 'Uploading...' : 'Upload & Send'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {(brief.status === 'proposal_sent' || brief.status === 'proposal_accepted') && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadProposal(brief)}
                    >
                      <EyeOpenIcon className="mr-2 h-4 w-4" /> Download Proposal
                    </Button>
                    
                    {brief.status === 'proposal_accepted' && (
                      <Button variant="secondary" size="sm" disabled>
                        <CheckIcon className="mr-2 h-4 w-4" /> Proposal Accepted
                      </Button>
                    )}
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
                        "<strong>{brief.title || 'Untitled Brief'}</strong>" owned by {brief.user_profiles?.full_name || brief.owner_id}.
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