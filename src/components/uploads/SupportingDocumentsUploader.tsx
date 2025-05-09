import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, FileIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define types for our files
type UploadedFile = {
  id: string;
  name: string;
  path: string;
  [key: string]: any;
};

type LocalFile = File;

// Type guard to check if a file is an uploaded file
function isUploadedFile(file: any): file is UploadedFile {
  return file && typeof file === 'object' && 'id' in file && 'path' in file;
}

export function SupportingDocumentsUploader() {
  const { updateFiles, files, deleteFile } = useDesignBrief();
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const supportingDocuments = files.supportingDocuments || [];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList);
      updateFiles({ supportingDocuments: [...supportingDocuments, ...newFiles] });
    }
  };

  const removeLocalFile = (index: number) => {
    const updatedFiles = [...supportingDocuments];
    updatedFiles.splice(index, 1);
    updateFiles({ supportingDocuments: updatedFiles });
  };

  const handleDeleteFile = async (file: UploadedFile | LocalFile, index: number) => {
    // Check if this is a stored file that needs to be deleted from storage
    if (isUploadedFile(file)) {
      // Mark file as being deleted
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.add(file.id);
        return newSet;
      });
      
      try {
        const result = await deleteFile(file.id, file.path, 'supportingDocuments');
        if (result.success) {
          toast({
            title: "File deleted",
            description: "The file was successfully deleted.",
            variant: "default",
          });
          // Remove from local state
          removeLocalFile(index);
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
        // If deletion fails, remove it from the deleting set
        setDeletingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.id);
          return newSet;
        });
      }
    } else {
      // For local files, just remove them from state
      removeLocalFile(index);
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <Label htmlFor="supportingDocuments" className="text-lg font-medium mb-2 block">
        Supporting Documents
      </Label>
      <p className="text-sm mb-4 text-gray-600">
        Upload any HOA guidelines, zoning materials, or other supporting documentation.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {supportingDocuments.map((file, index) => {
          const isStored = isUploadedFile(file);
          const isDeleting = isStored ? deletingFiles.has(file.id) : false;
          const fileName = file.name;
          
          return (
            <div key={index} className="relative flex items-center border rounded p-2 bg-gray-50">
              <FileIcon className="h-4 w-4 mr-2" />
              <span className="text-sm truncate max-w-[200px]">{fileName}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0 ml-2"
                onClick={() => handleDeleteFile(file, index)}
                disabled={isDeleting}
              >
                {isStored ? <Trash2 className="h-4 w-4 text-red-500" /> : <X className="h-4 w-4" />}
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="supportingDocuments"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDFs, Word documents, images (MAX 10MB)
            </p>
          </div>
          <input
            id="supportingDocuments"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx,.xlsx,.csv"
          />
        </label>
      </div>
    </div>
  );
}
