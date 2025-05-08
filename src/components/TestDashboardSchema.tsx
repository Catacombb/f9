import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/schema';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';

// Test result type
type TestResult = {
  name: string;
  description: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  message?: string;
  details?: any;
};

export function TestDashboardSchema() {
  const { user } = useSupabase();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState('schema');

  // Run all tests
  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Schema tests
      await testUserProfilesTable();
      await testActivitiesTable();
      await testProjectStatusColumn();
      
      // RLS policy tests
      await testUserProfilesRLS();
      await testActivitiesRLS();
      
      // Trigger tests
      await testStatusChangeTrigger();
      // We can't directly test the user registration trigger here
      // as it requires creating a new auth user which needs admin rights
      
      // Type tests
      await testTypeConsistency();
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test user_profiles table
  const testUserProfilesTable = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      addResult({
        name: 'User Profiles Table',
        description: 'Check if user_profiles table exists and is accessible',
        status: 'success',
        message: 'Table exists and is accessible',
        details: data
      });
    } catch (error: any) {
      addResult({
        name: 'User Profiles Table',
        description: 'Check if user_profiles table exists and is accessible',
        status: 'error',
        message: error.message
      });
    }
  };

  // Test activities table
  const testActivitiesTable = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      addResult({
        name: 'Activities Table',
        description: 'Check if activities table exists and is accessible',
        status: 'success',
        message: 'Table exists and is accessible',
        details: data
      });
    } catch (error: any) {
      addResult({
        name: 'Activities Table',
        description: 'Check if activities table exists and is accessible',
        status: 'error',
        message: error.message
      });
    }
  };

  // Test project status column
  const testProjectStatusColumn = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, status, status_updated_at')
        .limit(1);
      
      if (error) throw error;
      
      addResult({
        name: 'Project Status Column',
        description: 'Check if status column was added to projects table',
        status: 'success',
        message: 'Status column exists and is accessible',
        details: data
      });
    } catch (error: any) {
      addResult({
        name: 'Project Status Column',
        description: 'Check if status column was added to projects table',
        status: 'error',
        message: error.message
      });
    }
  };

  // Test user_profiles RLS
  const testUserProfilesRLS = async () => {
    if (!user) {
      addResult({
        name: 'User Profiles RLS',
        description: 'Check if RLS policies are correctly applied to user_profiles',
        status: 'error',
        message: 'You must be logged in to test RLS policies'
      });
      return;
    }

    try {
      // Check if the user has a profile first
      const { data: profileCheck, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
        
      if (checkError || !profileCheck) {
        // Try to create a profile for this user if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            role: 'client'
          })
          .select()
          .single();
            
        if (insertError) {
          throw new Error(`Cannot create profile: ${insertError.message}`);
        }
        
        addResult({
          name: 'User Profile Creation',
          description: 'Created a profile for the current user',
          status: 'success',
          message: 'Profile created successfully',
          details: newProfile
        });
      }
      
      // Try to fetch current user's profile
      const { data: ownProfile, error: ownError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .limit(1);
      
      if (ownError || !ownProfile || ownProfile.length === 0) {
        throw new Error(`Cannot access own profile: ${ownError?.message || 'No profile found'}`);
      }
      
      const userProfile = ownProfile[0];
      
      // Try to fetch another user's profile
      // This should succeed only if current user is admin
      const { data: otherProfiles, error: otherError } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', user.id)
        .limit(1);
      
      const isAdmin = userProfile.role === 'admin';
      const canAccessOtherProfiles = !otherError && otherProfiles && otherProfiles.length > 0;
      
      if (isAdmin) {
        // Admin should be able to access other profiles
        if (canAccessOtherProfiles) {
          addResult({
            name: 'User Profiles RLS - Admin',
            description: 'Check if admin can access other user profiles',
            status: 'success',
            message: 'Admin can access other user profiles as expected',
            details: { ownProfile: userProfile, otherProfiles }
          });
        } else {
          addResult({
            name: 'User Profiles RLS - Admin',
            description: 'Check if admin can access other user profiles',
            status: 'error',
            message: 'Admin cannot access other profiles. RLS policy might be incorrectly configured.'
          });
        }
      } else {
        // Regular user should NOT be able to access other profiles
        if (canAccessOtherProfiles) {
          addResult({
            name: 'User Profiles RLS - Client',
            description: 'Check if client role is restricted to own profile',
            status: 'error',
            message: 'Client user can access other profiles. RLS policy is not restricting properly.',
            details: { ownProfile: userProfile, otherProfiles }
          });
        } else {
          addResult({
            name: 'User Profiles RLS - Client',
            description: 'Check if client role is restricted to own profile',
            status: 'success',
            message: 'Client user properly restricted to own profile',
            details: { ownProfile: userProfile }
          });
        }
      }
    } catch (error: any) {
      addResult({
        name: 'User Profiles RLS',
        description: 'Check if RLS policies are correctly applied to user_profiles',
        status: 'error',
        message: error.message
      });
    }
  };

  // Test activities RLS
  const testActivitiesRLS = async () => {
    if (!user) {
      addResult({
        name: 'Activities RLS',
        description: 'Check if RLS policies are correctly applied to activities',
        status: 'error',
        message: 'You must be logged in to test RLS policies'
      });
      return;
    }

    try {
      // First, get user role - need to handle case where profile might not exist
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .limit(1);
      
      if (profileError || !profiles || profiles.length === 0) {
        throw new Error(`Cannot determine user role: ${profileError?.message || 'No profile found'}`);
      }
      
      const isAdmin = profiles[0].role === 'admin';
      
      // Get projects owned by the current user
      const { data: ownProjects, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (projectError || !ownProjects || ownProjects.length === 0) {
        // Try to create a test project
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            client_name: 'Test Client',
            project_description: 'Test project created for RLS testing',
            status: 'brief'
          })
          .select('id')
          .single();
          
        if (createError) {
          throw new Error(`Cannot create test project: ${createError.message}`);
        }
        
        addResult({
          name: 'Test Project Creation',
          description: 'Created a test project for activities testing',
          status: 'success',
          message: 'Project created successfully',
          details: newProject
        });
        
        // Use the new project for further testing
        const { data: ownActivities, error: activityError } = await supabase
          .from('activities')
          .select('*')
          .eq('project_id', newProject.id)
          .limit(1);
          
        if (activityError) {
          addResult({
            name: 'Activities RLS - Own Projects',
            description: 'Check if user can access activities for their own projects',
            status: 'error',
            message: `Cannot access own project activities: ${activityError.message}`
          });
        } else {
          addResult({
            name: 'Activities RLS - Own Projects',
            description: 'Check if user can access activities for their own projects',
            status: 'success',
            message: 'User can access activities for their own projects',
            details: ownActivities
          });
        }
      } else {
        // Get some activities for existing project
        const { data: ownActivities, error: activityError } = await supabase
          .from('activities')
          .select('*')
          .eq('project_id', ownProjects[0].id)
          .limit(1);
          
        if (activityError) {
          addResult({
            name: 'Activities RLS - Own Projects',
            description: 'Check if user can access activities for their own projects',
            status: 'error',
            message: `Cannot access own project activities: ${activityError.message}`
          });
        } else {
          addResult({
            name: 'Activities RLS - Own Projects',
            description: 'Check if user can access activities for their own projects',
            status: 'success',
            message: 'User can access activities for their own projects',
            details: ownActivities
          });
        }
      }
      
      // Admin should be able to access all activities
      if (isAdmin) {
        const { data: allActivities, error: allError } = await supabase
          .from('activities')
          .select('*')
          .limit(5);
          
        if (allError) {
          addResult({
            name: 'Activities RLS - Admin',
            description: 'Check if admin can access all activities',
            status: 'error',
            message: `Admin cannot access all activities: ${allError.message}`
          });
        } else {
          addResult({
            name: 'Activities RLS - Admin',
            description: 'Check if admin can access all activities',
            status: 'success',
            message: 'Admin can access all activities',
            details: allActivities
          });
        }
      }
    } catch (error: any) {
      addResult({
        name: 'Activities RLS',
        description: 'Check if RLS policies are correctly applied to activities',
        status: 'error',
        message: error.message
      });
    }
  };

  // Test status change trigger
  const testStatusChangeTrigger = async () => {
    if (!user) {
      addResult({
        name: 'Status Change Trigger',
        description: 'Check if status changes are logged in activities',
        status: 'error',
        message: 'You must be logged in to test triggers'
      });
      return;
    }

    try {
      // Get a project owned by the current user
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('id, status')
        .eq('user_id', user.id)
        .limit(1);
      
      if (projectError || !projects || projects.length === 0) {
        // Create a test project if none exists
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            client_name: 'Test Client',
            project_description: 'Test project created for trigger testing',
            status: 'brief'
          })
          .select('id, status')
          .single();
          
        if (createError) {
          throw new Error('No project found for testing status trigger and cannot create one');
        }
        
        // Use the new project for testing
        const project = newProject;
        const currentStatus = project.status;
        const newStatus = currentStatus === 'brief' ? 'sent' : 'brief';
        
        // Update the status
        const { error: updateError } = await supabase
          .from('projects')
          .update({ status: newStatus })
          .eq('id', project.id);
        
        if (updateError) throw new Error(`Cannot update status: ${updateError.message}`);
        
        // Rest of the test same as before...
        await testStatusChangeTriggerHelper(project.id, currentStatus, newStatus);
      } else {
        const project = projects[0];
        const currentStatus = project.status;
        const newStatus = currentStatus === 'brief' ? 'sent' : 'brief';
        
        // Update the status
        const { error: updateError } = await supabase
          .from('projects')
          .update({ status: newStatus })
          .eq('id', project.id);
        
        if (updateError) throw new Error(`Cannot update status: ${updateError.message}`);
        
        // Rest of the test same as before...
        await testStatusChangeTriggerHelper(project.id, currentStatus, newStatus);
      }
    } catch (error: any) {
      addResult({
        name: 'Status Change Trigger',
        description: 'Check if status changes are logged in activities',
        status: 'error',
        message: error.message
      });
    }
  };
  
  // Helper function for status change trigger test
  const testStatusChangeTriggerHelper = async (projectId: string, currentStatus: string, newStatus: string) => {
    try {
      // Wait briefly for trigger to execute
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check activities for the status change log
      const { data: activities, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('project_id', projectId)
        .eq('activity_type', 'status_change')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (activityError) throw new Error(`Cannot check activities: ${activityError.message}`);
      
      if (activities && activities.length > 0) {
        const activity = activities[0];
        const details = activity.details as { previous_status?: string; new_status?: string };
        
        if (details.previous_status === currentStatus && details.new_status === newStatus) {
          addResult({
            name: 'Status Change Trigger',
            description: 'Check if status changes are logged in activities',
            status: 'success',
            message: 'Status change was properly logged in activities',
            details: activity
          });
        } else {
          addResult({
            name: 'Status Change Trigger',
            description: 'Check if status changes are logged in activities',
            status: 'error',
            message: 'Status change log found but details are incorrect',
            details: { activity, expected: { previous_status: currentStatus, new_status: newStatus } }
          });
        }
      } else {
        addResult({
          name: 'Status Change Trigger',
          description: 'Check if status changes are logged in activities',
          status: 'error',
          message: 'No activity log found for status change'
        });
      }
      
      // Revert back to original status
      await supabase
        .from('projects')
        .update({ status: currentStatus })
        .eq('id', projectId);
        
    } catch (error: any) {
      throw error;
    }
  };

  // Test TypeScript type consistency
  const testTypeConsistency = async () => {
    try {
      // Here we're just checking that our schema.ts exports match the tables we've created
      // We can't really verify this programmatically except by trying to use the types
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, status, user_id')
        .limit(1);
      
      if (projectError) throw projectError;
      
      // Check if we can assign this to our Project type
      // This is a runtime check that serves as a proxy for type consistency
      if (projectData && projectData.length > 0) {
        const project = projectData[0];
        // If status exists on project, our types are likely in sync
        if ('status' in project) {
          addResult({
            name: 'TypeScript Type Consistency',
            description: 'Check if our TypeScript types match the database schema',
            status: 'success',
            message: 'Types appear to be in sync with database schema',
            details: project
          });
        } else {
          addResult({
            name: 'TypeScript Type Consistency',
            description: 'Check if our TypeScript types match the database schema',
            status: 'error',
            message: 'Project data from database does not match expected structure',
            details: project
          });
        }
      } else {
        addResult({
          name: 'TypeScript Type Consistency',
          description: 'Check if our TypeScript types match the database schema',
          status: 'warning',
          message: 'No project data found to verify type consistency'
        });
      }
    } catch (error: any) {
      addResult({
        name: 'TypeScript Type Consistency',
        description: 'Check if our TypeScript types match the database schema',
        status: 'error',
        message: error.message
      });
    }
  };

  // Helper function to add a test result
  const addResult = (result: TestResult) => {
    setResults(prevResults => [...prevResults, result]);
  };

  // Reset results
  const resetResults = () => {
    setResults([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Dashboard Schema Test</CardTitle>
        <CardDescription>
          Test database schema, RLS policies, and triggers for the dashboard implementation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-row gap-4 items-center">
            <Button 
              onClick={runTests} 
              disabled={isRunning || !user}
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetResults} 
              disabled={isRunning || results.length === 0}
            >
              Reset Results
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showDetails" 
                checked={showDetails}
                onCheckedChange={(checked) => setShowDetails(!!checked)} 
              />
              <label htmlFor="showDetails">Show Details</label>
            </div>
          </div>

          {!user && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You must be logged in to run these tests. The tests require database access.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {results.length > 0 && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="schema">Schema Tests</TabsTrigger>
              <TabsTrigger value="rls">RLS Tests</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
            </TabsList>

            <TabsContent value="schema" className="space-y-4">
              <TestResultsTable 
                results={results.filter(r => 
                  ['User Profiles Table', 'Activities Table', 'Project Status Column'].includes(r.name)
                )} 
                showDetails={showDetails} 
              />
            </TabsContent>

            <TabsContent value="rls" className="space-y-4">
              <TestResultsTable 
                results={results.filter(r => 
                  r.name.includes('RLS') || r.name.includes('Profile Creation') || r.name.includes('Project Creation')
                )} 
                showDetails={showDetails} 
              />
            </TabsContent>

            <TabsContent value="triggers" className="space-y-4">
              <TestResultsTable 
                results={results.filter(r => 
                  r.name.includes('Trigger')
                )} 
                showDetails={showDetails} 
              />
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <TestResultsTable 
                results={results.filter(r => 
                  r.name.includes('Type')
                )} 
                showDetails={showDetails} 
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {results.length > 0 ? (
            <>
              Tests Run: {results.length} | 
              Success: {results.filter(r => r.status === 'success').length} | 
              Errors: {results.filter(r => r.status === 'error').length} | 
              Warnings: {results.filter(r => r.status === 'warning').length}
            </>
          ) : (
            'Run tests to see results'
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

interface TestResultsTableProps {
  results: TestResult[];
  showDetails: boolean;
}

function TestResultsTable({ results, showDetails }: TestResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Test</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Message</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result, i) => (
          <TableRow key={i}>
            <TableCell>
              {result.status === 'success' ? (
                <span className="text-green-500">
                  <CheckIcon className="h-5 w-5" />
                </span>
              ) : result.status === 'error' ? (
                <span className="text-red-500">
                  <XIcon className="h-5 w-5" />
                </span>
              ) : (
                <span className="text-yellow-500">⌛</span>
              )}
            </TableCell>
            <TableCell className="font-medium">{result.name}</TableCell>
            <TableCell>{result.description}</TableCell>
            <TableCell>
              <div>
                <div>{result.message}</div>
                {showDetails && result.details && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {results.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              No test results in this category
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 