
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Upload, X, File, Image as ImageIcon, FileArchive, FileText, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_CATEGORY = 10; // Limit to 10 files per category

interface FileItemProps {
  file: File;
  onRemove: () => void;
}

const FileItem = ({ file, onRemove }: FileItemProps) => {
  // Helper function to determine file type icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <FileArchive className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
      <div className="flex items-center">
        <div className="mr-3 p-2 bg-primary/10 rounded">
          {getFileIcon(file)}
        </div>
        <div>
          <p className="font-medium text-sm truncate max-w-xs">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
            <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
              ✓ Uploaded
            </Badge>
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface FileUploadSectionProps {
  title: string;
  description: string;
  files: File[];
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  icon: React.ReactNode;
  acceptTypes: string;
  id: string;
}

const FileUploadSection = ({
  title,
  description,
  files,
  onFileUpload,
  onRemoveFile,
  icon,
  acceptTypes,
  id
}: FileUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      onFileUpload(fileList);
      // Reset the input value to allow uploading the same file again
      e.target.value = '';
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const dt = e.dataTransfer;
    const fileList = dt.files;
    
    if (fileList.length > 0) {
      onFileUpload(fileList);
    }
  };
  
  return (
    <Card className="mb-8">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-primary/40'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            {icon}
            <h3 className="font-medium text-lg mb-2">Upload {title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {isDragging ? 'Drop files here to upload' : 'Drag and drop files here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Accepted file types: {acceptTypes} (Max 10MB per file)
            </p>
            <label htmlFor={`file-upload-${id}`}>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </label>
            <input
              id={`file-upload-${id}`}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              accept={acceptTypes}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {files.length} of {MAX_FILES_PER_CATEGORY} files uploaded
        </p>
        
        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file, index) => (
              <FileItem 
                key={`${file.name}-${index}`} 
                file={file} 
                onRemove={() => onRemoveFile(index)} 
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export function UploadsSection() {
  const { files, updateFiles, setCurrentSection } = useDesignBrief();
  
  const validateAndProcessFiles = (fileList: FileList, maxFiles: number): File[] => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB.`,
        });
        continue;
      }
      
      validFiles.push(file);
      
      // Check if we've hit the max files limit
      if (validFiles.length >= maxFiles) {
        break;
      }
    }
    
    return validFiles;
  };
  
  const handleSiteDocumentUpload = (fileList: FileList) => {
    const remainingSlots = MAX_FILES_PER_CATEGORY - (files.siteDocuments?.length || 0);
    
    if (remainingSlots <= 0) {
      toast({
        title: "Upload limit reached",
        description: `You can upload a maximum of ${MAX_FILES_PER_CATEGORY} site documents.`,
      });
      return;
    }
    
    const maxFilesToAdd = Math.min(fileList.length, remainingSlots);
    const validFiles = validateAndProcessFiles(fileList, maxFilesToAdd);
    
    if (validFiles.length > 0) {
      updateFiles({ 
        siteDocuments: [...(files.siteDocuments || []), ...validFiles]
      });
    }
  };
  
  const handleSitePhotosUpload = (fileList: FileList) => {
    const remainingSlots = MAX_FILES_PER_CATEGORY - (files.sitePhotos?.length || 0);
    
    if (remainingSlots <= 0) {
      toast({
        title: "Upload limit reached",
        description: `You can upload a maximum of ${MAX_FILES_PER_CATEGORY} site photos.`,
      });
      return;
    }
    
    const maxFilesToAdd = Math.min(fileList.length, remainingSlots);
    const validFiles = validateAndProcessFiles(fileList, maxFilesToAdd);
    
    if (validFiles.length > 0) {
      updateFiles({ 
        sitePhotos: [...(files.sitePhotos || []), ...validFiles]
      });
    }
  };
  
  const handleDesignFilesUpload = (fileList: FileList) => {
    const remainingSlots = MAX_FILES_PER_CATEGORY - (files.designFiles?.length || 0);
    
    if (remainingSlots <= 0) {
      toast({
        title: "Upload limit reached",
        description: `You can upload a maximum of ${MAX_FILES_PER_CATEGORY} design files.`,
      });
      return;
    }
    
    const maxFilesToAdd = Math.min(fileList.length, remainingSlots);
    const validFiles = validateAndProcessFiles(fileList, maxFilesToAdd);
    
    if (validFiles.length > 0) {
      updateFiles({ 
        designFiles: [...(files.designFiles || []), ...validFiles]
      });
    }
  };
  
  const handleInspirationFilesUpload = (fileList: FileList) => {
    const remainingSlots = MAX_FILES_PER_CATEGORY - (files.inspirationFiles?.length || 0);
    
    if (remainingSlots <= 0) {
      toast({
        title: "Upload limit reached",
        description: `You can upload a maximum of ${MAX_FILES_PER_CATEGORY} inspiration files.`,
      });
      return;
    }
    
    const maxFilesToAdd = Math.min(fileList.length, remainingSlots);
    const validFiles = validateAndProcessFiles(fileList, maxFilesToAdd);
    
    if (validFiles.length > 0) {
      updateFiles({ 
        inspirationFiles: [...(files.inspirationFiles || []), ...validFiles]
      });
    }
  };
  
  const handleRemoveSiteDocument = (index: number) => {
    const updatedFiles = [...(files.siteDocuments || [])];
    updatedFiles.splice(index, 1);
    updateFiles({ siteDocuments: updatedFiles });
  };
  
  const handleRemoveSitePhoto = (index: number) => {
    const updatedFiles = [...(files.sitePhotos || [])];
    updatedFiles.splice(index, 1);
    updateFiles({ sitePhotos: updatedFiles });
  };
  
  const handleRemoveDesignFile = (index: number) => {
    const updatedFiles = [...(files.designFiles || [])];
    updatedFiles.splice(index, 1);
    updateFiles({ designFiles: updatedFiles });
  };
  
  const handleRemoveInspirationFile = (index: number) => {
    const updatedFiles = [...(files.inspirationFiles || [])];
    updatedFiles.splice(index, 1);
    updateFiles({ inspirationFiles: updatedFiles });
  };
  
  const handlePrevious = () => {
    setCurrentSection('architecture');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('communication');
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Upload Files" 
          description="Upload any relevant documents for your project by category. These files will help us understand your project requirements and references."
        />
        
        {/* Site Documents Upload Section */}
        <FileUploadSection
          title="Site Documents"
          description="Upload Certificate of Title, LIM Report, Resource Consent Documents, and other site-related documents."
          files={files.siteDocuments || []}
          onFileUpload={handleSiteDocumentUpload}
          onRemoveFile={handleRemoveSiteDocument}
          icon={<FileText className="h-10 w-10 text-primary mb-4" />}
          acceptTypes=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          id="site-docs"
        />
        
        {/* Site Photos Upload Section */}
        <FileUploadSection
          title="Site Photos"
          description="Upload recent photos of your site from different angles or key features you'd like us to see."
          files={files.sitePhotos || []}
          onFileUpload={handleSitePhotosUpload}
          onRemoveFile={handleRemoveSitePhoto}
          icon={<Camera className="h-10 w-10 text-primary mb-4" />}
          acceptTypes=".jpg,.jpeg,.png,.heic,.pdf"
          id="site-photos"
        />
        
        {/* Design Files Upload Section */}
        <FileUploadSection
          title="Design Files"
          description="Upload Floor Plans, Concept Drawings, Site Survey or Topo Files, and other design-related documents."
          files={files.designFiles || []}
          onFileUpload={handleDesignFilesUpload}
          onRemoveFile={handleRemoveDesignFile}
          icon={<File className="h-10 w-10 text-primary mb-4" />}
          acceptTypes=".pdf,.dwg,.dxf,.skp,.doc,.docx,.xls,.xlsx,image/*"
          id="design-files"
        />
        
        {/* Inspiration Files Upload Section */}
        <FileUploadSection
          title="Inspiration & Visuals"
          description="Upload Moodboards, Exterior/Interior Example Images, Product or Material References."
          files={files.inspirationFiles || []}
          onFileUpload={handleInspirationFilesUpload}
          onRemoveFile={handleRemoveInspirationFile}
          icon={<ImageIcon className="h-10 w-10 text-primary mb-4" />}
          acceptTypes="image/*,.pdf"
          id="inspiration-files"
        />
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Architecture</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Communication</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
