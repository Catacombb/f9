import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefService } from '@/lib/supabase/services/briefService';
import { useStableAuth } from '@/hooks/useStableAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

export default function CreateBriefPage() {
  const [briefTitle, setBriefTitle] = useState('New Brief');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useStableAuth(); // Added isLoading
  
  useEffect(() => {
    // Redirect to login if not authenticated and auth check is complete
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  const handleCreateBrief = async () => {
    if (!isAuthenticated || !user) {
      setError('User not authenticated. Please log in.');
      return;
    }
    setIsCreating(true);
    setError(null);
    
    try {
      console.log('[CreateBriefPage] Creating brief with title:', briefTitle);
      const { id, error: createError } = await briefService.createBrief(briefTitle);
      
      if (createError || !id) {
        console.error('[CreateBriefPage] Error creating brief:', createError);
        setError(createError?.message || 'Failed to create brief');
        setIsCreating(false);
        return;
      }
      
      console.log('[CreateBriefPage] Brief created successfully with ID:', id);
      // Navigate to the new brief editing page
      navigate(`/design-brief/${id}`);
    } catch (err) {
      console.error('[CreateBriefPage] Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsCreating(false);
    }
  };
  
  // Show loading or null if auth is still loading to prevent premature redirect
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <div>Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create New Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="briefTitle" className="text-sm font-medium">Brief Title</label>
              <Input 
                id="briefTitle"
                value={briefTitle} 
                onChange={(e) => setBriefTitle(e.target.value)}
                placeholder="Enter brief title" 
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-100">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBrief} 
              disabled={isCreating || !briefTitle.trim() || !isAuthenticated}
              className="flex-1"
            >
              {isCreating ? 'Creating...' : 'Create Brief'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 