
import React, { useState, useCallback, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload, X, FileText, Image, FileArchive } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = {
  documents: [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic'
  ]
};

// File categories
const FILE_CATEGORIES = [
  { 
    id: 'siteDocuments', 
    label: 'Site Documents', 
    description: 'Upload Certificate of Title, LIM Report, Resource Consent Documents',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'
  },
  { 
    id: 'sitePhotos', 
    label: 'Site Photos', 
    description: 'Upload photos of your site, existing buildings, views',
    accept: '.jpg,.jpeg,.png,.gif,.webp,.heic'
  },
  { 
    id: 'designFiles', 
    label: 'Design Files', 
    description: 'Upload floor plans, concept drawings, site survey or topo files',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.zip'
  },
  { 
    id: 'inspirationFiles', 
    label: 'Inspiration & Visuals', 
    description: 'Upload moodboards, exterior/interior example images, materials',
    accept: '.jpg,.jpeg,.png,.gif,.webp,.pdf'
  }
];

export function UploadsSection() {
  const { setCurrentSection, files, updateFiles } = useDesignBrief();
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  
  const handlePrevious = () => {
    setCurrentSection('architecture');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(categoryId);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles, categoryId);
  }, []);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles, categoryId);
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  }, []);
  
  const handleFileUpload = useCallback((selectedFiles: File[], categoryId: string) => {
    // Filter files by type based on category
    const isImageCategory = ['sitePhotos', 'inspirationFiles'].includes(categoryId);
    const allowedTypes = isImageCategory ? ALLOWED_FILE_TYPES.images : ALLOWED_FILE_TYPES.documents;
    
    const validFiles = selectedFiles.filter(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a valid file type for this category.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) {
      return;
    }
    
    // Simulate upload progress
    validFiles.forEach(file => {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Remove progress indicator after a delay
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 500);
        }
        
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 200);
    });
    
    // Update files in context
    updateFiles({
      [categoryId]: [...(files[categoryId as keyof typeof files] || []), ...validFiles]
    });
    
    toast.success(`${validFiles.length} file${validFiles.length !== 1 ? 's' : ''} uploaded successfully.`);
  }, [files, updateFiles]);
  
  const handleRemoveFile = useCallback((fileIndex: number, categoryId: string) => {
    const categoryFiles = files[categoryId as keyof typeof files] || [];
    const updatedFiles = [...categoryFiles];
    updatedFiles.splice(fileIndex, 1);
    
    updateFiles({
      [categoryId]: updatedFiles
    });
    
    toast.success('File removed successfully.');
  }, [files, updateFiles]);
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5" />;
    } else {
      return <FileArchive className="h-5 w-5" />;
    }
  };
  
  const renderFileUploadCard = (category: typeof FILE_CATEGORIES[0]) => {
    const categoryFiles = files[category.id as keyof typeof files] || [];
    const hasFiles = categoryFiles.length > 0;
    
    return (
      <Card key={category.id} className="mb-6">
        <CardHeader>
          <CardTitle>{category.label}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragOver === category.id ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="rounded-full bg-background p-2 border">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium">
                Drag files here or click to upload
              </div>
              <div className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </div>
              <Label htmlFor={`file-upload-${category.id}`} className="cursor-pointer">
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                  Select Files
                </div>
                <input
                  id={`file-upload-${category.id}`}
                  type="file"
                  multiple
                  accept={category.accept}
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, category.id)}
                />
              </Label>
            </div>
          </div>
          
          {/* File list */}
          {hasFiles && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
              <div className="space-y-2">
                {categoryFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {getFileIcon(file)}
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index, category.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload progress indicators */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="text-xs">{fileId.split('-')[0]}</div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="File Uploads" 
          description="Upload relevant files for your project, such as site documents, photos, and inspiration."
        />
        
        <div className="space-y-6">
          {FILE_CATEGORIES.map(renderFileUploadCard)}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Architecture</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Project Team</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
