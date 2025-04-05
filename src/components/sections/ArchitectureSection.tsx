
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload, Image } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export function ArchitectureSection() {
  const { setCurrentSection, updateFormData, formData, updateFiles } = useDesignBrief();
  const architectureData = formData.architecture;
  const [selectedImages, setSelectedImages] = useState<string[]>(formData.files?.inspirationSelections || []);
  
  const handlePrevious = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('architecture', { [field]: value });
  };

  const styleOptions = [
    { value: 'Modern', label: 'Modern' },
    { value: 'Contemporary', label: 'Contemporary' },
    { value: 'Traditional', label: 'Traditional' },
    { value: 'Minimalist', label: 'Minimalist' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Farmhouse', label: 'Farmhouse' },
    { value: 'Mid-Century Modern', label: 'Mid-Century Modern' },
    { value: 'Craftsman', label: 'Craftsman' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'Scandinavian', label: 'Scandinavian' },
  ];

  const materialOptions = [
    { value: 'Wood', label: 'Wood' },
    { value: 'Concrete', label: 'Concrete' },
    { value: 'Brick', label: 'Brick' },
    { value: 'Stone', label: 'Stone' },
    { value: 'Glass', label: 'Glass' },
    { value: 'Steel', label: 'Steel' },
    { value: 'Aluminum', label: 'Aluminum' },
    { value: 'Ceramic', label: 'Ceramic' },
    { value: 'Stucco', label: 'Stucco' },
    { value: 'Vinyl', label: 'Vinyl' },
  ];

  const sustainabilityOptions = [
    { value: 'Solar Panels', label: 'Solar Panels' },
    { value: 'Energy-Efficient Windows', label: 'Energy-Efficient Windows' },
    { value: 'Rainwater Harvesting', label: 'Rainwater Harvesting' },
    { value: 'Green Roof', label: 'Green Roof' },
    { value: 'Passive Design', label: 'Passive Design' },
    { value: 'Insulation', label: 'Insulation' },
    { value: 'Smart Home Tech', label: 'Smart Home Tech' },
    { value: 'Reclaimed Materials', label: 'Reclaimed Materials' },
    { value: 'Low VOC Materials', label: 'Low VOC Materials' },
    { value: 'Water Conservation', label: 'Water Conservation' },
  ];

  const technologyOptions = [
    { value: 'Smart Home System', label: 'Smart Home System' },
    { value: 'Automated Lighting', label: 'Automated Lighting' },
    { value: 'Climate Control', label: 'Climate Control' },
    { value: 'Security System', label: 'Security System' },
    { value: 'Entertainment System', label: 'Entertainment System' },
    { value: 'Electric Vehicle Charging', label: 'Electric Vehicle Charging' },
    { value: 'High-Speed Internet', label: 'High-Speed Internet' },
    { value: 'Voice Control', label: 'Voice Control' },
    { value: 'Energy Monitoring', label: 'Energy Monitoring' },
    { value: 'Automated Irrigation', label: 'Automated Irrigation' },
  ];

  // Sample inspiration images
  const inspirationImages = [
    { id: 'modern-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', label: 'Modern Interior' },
    { id: 'scandinavian-1', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f', label: 'Scandinavian Style' },
    { id: 'industrial-1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', label: 'Industrial Loft' },
    { id: 'minimalist-1', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457', label: 'Minimalist Design' },
    { id: 'traditional-1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0', label: 'Traditional Home' },
    { id: 'contemporary-1', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92', label: 'Contemporary Space' },
    { id: 'mid-century-1', url: 'https://images.unsplash.com/photo-1556702571-3e11dd2b1a92', label: 'Mid-Century Modern' },
    { id: 'farmhouse-1', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', label: 'Farmhouse Style' },
  ];

  const handleStylesChange = (values: string[]) => {
    updateFormData('architecture', { preferredStyles: values });
  };

  const handleMaterialsChange = (values: string[]) => {
    updateFormData('architecture', { materialPreferences: values });
  };

  const handleSustainabilityChange = (values: string[]) => {
    updateFormData('architecture', { sustainabilityFeatures: values });
  };

  const handleTechnologyChange = (values: string[]) => {
    updateFormData('architecture', { technologyRequirements: values });
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => {
      const newSelection = prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId];
      
      // Update in context
      updateFiles({ inspirationSelections: newSelection });
      return newSelection;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Process each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const uploadedInspirationImages = formData.files?.uploadedInspirationImages || [];
    const newImages = [...uploadedInspirationImages];
    let hasErrors = false;

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        hasErrors = true;
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds the 5MB size limit`);
        hasErrors = true;
        return;
      }

      // In a real app, we would upload the file to a server here
      // For now, we'll just add it to the list with a local URL
      const fileUrl = URL.createObjectURL(file);
      newImages.push({
        id: `uploaded-${Date.now()}-${file.name}`,
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size
      });
    });

    if (!hasErrors) {
      toast.success(`${files.length} file(s) uploaded successfully`);
      updateFiles({ uploadedInspirationImages: newImages });
    }

    // Clear the input
    event.target.value = '';
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Architectural Style & Features" 
          description="Provide details about your design preferences, materials, and special architectural features."
        />
        
        <div className="design-brief-form-group">
          <MultiSelectButtons
            label="Preferred Architectural Styles"
            description="Select the architectural styles you prefer for your project."
            options={styleOptions}
            selectedValues={architectureData.preferredStyles || []}
            onChange={handleStylesChange}
          />

          <div className="space-y-2 mt-6">
            <Label htmlFor="stylePrefences" className="design-brief-question-title">Style Preferences Details</Label>
            <Textarea 
              id="stylePrefences" 
              placeholder="Describe your architectural style preferences in detail..."
              value={architectureData.stylePrefences || ''}
              onChange={(e) => handleInputChange('stylePrefences', e.target.value)}
            />
          </div>
        </div>

        <div className="design-brief-form-group">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inspiration Images</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select images that represent your design preferences and inspirations.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inspirationImages.map((image) => (
                <div 
                  key={image.id}
                  className={`relative overflow-hidden rounded-md transition-all cursor-pointer aspect-video ${
                    selectedImages.includes(image.id) ? 'ring-4 ring-primary' : 'hover:opacity-90'
                  }`}
                  onClick={() => handleImageSelect(image.id)}
                >
                  <img 
                    src={image.url} 
                    alt={image.label} 
                    className="object-cover w-full h-full"
                  />
                  {selectedImages.includes(image.id) && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                    {image.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Display uploaded images */}
            {formData.files?.uploadedInspirationImages && formData.files.uploadedInspirationImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Your Uploaded Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.files.uploadedInspirationImages.map((image) => (
                    <div key={image.id} className="relative overflow-hidden rounded-md aspect-video">
                      {image.type.startsWith('image/') ? (
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-muted w-full h-full">
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto mb-2" />
                            <span className="text-xs">{image.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload your own images */}
            <div className="mt-6">
              <Card className="p-6">
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-md font-medium mb-2">Upload Your Own Inspiration</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your own inspiration images, mood boards, or sketches (JPG, PNG, PDF accepted, max 5MB)
                  </p>
                  <div className="flex justify-center">
                    <div className="relative">
                      <Input 
                        type="file" 
                        id="inspirationUpload" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <Button type="button" variant="outline" className="relative">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <MultiSelectButtons
              label="Material Preferences"
              description="Select your preferred building materials."
              options={materialOptions}
              selectedValues={architectureData.materialPreferences || []}
              onChange={handleMaterialsChange}
            />

            <div className="space-y-2">
              <Label htmlFor="externalMaterials" className="design-brief-question-title">External Materials</Label>
              <Textarea 
                id="externalMaterials" 
                placeholder="Describe your preferences for external materials and finishes..."
                value={architectureData.externalMaterials || ''}
                onChange={(e) => handleInputChange('externalMaterials', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalFinishes" className="design-brief-question-title">Internal Finishes</Label>
              <Textarea 
                id="internalFinishes" 
                placeholder="Describe your preferences for internal finishes, colors, and textures..."
                value={architectureData.internalFinishes || ''}
                onChange={(e) => handleInputChange('internalFinishes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <MultiSelectButtons
              label="Sustainability Features"
              description="Select the sustainability features you're interested in including."
              options={sustainabilityOptions}
              selectedValues={architectureData.sustainabilityFeatures || []}
              onChange={handleSustainabilityChange}
            />

            <div className="space-y-2">
              <Label htmlFor="sustainabilityGoals" className="design-brief-question-title">Sustainability Goals</Label>
              <Textarea 
                id="sustainabilityGoals" 
                placeholder="Describe your sustainability goals and priorities..."
                value={architectureData.sustainabilityGoals || ''}
                onChange={(e) => handleInputChange('sustainabilityGoals', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <MultiSelectButtons
              label="Technology Requirements"
              description="Select the technology features you want to include."
              options={technologyOptions}
              selectedValues={architectureData.technologyRequirements || []}
              onChange={handleTechnologyChange}
            />

            <div className="space-y-2">
              <Label htmlFor="specialFeatures" className="design-brief-question-title">Special Architectural Features</Label>
              <Textarea 
                id="specialFeatures" 
                placeholder="Describe any special architectural features you're interested in..."
                value={architectureData.specialFeatures || ''}
                onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspirationNotes" className="design-brief-question-title">Inspiration Notes</Label>
              <Textarea 
                id="inspirationNotes" 
                placeholder="Describe sources of inspiration or reference projects..."
                value={architectureData.inspirationNotes || ''}
                onChange={(e) => handleInputChange('inspirationNotes', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="architectureNotes" className="design-brief-question-title">Additional Architecture Notes</Label>
              <Textarea 
                id="architectureNotes" 
                placeholder="Any other architectural considerations or preferences..."
                value={architectureData.architectureNotes || ''}
                onChange={(e) => handleInputChange('architectureNotes', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Spaces</span>
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
