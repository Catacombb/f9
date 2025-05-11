import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefService, BriefFull } from '@/lib/supabase/services/briefService';
import { useStableAuth } from '@/hooks/useStableAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ReloadIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

export const AdminDashboardView: React.FC = () => {
  const { user, isLoading: authLoading } = useStableAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [briefs, setBriefs] = useState<BriefFull[]>([]);
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">{brief.status || 'Draft'}</span></p>
                <p className="text-sm text-muted-foreground mt-1">Owner ID: <span className="font-mono text-xs">{brief.owner_id}</span></p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/design-brief/${brief.id}`)}>
                  <Pencil2Icon className="mr-2 h-4 w-4" /> View
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