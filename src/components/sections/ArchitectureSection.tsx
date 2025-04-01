
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function ArchitectureSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('architecture', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('site');
  };
  
  const handleNext = () => {
    setCurrentSection('inspiration');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Architectural Preferences</h1>
        <p className="design-brief-section-description">
          Share your design preferences to help us create a home that reflects your taste and meets your functional needs.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="stylePrefences" className="design-brief-question-title">
              Architectural Style Preferences
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What architectural styles appeal to you? Contemporary, traditional, minimalist, industrial, etc.?
            </p>
            <Textarea
              id="stylePrefences"
              name="stylePrefences"
              placeholder="Describe your preferred architectural styles and aesthetics..."
              value={formData.architecture.stylePrefences}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="externalMaterials" className="design-brief-question-title">
              External Materials
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Do you have preferences for exterior materials? (brick, timber, concrete, metal, etc.)
            </p>
            <Textarea
              id="externalMaterials"
              name="externalMaterials"
              placeholder="Describe your preferences for exterior materials and finishes..."
              value={formData.architecture.externalMaterials}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="internalFinishes" className="design-brief-question-title">
              Internal Finishes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What internal finishes, materials, or color palettes do you prefer?
            </p>
            <Textarea
              id="internalFinishes"
              name="internalFinishes"
              placeholder="Describe your preferences for interior finishes, materials, and colors..."
              value={formData.architecture.internalFinishes}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="sustainabilityGoals" className="design-brief-question-title">
              Sustainability Goals
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              What sustainability features or initiatives are important to you?
            </p>
            <Textarea
              id="sustainabilityGoals"
              name="sustainabilityGoals"
              placeholder="Describe your sustainability priorities and goals for this project..."
              value={formData.architecture.sustainabilityGoals}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="specialFeatures" className="design-brief-question-title">
              Special Architectural Features
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Are there specific architectural elements or features you'd like to incorporate?
            </p>
            <Textarea
              id="specialFeatures"
              name="specialFeatures"
              placeholder="Describe any special architectural features you'd like to include..."
              value={formData.architecture.specialFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Site</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Inspiration</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
