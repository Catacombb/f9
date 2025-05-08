import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/schema';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing connection...');
  const { user } = useSupabase();

  useEffect(() => {
    async function testConnection() {
      try {
        // Basic ping test to Supabase
        const { count, error } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setConnectionStatus('success');
        setMessage(`Connection successful! Found ${count || 0} projects.`);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('error');
        setMessage(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    
    testConnection();
  }, []);

  async function createTestProject() {
    if (!user) {
      setMessage('You must be logged in to create a project');
      return;
    }
    
    try {
      setMessage('Creating test project...');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          client_name: 'Test Client',
          project_address: '123 Test Street',
          project_description: 'This is a test project'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setMessage(`Test project created with ID: ${data.id}`);
    } catch (err) {
      console.error('Error creating test project:', err);
      setMessage(`Error creating test project: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <Card className="w-[600px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded p-4 bg-gray-100">
          <p className="font-medium">Status: 
            <span className={
              connectionStatus === 'loading' ? 'text-yellow-600' :
              connectionStatus === 'success' ? 'text-green-600' : 
              'text-red-600'
            }> {connectionStatus.toUpperCase()}</span>
          </p>
          <p className="mt-2">{message}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={createTestProject}
            disabled={!user || connectionStatus !== 'success'}
          >
            Create Test Project
          </Button>
          
          <div className="text-sm">
            {user ? (
              <span className="text-green-600">Logged in as {user.email}</span>
            ) : (
              <span className="text-yellow-600">Not logged in</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 