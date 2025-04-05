import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';
import { animations, useReducedMotion } from '@/lib/animation';

export function ArchitectureSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const prefersReducedMotion = useReducedMotion();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData('architecture', { [name]: value });
  };

  const handlePrevious = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  const animationClasses = !prefersReducedMotion ? {
    section: "transition-all duration-300 ease-in-out",
    button: "transition-all duration-200 active:scale-95",
  } : {};
  
  return (
    <div className={cn("design-brief-section-wrapper", animationClasses.section)}>
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Architectural Preferences" 
          description="Share your design preferences to help us understand your aesthetic vision."
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="stylePrefences" className="design-brief-question-title">
              Preferred Architectural Style
            </Label>
            <p className="design-brief-question-description">
              Describe your preferred architectural style.
            </p>
            <Textarea
              id="stylePrefences"
              name="stylePrefences"
              placeholder="Modern, Traditional, Minimalist, etc..."
              value={formData.architecture.stylePrefences}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="externalMaterials" className="design-brief-question-title">
              External Materials
            </Label>
            <p className="design-brief-question-description">
              What external materials do you prefer for the building's facade?
            </p>
            <Textarea
              id="externalMaterials"
              name="externalMaterials"
              placeholder="Brick, Wood, Stone, Stucco, etc..."
              value={formData.architecture.externalMaterials}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="internalFinishes" className="design-brief-question-title">
              Internal Finishes
            </Label>
            <p className="design-brief-question-description">
              What internal finishes do you prefer for the walls, floors, and ceilings?
            </p>
            <Textarea
              id="internalFinishes"
              name="internalFinishes"
              placeholder="Hardwood, Tile, Carpet, Paint, etc..."
              value={formData.architecture.internalFinishes}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="sustainabilityGoals" className="design-brief-question-title">
              Sustainability Goals
            </Label>
            <p className="design-brief-question-description">
              What sustainability goals do you have for the project?
            </p>
            <Textarea
              id="sustainabilityGoals"
              name="sustainabilityGoals"
              placeholder="Energy efficiency, Water conservation, etc..."
              value={formData.architecture.sustainabilityGoals}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="specialFeatures" className="design-brief-question-title">
              Special Architectural Features
            </Label>
            <p className="design-brief-question-description">
              Are there any special architectural features you would like to include?
            </p>
            <Textarea
              id="specialFeatures"
              name="specialFeatures"
              placeholder="Skylights, Balconies, Green roof, etc..."
              value={formData.architecture.specialFeatures}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Inspiration Links */}
          <div className="mb-6">
            <Label htmlFor="inspirationLinks" className="design-brief-question-title">
              Link to projects or homes you like
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Share links to projects, homes, or designs that inspire you.
            </p>
            <Input
              id="inspirationLinks"
              name="inspirationLinks"
              placeholder="https://example.com/inspirational-project"
              value={formData.architecture.inspirationLinks || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {/* Inspiration Comments */}
          <div className="mb-6">
            <Label htmlFor="inspirationComments" className="design-brief-question-title">
              What do you like about these projects?
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Tell us what aspects of the shared projects appeal to you most.
            </p>
            <Textarea
              id="inspirationComments"
              name="inspirationComments"
              placeholder="I like the open floor plan, natural light, etc..."
              value={formData.architecture.inspirationComments || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="inspirationNotes" className="design-brief-question-title">
              Additional Inspiration Notes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="inspirationNotes"
              name="inspirationNotes"
              placeholder="Any other important information about your architectural preferences..."
              value={formData.architecture.inspirationNotes}
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
            <span>Previous: Spaces</span>
          </Button>

          <Button 
            onClick={handleNext} 
            className={cn("group", animationClasses.button)}
          >
            <span>Next: Contractors</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
