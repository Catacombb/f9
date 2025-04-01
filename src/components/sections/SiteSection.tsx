
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SiteSection() {
  const { formData, updateFormData, files, updateFiles, setCurrentSection } = useDesignBrief();
  const { toast } = useToast();
  const [siteDocuments, setSiteDocuments] = useState<{[key: string]: File | null}>({
    topographicSurvey: null,
    existingHouseDrawings: null,
    septicDesign: null,
    certificateOfTitle: null,
    covenants: null
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('site', { [name]: value });
  };
  
  const handleRadioChange = (name: string, value: string) => {
    updateFormData('site', { [name]: value });
  };
  
  const handleFileUpload = (documentType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the file in the component state
    setSiteDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));
    
    // Also add to the uploaded files array with a prefix to identify it
    const prefixedFile = new File([file], `site_${documentType}_${file.name}`, { type: file.type });
    updateFiles({ uploadedFiles: [...files.uploadedFiles, prefixedFile] });
    
    // Reset the input value
    e.target.value = '';
  };
  
  const handleRemoveFile = (documentType: string) => {
    // Remove from component state
    setSiteDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    // Find and remove from uploaded files
    const updatedFiles = files.uploadedFiles.filter(file => 
      !file.name.startsWith(`site_${documentType}_`)
    );
    updateFiles({ uploadedFiles: updatedFiles });
  };
  
  const handlePrevious = () => {
    setCurrentSection('lifestyle');
  };
  
  const handleNext = () => {
    setCurrentSection('architecture');
  };
  
  const renderUploadField = (documentType: string, label: string) => {
    const file = siteDocuments[documentType];
    const documentValue = formData.site[documentType as keyof typeof formData.site] || 'no';
    
    return (
      <div className="mb-6">
        <Label className="design-brief-question-title">{label}</Label>
        <RadioGroup 
          value={documentValue} 
          onValueChange={(value) => handleRadioChange(documentType, value)}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${documentType}_yes`} />
            <Label htmlFor={`${documentType}_yes`} className="font-normal">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${documentType}_no`} />
            <Label htmlFor={`${documentType}_no`} className="font-normal">No</Label>
          </div>
        </RadioGroup>
        
        {documentValue === 'yes' && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Optional: Upload your {label.toLowerCase()}</p>
            {!file ? (
              <div className="flex items-center">
                <label htmlFor={`${documentType}-upload`} className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Choose file</span>
                  </div>
                </label>
                <input
                  id={`${documentType}-upload`}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(documentType, e)}
                  accept=".pdf,.doc,.docx,.dwg,.dxf,.jpg,.jpeg,.png"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveFile(documentType)}
                  aria-label={`Remove ${label} file`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Site Information</h1>
        <p className="design-brief-section-description">
          Understanding your site helps us design a home that responds to its context and maximizes its potential.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="existingConditions" className="design-brief-question-title">
              Existing Site Conditions
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe the current state of the site or existing building. Include details about topography, vegetation, or existing structures.
            </p>
            <Textarea
              id="existingConditions"
              name="existingConditions"
              placeholder="Describe the current conditions of your site..."
              value={formData.site.existingConditions}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {renderUploadField('topographicSurvey', 'Topographic Survey')}
          {renderUploadField('existingHouseDrawings', 'Existing House Drawings (Council Property File)')}
          {renderUploadField('septicDesign', 'Septic Design')}
          {renderUploadField('certificateOfTitle', 'Certificate of Title')}
          {renderUploadField('covenants', 'Covenants')}
          
          <div className="mb-6">
            <Label htmlFor="siteFeatures" className="design-brief-question-title">
              Notable Site Features
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there special features you want to preserve or highlight? (e.g., trees, rock formations, water features)
            </p>
            <Textarea
              id="siteFeatures"
              name="siteFeatures"
              placeholder="Describe any special features of your site that you want to preserve or highlight..."
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
              What views would you like to capture? How does the sun move across your site? Any preferred orientations?
            </p>
            <Textarea
              id="viewsOrientations"
              name="viewsOrientations"
              placeholder="Describe the views, sun patterns, and desired orientations for your home..."
              value={formData.site.viewsOrientations}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="accessConstraints" className="design-brief-question-title">
              Access and Constraints
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there access challenges? Zoning restrictions? Heritage overlays? Known planning constraints?
            </p>
            <Textarea
              id="accessConstraints"
              name="accessConstraints"
              placeholder="Describe any access challenges or planning restrictions you're aware of..."
              value={formData.site.accessConstraints}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="neighboringProperties" className="design-brief-question-title">
              Neighboring Properties
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe neighboring buildings, privacy concerns, or relationships with adjoining properties.
            </p>
            <Textarea
              id="neighboringProperties"
              name="neighboringProperties"
              placeholder="Describe the surrounding properties and any privacy considerations..."
              value={formData.site.neighboringProperties}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Lifestyle</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Architecture</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
