
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UploadsSection() {
  const { files, updateFiles, setCurrentSection } = useDesignBrief();
  const { toast } = useToast();
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    // Check if adding these files would exceed the 20-file limit
    if (files.uploadedFiles.length + fileList.length > 20) {
      toast({
        title: "Upload limit reached",
        description: "You can upload a maximum of 20 files.",
        variant: "destructive",
      });
      return;
    }
    
    // Add the new files to the uploaded files array
    const newFiles = Array.from(fileList);
    updateFiles({ uploadedFiles: [...files.uploadedFiles, ...newFiles] });
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  }, [files.uploadedFiles, updateFiles, toast]);
  
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files.uploadedFiles];
    updatedFiles.splice(index, 1);
    updateFiles({ uploadedFiles: updatedFiles });
  };
  
  const handlePrevious = () => {
    setCurrentSection('inspiration');
  };
  
  const handleNext = () => {
    setCurrentSection('summary');
  };
  
  // Helper function to determine file type icon
  const getFileIcon = (file: File) => {
    const isImage = file.type.startsWith('image/');
    return isImage ? <ImageIcon className="h-5 w-5" /> : <File className="h-5 w-5" />;
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Upload Files</h1>
        <p className="design-brief-section-description">
          Upload any relevant files for your project, such as site plans, sketches, or reference images. You can upload up to 20 files.
        </p>
        
        <div className="design-brief-card p-8">
          <div className="mb-8 text-center">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 mb-4">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Upload your files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Accepted file types: Images, PDFs, DWG, and other common files (Max 10MB per file)
                </p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.dwg,.dxf,.skp,.doc,.docx,.xls,.xlsx"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {files.uploadedFiles.length} of 20 files uploaded
            </p>
          </div>
          
          {files.uploadedFiles.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {files.uploadedFiles.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-primary/10 rounded">
                        {getFileIcon(file)}
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Inspiration</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Summary</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
