
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

export function ArchitectureSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const architectureData = formData.architecture;

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

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Architectural Style & Features" 
        description="Provide details about your design preferences, materials, and special architectural features."
      />
      
      <div className="space-y-6">
        <div className="grid gap-6">
          <MultiSelectButtons
            label="Preferred Architectural Styles"
            description="Select the architectural styles you prefer for your project."
            options={styleOptions}
            selectedValues={architectureData.preferredStyles || []}
            onChange={handleStylesChange}
          />

          <div className="space-y-2">
            <Label htmlFor="stylePrefences">Style Preferences Details</Label>
            <Textarea 
              id="stylePrefences" 
              placeholder="Describe your architectural style preferences in detail..."
              value={architectureData.stylePrefences || ''}
              onChange={(e) => handleInputChange('stylePrefences', e.target.value)}
            />
          </div>

          <MultiSelectButtons
            label="Material Preferences"
            description="Select your preferred building materials."
            options={materialOptions}
            selectedValues={architectureData.materialPreferences || []}
            onChange={handleMaterialsChange}
          />

          <div className="space-y-2">
            <Label htmlFor="externalMaterials">External Materials</Label>
            <Textarea 
              id="externalMaterials" 
              placeholder="Describe your preferences for external materials and finishes..."
              value={architectureData.externalMaterials || ''}
              onChange={(e) => handleInputChange('externalMaterials', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalFinishes">Internal Finishes</Label>
            <Textarea 
              id="internalFinishes" 
              placeholder="Describe your preferences for internal finishes, colors, and textures..."
              value={architectureData.internalFinishes || ''}
              onChange={(e) => handleInputChange('internalFinishes', e.target.value)}
            />
          </div>

          <MultiSelectButtons
            label="Sustainability Features"
            description="Select the sustainability features you're interested in including."
            options={sustainabilityOptions}
            selectedValues={architectureData.sustainabilityFeatures || []}
            onChange={handleSustainabilityChange}
          />

          <div className="space-y-2">
            <Label htmlFor="sustainabilityGoals">Sustainability Goals</Label>
            <Textarea 
              id="sustainabilityGoals" 
              placeholder="Describe your sustainability goals and priorities..."
              value={architectureData.sustainabilityGoals || ''}
              onChange={(e) => handleInputChange('sustainabilityGoals', e.target.value)}
            />
          </div>

          <MultiSelectButtons
            label="Technology Requirements"
            description="Select the technology features you want to include."
            options={technologyOptions}
            selectedValues={architectureData.technologyRequirements || []}
            onChange={handleTechnologyChange}
          />

          <div className="space-y-2">
            <Label htmlFor="specialFeatures">Special Architectural Features</Label>
            <Textarea 
              id="specialFeatures" 
              placeholder="Describe any special architectural features you're interested in..."
              value={architectureData.specialFeatures || ''}
              onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspirationNotes">Inspiration Notes</Label>
            <Textarea 
              id="inspirationNotes" 
              placeholder="Describe sources of inspiration or reference projects..."
              value={architectureData.inspirationNotes || ''}
              onChange={(e) => handleInputChange('inspirationNotes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="architectureNotes">Additional Architecture Notes</Label>
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
  );
}
