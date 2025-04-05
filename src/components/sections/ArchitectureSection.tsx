
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { toast } from 'sonner';

// Import the new components
import { StylePreferences } from '@/components/architecture/StylePreferences';
import { InspirationImages } from '@/components/architecture/InspirationImages';
import { MaterialsSection } from '@/components/architecture/MaterialsSection';
import { SustainabilitySection } from '@/components/architecture/SustainabilitySection';
import { TechnologySection } from '@/components/architecture/TechnologySection';

// Import helper functions
import { 
  getExternalMaterials, 
  getInternalMaterials,
  handleFileUpload 
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
  const { setCurrentSection, updateFormData, formData, files, updateFiles } = useDesignBrief();
  const architectureData = formData.architecture;
  const [selectedImages, setSelectedImages] = useState<string[]>(files?.inspirationSelections || []);
  
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

  const handleStylesChange = (values: string[]) => {
    updateFormData('architecture', { preferredStyles: values });
  };

  const handleExternalMaterialsChange = (values: string[]) => {
    // Use the correct property name from the type definition
    const externalValues = values.filter(v => 
      externalMaterialOptions.some(o => o.value === v)
    );
    
    // Get current material preferences or initialize empty array
    const currentPreferences = architectureData.materialPreferences || [];
    
    // Filter out any existing external materials (those in externalMaterialOptions)
    const internalValues = currentPreferences.filter(p => 
      !externalMaterialOptions.some(o => o.value === p)
    );
    
    // Combine the internal values with the new external values
    updateFormData('architecture', { 
      materialPreferences: [...internalValues, ...externalValues] 
    });
  };

  const handleInternalMaterialsChange = (values: string[]) => {
    // Use the correct property name from the type definition
    const internalValues = values.filter(v => 
      internalMaterialOptions.some(o => o.value === v)
    );
    
    // Get current material preferences or initialize empty array
    const currentPreferences = architectureData.materialPreferences || [];
    
    // Filter out any existing internal materials (those in internalMaterialOptions)
    const externalValues = currentPreferences.filter(p => 
      !internalMaterialOptions.some(o => o.value === p)
    );
    
    // Combine the external values with the new internal values
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

  const handleImageUpload = (fileList: FileList | null) => {
    const currentUploaded = files?.uploadedInspirationImages || [];
    
    const result = handleFileUpload(
      fileList, 
      currentUploaded,
      (newImages) => {
        updateFiles({ uploadedInspirationImages: newImages });
      }
    );
    
    if (result && result.message) {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  // Get the external and internal materials from materialPreferences
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
        
        {/* Style Preferences Component */}
        <StylePreferences 
          preferredStyles={architectureData.preferredStyles || []}
          stylePrefences={architectureData.stylePrefences || ''}
          onStylesChange={handleStylesChange}
          onInputChange={handleInputChange}
        />
        
        {/* Inspiration Images Component */}
        <InspirationImages 
          selectedImages={selectedImages}
          files={files}
          onImageSelect={handleImageSelect}
          onFileUpload={handleImageUpload}
        />
        
        {/* Materials Section Component */}
        <MaterialsSection 
          externalMaterials={architectureData.externalMaterials || ''}
          internalFinishes={architectureData.internalFinishes || ''}
          externalMaterialsSelected={externalMaterialsSelected}
          internalMaterialsSelected={internalMaterialsSelected}
          onExternalMaterialsChange={handleExternalMaterialsChange}
          onInternalMaterialsChange={handleInternalMaterialsChange}
          onInputChange={handleInputChange}
        />
        
        {/* Sustainability Section Component */}
        <SustainabilitySection 
          sustainabilityGoals={architectureData.sustainabilityGoals || ''}
          sustainabilityFeatures={architectureData.sustainabilityFeatures || []}
          onSustainabilityChange={handleSustainabilityChange}
          onInputChange={handleInputChange}
        />
        
        {/* Technology & Additional Notes Component */}
        <TechnologySection 
          specialFeatures={architectureData.specialFeatures || ''}
          inspirationNotes={architectureData.inspirationNotes || ''}
          architectureNotes={architectureData.architectureNotes || ''}
          technologyRequirements={architectureData.technologyRequirements || []}
          onTechnologyChange={handleTechnologyChange}
          onInputChange={handleInputChange}
        />
        
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
