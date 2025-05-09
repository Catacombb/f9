import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { 
  scanForOrphanedFiles, 
  getCleanupStats, 
  deleteOrphanedFile, 
  bulkCleanupOrphanedFiles,
  logCleanupActivity
} from '@/lib/supabase/services/fileCleanupService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  HardDrive, 
  Database, 
  FileQuestion, 
  CheckCircle, 
  XCircle, 
  Download, 
  FilePlus2 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { formatFileSize } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define interface for orphaned file
interface OrphanedFile {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  category: string;
  publicUrl: string;
  createdAt: string;
  lastModified: string;
  projectId?: string;
  status: 'orphaned_storage' | 'orphaned_db' | 'missing_project';
}

interface CleanupStats {
  totalStorageFiles: number;
  totalDatabaseRecords: number;
  orphanedStorageFiles: number;
  orphanedDatabaseRecords: number;
  missingProjectReferences: number;
}

export function FileCleanupPage() {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [orphanedFiles, setOrphanedFiles] = useState<OrphanedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<OrphanedFile | null>(null);
  const [isDryRun, setIsDryRun] = useState(true);
  const [deletingFile, setDeletingFile] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await getCleanupStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading cleanup stats:', err);
      setError('Failed to load file cleanup statistics');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load file cleanup statistics.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      
      const result = await scanForOrphanedFiles();
      
      if (!result.success) {
        throw new Error(result.error || 'Scan failed');
      }
      
      setOrphanedFiles(result.orphanedFiles);
      
      // Also refresh stats
      const statsData = await getCleanupStats();
      setStats(statsData);
      
      toast({
        title: "Scan Complete",
        description: `Found ${result.orphanedFiles.length} orphaned files out of ${result.totalFilesScanned} total files.`,
      });
    } catch (err) {
      console.error('Error scanning for orphaned files:', err);
      setError('Failed to scan for orphaned files');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to scan for orphaned files.',
      });
    } finally {
      setScanning(false);
    }
  };

  const openDeleteDialog = (file: OrphanedFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const openBulkDeleteDialog = () => {
    if (selectedFiles.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select files to delete.',
      });
      return;
    }
    
    setBulkDeleteDialogOpen(true);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      setDeletingFile(true);
      const result = await deleteOrphanedFile(fileToDelete);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete file');
      }
      
      // Remove from the list
      setOrphanedFiles(prevFiles => 
        prevFiles.filter(file => file.id !== fileToDelete.id)
      );
      
      // Also refresh stats
      const statsData = await getCleanupStats();
      setStats(statsData);
      
      // Log activity if the user is available
      if (user) {
        await logCleanupActivity(user.id, {
          action: 'delete_single_file',
          file_name: fileToDelete.name,
          file_status: fileToDelete.status
        });
      }
      
      toast({
        title: "File Deleted",
        description: `Successfully deleted ${fileToDelete.name}.`,
      });
      
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting file:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete ${fileToDelete.name}.`,
      });
    } finally {
      setDeletingFile(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setBulkDeleting(true);
      
      // Get selected files
      const filesToDelete = orphanedFiles.filter(file => 
        selectedFiles.has(file.id)
      );
      
      const result = await bulkCleanupOrphanedFiles(filesToDelete, isDryRun);
      
      if (isDryRun) {
        // Just show what would have been deleted
        toast({
          title: "Dry Run Complete",
          description: `Would have deleted ${result.deletedCount} files.`,
        });
      } else {
        // Actually deleted files
        if (result.failedCount > 0) {
          toast({
            variant: 'destructive',
            title: "Partial Success",
            description: `Deleted ${result.deletedCount} files. Failed to delete ${result.failedCount} files.`,
          });
        } else {
          toast({
            title: "Bulk Delete Complete",
            description: `Successfully deleted ${result.deletedCount} files.`,
          });
        }
        
        // Remove deleted files from the list
        setOrphanedFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        
        // Reset selected files
        setSelectedFiles(new Set());
        
        // Also refresh stats
        const statsData = await getCleanupStats();
        setStats(statsData);
        
        // Log activity if the user is available
        if (user) {
          await logCleanupActivity(user.id, {
            action: 'bulk_delete',
            count: result.deletedCount,
            failed_count: result.failedCount,
            dry_run: isDryRun
          });
        }
      }
      
      setBulkDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error performing bulk delete:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to perform bulk delete operation.',
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      // Deselect all
      setSelectedFiles(new Set());
    } else {
      // Select all
      const newSet = new Set<string>();
      filteredFiles.forEach(file => newSet.add(file.id));
      setSelectedFiles(newSet);
    }
  };

  // Filter files based on active tab
  const filteredFiles = activeTab === 'all' 
    ? orphanedFiles 
    : orphanedFiles.filter(file => file.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'orphaned_storage':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Storage Only</Badge>;
      case 'orphaned_db':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Database Only</Badge>;
      case 'missing_project':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Missing Project</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'orphaned_storage':
        return <HardDrive className="h-4 w-4 text-blue-500" />;
      case 'orphaned_db':
        return <Database className="h-4 w-4 text-amber-500" />;
      case 'missing_project':
        return <FileQuestion className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">File Cleanup Utility</h1>
          <p className="text-muted-foreground">
            Find and clean up orphaned files to reclaim storage space
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleScan} 
            disabled={scanning}
            className="whitespace-nowrap"
          >
            {scanning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan for Orphaned Files
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <HardDrive className="mr-2 h-4 w-4 text-blue-500" />
                  Storage Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStorageFiles || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Including {stats?.orphanedStorageFiles || 0} orphaned files
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Database className="mr-2 h-4 w-4 text-amber-500" />
                  Database Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalDatabaseRecords || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Including {stats?.orphanedDatabaseRecords || 0} orphaned records
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileQuestion className="mr-2 h-4 w-4 text-red-500" />
                  Missing Project Refs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.missingProjectReferences || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Files with invalid project references
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {orphanedFiles.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <CardTitle>Orphaned Files</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {selectedFiles.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={openBulkDeleteDialog}
                  disabled={selectedFiles.size === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
            <CardDescription>
              Found {orphanedFiles.length} orphaned files
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All ({orphanedFiles.length})
                </TabsTrigger>
                <TabsTrigger value="orphaned_storage">
                  Storage Only ({orphanedFiles.filter(f => f.status === 'orphaned_storage').length})
                </TabsTrigger>
                <TabsTrigger value="orphaned_db">
                  Database Only ({orphanedFiles.filter(f => f.status === 'orphaned_db').length})
                </TabsTrigger>
                <TabsTrigger value="missing_project">
                  Missing Project ({orphanedFiles.filter(f => f.status === 'missing_project').length})
                </TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={filteredFiles.length > 0 && selectedFiles.size === filteredFiles.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                      </TableHead>
                      <TableHead className="w-[60px]">Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No orphaned files found in this category
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFiles.map(file => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={selectedFiles.has(file.id)}
                                onChange={() => toggleSelectFile(file.id)} 
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {getStatusIcon(file.status)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="truncate max-w-[200px]" title={file.name}>
                              {file.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {file.category}
                          </TableCell>
                          <TableCell>
                            {formatFileSize(file.size)}
                          </TableCell>
                          <TableCell>
                            {new Date(file.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {file.publicUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a 
                                    href={file.publicUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    title="Download file"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                  </a>
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(file)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete file"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Orphaned File</DialogTitle>
            <DialogDescription>
              This will permanently delete this file. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {fileToDelete && (
            <div className="py-4">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(fileToDelete.status)}
                <span className="font-semibold">{fileToDelete.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Status: {getStatusBadge(fileToDelete.status)}</p>
                <p>Size: {formatFileSize(fileToDelete.size || 0)}</p>
                {fileToDelete.projectId && (
                  <p>Project ID: {fileToDelete.projectId}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFile}
              disabled={deletingFile}
            >
              {deletingFile ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Delete Orphaned Files</DialogTitle>
            <DialogDescription>
              You are about to delete {selectedFiles.size} orphaned files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between space-x-2 mb-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dry-run"
                  checked={isDryRun}
                  onCheckedChange={setIsDryRun}
                />
                <Label htmlFor="dry-run">Dry run (simulate deletion without actually deleting)</Label>
              </div>
            </div>
            
            <Alert variant={isDryRun ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {isDryRun ? "Simulation Mode" : "Warning: Permanent Deletion"}
              </AlertTitle>
              <AlertDescription>
                {isDryRun 
                  ? "This will only simulate deletion. No files will actually be deleted."
                  : "This will permanently delete all selected files. This action cannot be undone."
                }
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={isDryRun ? "default" : "destructive"}
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {isDryRun ? "Simulating..." : "Deleting..."}
                </>
              ) : (
                <>
                  {isDryRun ? (
                    <>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Simulate Deletion
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete {selectedFiles.size} Files
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 