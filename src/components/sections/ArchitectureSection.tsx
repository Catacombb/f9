
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

// Import the necessary components
import { StylePreferences } from '@/components/architecture/StylePreferences';
import { MaterialsSection } from '@/components/architecture/MaterialsSection';
import { SustainabilitySection } from '@/components/architecture/SustainabilitySection';
import { TechnologySection } from '@/components/architecture/TechnologySection';

// Import helper functions
import { 
  getExternalMaterials, 
  getInternalMaterials,
} from '@/components/architecture/helpers';

// Material options for the helper functions
const externalMaterialOptions = [
  { value: 'Brick', label: 'Brick' },
  { value: 'Weatherboard', label: 'Weatherboard' },
  { value: 'Linea', label: 'Linea' },
  { value: 'Cedar', label: 'Cedar' },
  { value: 'Stone', label: 'Stone' },
  { value: 'Corten Steel', label: 'Corten Steel' },
  { value: 'Aluminum Composite Panel', label: 'Aluminum Composite Panel' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Stucco', label: 'Stucco' },
  { value: 'Fiber Cement', label: 'Fiber Cement' },
  { value: 'Metal Cladding', label: 'Metal Cladding' },
  { value: 'ColorSteel', label: 'ColorSteel' },
];

const internalMaterialOptions = [
  { value: 'Timber Flooring', label: 'Timber Flooring' },
  { value: 'Engineered Wood', label: 'Engineered Wood' },
  { value: 'Carpet', label: 'Carpet' },
  { value: 'Tile', label: 'Tile' },
  { value: 'Vinyl', label: 'Vinyl' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Natural Stone', label: 'Natural Stone' },
  { value: 'Plasterboard', label: 'Plasterboard' },
  { value: 'Timber Paneling', label: 'Timber Paneling' },
  { value: 'Marble', label: 'Marble' },
  { value: 'Granite', label: 'Granite' },
  { value: 'Quartz', label: 'Quartz' },
];

export function ArchitectureSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const architectureData = formData.architecture;
  
  const handlePrevious = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('uploads');
    window.scrollTo(0, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('architecture', { [field]: value });
  };

  const handleStylesChange = (values: string[]) => {
    updateFormData('architecture', { preferredStyles: values });
  };

  const handleExternalMaterialsChange = (values: string[]) => {
    const externalValues = values.filter(v => 
      externalMaterialOptions.some(o => o.value === v)
    );
    
    const currentPreferences = architectureData.materialPreferences || [];
    
    const internalValues = currentPreferences.filter(p => 
      !externalMaterialOptions.some(o => o.value === p)
    );
    
    updateFormData('architecture', { 
      materialPreferences: [...internalValues, ...externalValues] 
    });
  };

  const handleInternalMaterialsChange = (values: string[]) => {
    const internalValues = values.filter(v => 
      internalMaterialOptions.some(o => o.value === v)
    );
    
    const currentPreferences = architectureData.materialPreferences || [];
    
    const externalValues = currentPreferences.filter(p => 
      !internalMaterialOptions.some(o => o.value === p)
    );
    
    updateFormData('architecture', { 
      materialPreferences: [...externalValues, ...internalValues] 
    });
  };

  const handleSustainabilityChange = (values: string[]) => {
    updateFormData('architecture', { sustainabilityFeatures: values });
  };

  const handleTechnologyChange = (values: string[]) => {
    updateFormData('architecture', { technologyRequirements: values });
  };
  
  const externalMaterialsSelected = getExternalMaterials(
    architectureData.materialPreferences, 
    externalMaterialOptions
  );
  
  const internalMaterialsSelected = getInternalMaterials(
    architectureData.materialPreferences, 
    internalMaterialOptions
  );

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Architectural Style & Features" 
          description="Provide details about your design preferences, materials, and special architectural features."
        />
        
        <StylePreferences 
          preferredStyles={architectureData.preferredStyles || []}
          stylePrefences={architectureData.stylePrefences || ''}
          onStylesChange={handleStylesChange}
          onInputChange={handleInputChange}
        />
        
        {/* Inspiration References Section */}
        <div className="design-brief-form-group mt-8">
          <Card>
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-semibold mb-4">Inspiration References</h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="inspirationLinks" className="text-base font-medium mb-2 block">
                    Link to a project or home you like
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add URLs to websites, articles, or social media posts that showcase homes or projects you admire.
                    Separate multiple links with commas.
                  </p>
                  <Textarea
                    id="inspirationLinks"
                    value={architectureData.inspirationLinks || ''}
                    onChange={(e) => handleInputChange('inspirationLinks', e.target.value)}
                    placeholder="e.g., https://www.example.com/beautiful-home, https://pinterest.com/pin/12345"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="inspirationComments" className="text-base font-medium mb-2 block">
                    What do you like about these projects?
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Describe what specifically appeals to you about these designs or projects.
                  </p>
                  <Textarea
                    id="inspirationComments"
                    value={architectureData.inspirationComments || ''}
                    onChange={(e) => handleInputChange('inspirationComments', e.target.value)}
                    placeholder="e.g., I love how the living spaces flow together in the first example, and the use of natural light in the second."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <MaterialsSection 
          externalMaterials={architectureData.externalMaterials || ''}
          internalFinishes={architectureData.internalFinishes || ''}
          externalMaterialsSelected={externalMaterialsSelected}
          internalMaterialsSelected={internalMaterialsSelected}
          onExternalMaterialsChange={handleExternalMaterialsChange}
          onInternalMaterialsChange={handleInternalMaterialsChange}
          onInputChange={handleInputChange}
        />
        
        <SustainabilitySection 
          sustainabilityGoals={architectureData.sustainabilityGoals || ''}
          sustainabilityFeatures={architectureData.sustainabilityFeatures || []}
          onSustainabilityChange={handleSustainabilityChange}
          onInputChange={handleInputChange}
        />
        
        <TechnologySection 
          specialFeatures={architectureData.specialFeatures || ''}
          inspirationNotes={architectureData.inspirationNotes || ''}
          architectureNotes={architectureData.architectureNotes || ''}
          technologyRequirements={architectureData.technologyRequirements || []}
          onTechnologyChange={handleTechnologyChange}
          onInputChange={handleInputChange}
        />
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Spaces</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Uploads</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
