
import React, { useCallback } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Upload, X, File, FileText } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { animations, useReducedMotion } from '@/lib/animation';

export function SiteSection() {
  const { formData, updateFormData, files, updateFiles, setCurrentSection } = useDesignBrief();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };

  const handlePrevious = () => {
    setCurrentSection('lifestyle');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  const handleSiteDocumentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    // Check if adding these files would exceed the 10-file limit
    if ((files.siteDocuments?.length || 0) + fileList.length > 10) {
      toast({
        title: "Upload limit reached",
        description: "You can upload a maximum of 10 site documents.",
        variant: "destructive",
      });
      return;
    }
    
    // Add the new files to the site documents array
    const newFiles = Array.from(fileList);
    updateFiles({ 
      siteDocuments: [...(files.siteDocuments || []), ...newFiles] 
    });
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
    
    toast({
      title: "Documents uploaded",
      description: `Successfully uploaded ${newFiles.length} document${newFiles.length > 1 ? 's' : ''}.`,
    });
  }, [files.siteDocuments, updateFiles, toast]);
  
  const handleRemoveSiteDocument = (index: number) => {
    if (!files.siteDocuments) return;
    
    const updatedFiles = [...files.siteDocuments];
    updatedFiles.splice(index, 1);
    updateFiles({ siteDocuments: updatedFiles });
    
    toast({
      title: "Document removed",
      description: "The site document has been removed.",
    });
  };

  // Helper function to determine file type icon
  const getFileIcon = (file: File) => {
    const isDocument = file.type.includes('pdf') || 
                      file.type.includes('word') || 
                      file.type.includes('excel') || 
                      file.name.endsWith('.dwg') || 
                      file.name.endsWith('.dxf');
    return isDocument ? <FileText className="h-5 w-5" /> : <File className="h-5 w-5" />;
  };

  const animationClasses = !prefersReducedMotion ? {
    section: "transition-all duration-300 ease-in-out",
    card: "transition-all duration-300 hover:shadow-md",
    button: "transition-all duration-200 active:scale-95",
    fileItem: "animate-fade-in",
  } : {};

  return (
    <div className={cn("design-brief-section-wrapper", animationClasses.section)}>
      <div className="design-brief-section-container">
        <SectionHeader
          title="Site Information"
          description="Tell us about the location of your project. Understanding the site helps us design a home that fits its environment."
        />

        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title">
              Existing Site Conditions
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the current state of the site. Is it vacant land, a teardown, or an existing building?
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the site's current state..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="siteFeatures" className="design-brief-question-title">
              Key Site Features
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What are the notable features of the site? Trees, slopes, water views, etc.?
            </p>
            <Textarea
              id="siteFeatures"
              name="siteFeatures"
              placeholder="List any significant features of the site..."
              value={formData.site.siteFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="viewsOrientations" className="design-brief-question-title">
              Views and Orientations
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What are the best views from the site? Which direction does the site face?
            </p>
            <Textarea
              id="viewsOrientations"
              name="viewsOrientations"
              placeholder="Describe the views and the site's orientation..."
              value={formData.site.viewsOrientations}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="accessConstraints" className="design-brief-question-title">
              Site Access and Constraints
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there any challenges in accessing the site? Easements, setbacks, etc.?
            </p>
            <Textarea
              id="accessConstraints"
              name="accessConstraints"
              placeholder="Note any access issues or site constraints..."
              value={formData.site.accessConstraints}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="neighboringProperties" className="design-brief-question-title">
              Neighboring Properties
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the surrounding properties. Residential, commercial, busy street, etc.?
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the neighboring properties..."
              value={formData.site.neighboringProperties}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {/* Site Documents Upload Section */}
          <div className="mb-6">
            <div className="design-brief-question-title mb-2">
              Site Documents
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </div>
            <p className="design-brief-question-description mb-4">
              Upload any relevant site documents such as certificates of title, LIM reports, or survey plans.
            </p>
            
            <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 mb-4">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-medium mb-2">Upload site documents</h4>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Drag and drop files here or click to browse
                </p>
                <label htmlFor="site-document-upload">
                  <Button 
                    asChild 
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      animationClasses.button
                    )}
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
                <input
                  id="site-document-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleSiteDocumentUpload}
                  accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Max 10 files (PDF, DWG, images, or documents)
                </p>
              </div>
            </div>
            
            {/* Display uploaded site documents */}
            {files.siteDocuments && files.siteDocuments.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Uploaded Site Documents</h4>
                <div className="space-y-2">
                  {files.siteDocuments.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className={cn(
                        "flex items-center justify-between p-3 bg-background rounded-lg border",
                        animationClasses.fileItem
                      )}
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
                        onClick={() => handleRemoveSiteDocument(index)}
                        aria-label={`Remove ${file.name}`}
                        className={animationClasses.button}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="siteNotes" className="design-brief-question-title">
              Additional Site Notes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="siteNotes"
              name="siteNotes"
              placeholder="Any other important information about the site..."
              value={formData.site.siteNotes}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            className={cn("group", animationClasses.button)}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Lifestyle</span>
          </Button>

          <Button 
            onClick={handleNext} 
            className={cn("group", animationClasses.button)}
          >
            <span>Next: Spaces</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
