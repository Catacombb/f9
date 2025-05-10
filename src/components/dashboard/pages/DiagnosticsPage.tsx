import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { isAdmin } from '@/lib/supabase/services/roleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/schema';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, InfoIcon, Search, XCircle } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function DiagnosticsPage() {
  const { user } = useSupabase();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticSessions, setDiagnosticSessions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  
  // Check if the user is admin when the component mounts
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;
      
      try {
        const adminStatus = await isAdmin(user.id);
        setIsUserAdmin(adminStatus);
        
        if (!adminStatus) {
          console.error('Access denied: User is not an admin');
        } else {
          loadDiagnosticSessions();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [user]);
  
  // Load diagnostic sessions
  const loadDiagnosticSessions = async () => {
    setIsLoading(true);
    try {
      try {
        // First get distinct request IDs using a custom RPC
        const { data, error } = await supabase.rpc('get_recent_diagnostic_sessions', {
          limit_count: 100
        });
        
        if (error) {
          throw error;
        }
        
        // Process the sessions
        const sessions = data || [];
        setDiagnosticSessions(sessions);
      } catch (error) {
        // Fallback to custom client-side processing if RPC fails
        console.error('Error with RPC, falling back to client-side processing:', error);
        
        // Use raw query for diagnostics table (with special permission)
        const { data: rawData, error: rawError } = await supabase
          .from('project_creation_diagnostics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);
          
        if (rawError) {
          throw rawError;
        }
        
        // Group by request_id on client side
        const processedSessions = processRawDiagnostics(rawData || []);
        setDiagnosticSessions(processedSessions);
      }
    } catch (error) {
      console.error('Error loading diagnostic sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process raw diagnostics data when RPC isn't available
  const processRawDiagnostics = (rawData: any[]) => {
    const sessions: any[] = [];
    const sessionMap = new Map();
    
    // First pass - group by request ID and find the latest status
    for (const item of rawData) {
      const requestId = item.request_id;
      if (!requestId) continue;
      
      if (!sessionMap.has(requestId)) {
        sessionMap.set(requestId, {
          id: requestId,
          userId: item.user_id || 'unknown',
          userName: 'Unknown User', // Will be fetched later
          userRole: null,
          operation: item.operation || 'unknown',
          startedAt: item.created_at,
          latestTimestamp: item.created_at,
          status: item.status || 'unknown',
          details: item.details || {},
          result: (item.details && item.details.result) || 'unknown'
        });
      } else {
        const session = sessionMap.get(requestId);
        if (new Date(item.created_at) > new Date(session.latestTimestamp)) {
          session.latestTimestamp = item.created_at;
          session.status = item.status || session.status;
          session.details = item.details || session.details;
          session.result = (item.details && item.details.result) || session.result;
        }
      }
    }
    
    // Convert to array and sort by latest timestamp
    return Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.latestTimestamp).getTime() - new Date(a.latestTimestamp).getTime());
  };
  
  // Load session details
  const loadSessionDetails = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setSessionLoading(true);
    
    try {
      // Use the RPC function to get session details
      const { data, error } = await supabase.rpc('get_diagnostic_session_details', {
        session_id: sessionId
      });
      
      if (error) {
        throw error;
      }
      
      setSessionDetails(data || []);
    } catch (error) {
      console.error('Error loading session details:', error);
      // Fallback to direct query if RPC fails
      try {
        const { data, error: fallbackError } = await supabase
          .from('project_creation_diagnostics')
          .select('*')
          .eq('request_id', sessionId)
          .order('created_at', { ascending: true });
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        setSessionDetails(data || []);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    } finally {
      setSessionLoading(false);
    }
  };
  
  // Filter sessions based on search term
  const filteredSessions = diagnosticSessions.filter(session => 
    session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.result.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Helper to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="flex items-center"><CheckCircle size={12} className="mr-1" /> Success</Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center"><XCircle size={12} className="mr-1" /> Error</Badge>;
      case 'warning':
        return <Badge variant="warning" className="flex items-center"><AlertCircle size={12} className="mr-1" /> Warning</Badge>;
      case 'info':
        return <Badge variant="secondary" className="flex items-center"><InfoIcon size={12} className="mr-1" /> Info</Badge>;
      case 'started':
        return <Badge variant="outline" className="flex items-center"><Spinner size={12} className="mr-1" /> Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size={24} className="mr-2" />
        <p>Loading diagnostics...</p>
      </div>
    );
  }
  
  if (!isUserAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to view this page. Only administrators can access diagnostics.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <p className="text-muted-foreground">View and analyze system diagnostics for troubleshooting</p>
        </div>
        <Button onClick={loadDiagnosticSessions}>Refresh</Button>
      </div>
      
      <div className="relative">
        <Input
          placeholder="Search by session ID, user ID, name, operation, or result..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-2xl"
        />
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      
      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Diagnostic Sessions</TabsTrigger>
          {selectedSession && <TabsTrigger value="details">Session Details</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Diagnostic Sessions</CardTitle>
              <CardDescription>
                {filteredSessions.length} sessions found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No diagnostic sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-mono text-xs">
                            {session.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{session.userName}</div>
                            <div className="text-xs text-muted-foreground">{session.userId.substring(0, 8)}...</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {session.userRole}
                            </Badge>
                          </TableCell>
                          <TableCell>{session.operation}</TableCell>
                          <TableCell>{formatDate(session.startedAt)}</TableCell>
                          <TableCell>{renderStatusBadge(session.status)}</TableCell>
                          <TableCell>
                            <div className="font-medium">{session.result}</div>
                            {session.details.projectId && (
                              <div className="text-xs text-muted-foreground">
                                Project: {session.details.projectId.substring(0, 8)}...
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadSessionDetails(session.id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {selectedSession && (
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>
                  {selectedSession.substring(0, 8)}... • {sessionDetails.length} events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size={24} className="mr-2" />
                    <p>Loading session details...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Operation</TableHead>
                          <TableHead>Step</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessionDetails.map((event, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(event.created_at)}</TableCell>
                            <TableCell>{event.operation}</TableCell>
                            <TableCell>{event.step || 'N/A'}</TableCell>
                            <TableCell>{renderStatusBadge(event.status)}</TableCell>
                            <TableCell>
                              <Accordion type="single" collapsible>
                                <AccordionItem value="details">
                                  <AccordionTrigger className="text-xs">
                                    Details
                                    {event.error_message && (
                                      <Badge variant="destructive" className="ml-2">
                                        Error
                                      </Badge>
                                    )}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2">
                                      {event.details && Object.keys(event.details).length > 0 && (
                                        <div>
                                          <h4 className="text-sm font-semibold mb-1">Details</h4>
                                          <pre className="text-xs bg-secondary p-2 rounded overflow-auto max-h-48">
                                            {JSON.stringify(event.details, null, 2)}
                                          </pre>
                                        </div>
                                      )}
                                      
                                      {event.error_message && (
                                        <div>
                                          <h4 className="text-sm font-semibold mb-1 text-destructive">Error Message</h4>
                                          <pre className="text-xs bg-destructive/10 p-2 rounded overflow-auto max-h-48 text-destructive">
                                            {event.error_message}
                                          </pre>
                                        </div>
                                      )}
                                      
                                      {event.error_details && (
                                        <div>
                                          <h4 className="text-sm font-semibold mb-1 text-destructive">Error Details</h4>
                                          <pre className="text-xs bg-destructive/10 p-2 rounded overflow-auto max-h-48 text-destructive">
                                            {event.error_details}
                                          </pre>
                                        </div>
                                      )}
                                      
                                      {event.execution_time_ms && (
                                        <div className="text-xs text-muted-foreground">
                                          Execution time: {event.execution_time_ms}ms
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  Back to Sessions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 