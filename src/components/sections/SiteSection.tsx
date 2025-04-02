
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Upload, Image, X, FileText } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function SiteSection() {
  const { formData, updateFormData, setCurrentSection, projectData, updateFiles } = useDesignBrief();
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>(
    projectData.files.uploadedFiles || []
  );
  const [siteDocuments, setSiteDocuments] = useState<File[]>(
    projectData.files.siteDocuments || []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('lifestyle');
  };
  
  const handleNext = () => {
    setCurrentSection('spaces');
  };
  
  const handleSiteDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Filter for PDF files only
      const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length !== newFiles.length) {
        toast.warning("Only PDF files are allowed. Non-PDF files were ignored.");
      }
      
      if (pdfFiles.length === 0) {
        e.target.value = '';
        return;
      }
      
      const updatedFiles = [...siteDocuments, ...pdfFiles];
      setSiteDocuments(updatedFiles);
      
      // Update the global state with the new files
      updateFiles({
        ...projectData.files,
        siteDocuments: updatedFiles
      });
      
      e.target.value = '';
    }
  };
  
  const handleRemoveSiteDocument = (index: number) => {
    const updatedFiles = [...siteDocuments];
    updatedFiles.splice(index, 1);
    setSiteDocuments(updatedFiles);
    
    // Update the global state with the updated files
    updateFiles({
      ...projectData.files,
      siteDocuments: updatedFiles
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...uploadedPhotos, ...newFiles];
      setUploadedPhotos(updatedFiles);
      
      // Update the global state with the new files
      updateFiles({
        ...projectData.files,
        uploadedFiles: updatedFiles
      });
    }
  };
  
  const handleRemovePhoto = (index: number) => {
    const updatedFiles = [...uploadedPhotos];
    updatedFiles.splice(index, 1);
    setUploadedPhotos(updatedFiles);
    
    // Update the global state with the updated files
    updateFiles({
      ...projectData.files,
      uploadedFiles: updatedFiles
    });
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Site Information" 
          description="Understanding your site helps us design with the natural environment and surroundings in mind."
          isBold={true}
        />
        
        {/* Site Documentation Upload Section - NEW */}
        <div className="design-brief-form-group mb-8">
          <div className="p-4 border rounded-md bg-muted/30">
            <Label className="design-brief-question-title font-bold mb-2">
              Site Documentation Upload
            </Label>
            <p className="design-brief-question-description mb-4">
              Upload relevant site documents (PDF only): Certificate of Title, Covenants, Resource Consents, or any other relevant site information. If you don't have these on hand, that's okay — we can request them on your behalf.
            </p>
            
            <div className="mt-4">
              <Label 
                htmlFor="site-documents" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-primary/50 cursor-pointer bg-background hover:bg-accent/10 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-2 text-primary" />
                  <p className="mb-2 text-sm text-center">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF files only
                  </p>
                </div>
                <Input 
                  id="site-documents" 
                  type="file" 
                  accept="application/pdf" 
                  multiple 
                  className="hidden" 
                  onChange={handleSiteDocumentUpload}
                />
              </Label>
            </div>
            
            {/* Display uploaded documents */}
            {siteDocuments.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Uploaded Documents ({siteDocuments.length})</h3>
                <div className="grid grid-cols-1 gap-2">
                  {siteDocuments.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`} 
                      className="flex items-center justify-between p-3 bg-background rounded-md border"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-primary/10 rounded">
                          <FileText className="h-5 w-5" />
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
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title font-bold">
              Site Description
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the general characteristics of the site (e.g., urban, suburban, rural, coastal).
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the site's general environment and setting..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="siteFeatures" className="design-brief-question-title font-bold">
              Topography
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the site's topography (e.g., flat, sloping, steep).
            </p>
            <Textarea
              id="siteFeatures"
              name="siteFeatures"
              placeholder="Describe the site's topography and any significant elevation changes..."
              value={formData.site.siteFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="neighboringProperties" className="design-brief-question-title font-bold">
              Vegetation
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the existing vegetation on the site (e.g., trees, shrubs, grass).
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the site's vegetation and any significant trees or plants..."
              value={formData.site.neighboringProperties}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="viewsOrientations" className="design-brief-question-title font-bold">
              Views
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the views from the site (e.g., ocean, mountains, city skyline).
            </p>
            <Textarea
              id="viewsOrientations"
              name="viewsOrientations"
              placeholder="Describe the views from the site and any significant landmarks..."
              value={formData.site.viewsOrientations}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {/* Site Photos Upload Section */}
          <div className="mt-8">
            <Label className="design-brief-question-title font-bold">
              Site Photos
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Upload photos of your site to help us better understand the location and its features.
            </p>
            
            <div className="mt-4">
              <Label 
                htmlFor="site-photos" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-primary/50 cursor-pointer bg-background hover:bg-accent/10 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-primary" />
                  <p className="mb-2 text-sm text-center">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF (MAX. 10MB each)
                  </p>
                </div>
                <Input 
                  id="site-photos" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </Label>
            </div>
            
            {/* Display uploaded photos */}
            {uploadedPhotos.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Uploaded Photos ({uploadedPhotos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedPhotos.map((file, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-2">
                        <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Uploaded Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 rounded-full" 
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm font-medium mt-2 truncate">
                          Uploaded Photo {index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {file.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Lifestyle</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Spaces</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
