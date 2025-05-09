import React, { useState, useEffect } from 'react';
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
import { getProjectFiles, deleteProjectFile } from '@/lib/supabase/services/projectService';
import { AlertCircle, Download, Eye, FileText, Image, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFileSize } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProjectFilesViewerProps {
  projectId: string;
  onFileDeleted?: () => void;
}

interface FileItemProps {
  file: any;
  onDelete: (fileId: string, filePath: string) => Promise<void>;
}

// Individual file component with preview/download options
function FileItem({ file, onDelete }: FileItemProps) {
  const isImage = file.file_name.match(/\.(jpeg|jpg|gif|png)$/i);
  const isPDF = file.file_name.match(/\.(pdf)$/i);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${file.file_name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(file.id, file.file_path);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="border rounded-lg p-4 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isImage ? (
            <Image className="h-5 w-5 text-blue-500" />
          ) : isPDF ? (
            <FileText className="h-5 w-5 text-red-500" />
          ) : (
            <FileText className="h-5 w-5 text-gray-500" />
          )}
          <div>
            <p className="font-medium truncate max-w-xs">{file.file_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.file_size)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(isImage || isPDF) && (
            <Button variant="outline" size="sm" onClick={togglePreview}>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href={file.publicUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      {isPreviewOpen && (
        <div className="mt-4">
          {isImage ? (
            <img 
              src={file.publicUrl} 
              alt={file.file_name} 
              className="max-w-full max-h-96 object-contain mx-auto border rounded" 
            />
          ) : isPDF && (
            <iframe 
              src={`${file.publicUrl}#view=FitH`} 
              className="w-full h-96 border rounded" 
              title={file.file_name}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectFilesViewer({ projectId, onFileDeleted }: ProjectFilesViewerProps) {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();
  
  const loadFiles = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProjectFiles(projectId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load files');
      }
      
      setFiles(result.files || []);
    } catch (err) {
      console.error('Error loading project files:', err);
      setError('Failed to load project files');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFiles();
  }, [projectId]);
  
  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      const result = await deleteProjectFile(fileId, filePath);
      
      if (result.success) {
        // Remove the file from local state
        setFiles(currentFiles => currentFiles.filter(file => file.id !== fileId));
        
        // Show success toast
        toast({
          title: "File deleted",
          description: "The file was successfully deleted.",
          variant: "default",
        });
        
        // Call optional callback
        if (onFileDeleted) {
          onFileDeleted();
        }
      } else {
        throw new Error(result.error || 'Failed to delete file');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Group files by category for the tabs
  const filesByCategory = files.reduce((acc: Record<string, any[]>, file) => {
    const category = file.category || 'other';
    acc[category] = acc[category] || [];
    acc[category].push(file);
    return acc;
  }, {});
  
  // Create category tabs dynamically
  const categories = Object.keys(filesByCategory).sort();
  
  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // Handle empty state
  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>View and manage files associated with this project</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No files found</h3>
          <p className="text-muted-foreground mb-4">
            This project doesn't have any files uploaded yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Project Files
        </CardTitle>
        <CardDescription>
          View and manage files associated with this project
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Files ({files.length})</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ({filesByCategory[category].length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {files.map(file => (
                <FileItem key={file.id} file={file} onDelete={handleDeleteFile} />
              ))}
            </div>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filesByCategory[category].map(file => (
                  <FileItem key={file.id} file={file} onDelete={handleDeleteFile} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Total: {files.length} file{files.length !== 1 ? 's' : ''}
        </div>
      </CardFooter>
    </Card>
  );
} 