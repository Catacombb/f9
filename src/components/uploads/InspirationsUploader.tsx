import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, FileIcon, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadedFile } from '@/lib/supabase/services/fileService';

export function InspirationsUploader() {
  const { uploadFile, deleteFile, uploadedFiles } = useDesignBrief();
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Get inspiration files from the context
  const inspirationFiles = uploadedFiles['inspirations'] || [];
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const newFiles = Array.from(fileList);
    setUploading(true);
    
    try {
      // Upload each file
      for (const file of newFiles) {
        const result = await uploadFile('inspirations', file);
        
        if (!result.success) {
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${result.error?.message || 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }
      
      // Clear the file input
      if (e.target) {
        e.target.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while uploading files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    // Mark file as being deleted
    setDeletingFiles(prev => {
      const newSet = new Set(prev);
      newSet.add(file.id);
      return newSet;
    });
    
    try {
      const result = await deleteFile(file.id);
      
      if (result.success) {
        toast({
          title: "File deleted",
          description: "The file was successfully deleted.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove from deleting set whether successful or not
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleDeleteLocalFile = (index: number) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border p-4 rounded-md">
      <Label htmlFor="inspirations" className="text-lg font-medium mb-2 block">
        Design Inspirations
      </Label>
      <p className="text-sm mb-4 text-gray-600">
        Upload photos, magazine clippings, or other buildings that you like.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Display uploaded files from Supabase */}
        {inspirationFiles.map((file) => {
          const isDeleting = deletingFiles.has(file.id);
          
          return (
            <div key={file.id} className="relative flex items-center border rounded p-2 bg-gray-50">
              <FileIcon className="h-4 w-4 mr-2" />
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm truncate max-w-[200px] hover:text-blue-500"
              >
                {file.name}
              </a>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0 ml-2"
                onClick={() => handleDeleteFile(file)}
                disabled={isDeleting}
              >
                {isDeleting ? 
                  <Loader2 className="h-4 w-4 animate-spin" /> : 
                  <Trash2 className="h-4 w-4 text-red-500" />
                }
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          );
        })}
        
        {/* Display local files queued for upload */}
        {localFiles.map((file, index) => (
          <div key={`local-${index}`} className="relative flex items-center border rounded p-2 bg-gray-50">
            <FileIcon className="h-4 w-4 mr-2" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 ml-2"
              onClick={() => handleDeleteLocalFile(index)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="inspirations"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-3 text-primary animate-spin" />
                <p className="text-sm text-gray-500">Uploading files...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Images, PDFs, documents (MAX 10MB)
                </p>
              </>
            )}
          </div>
          <input
            id="inspirations"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
