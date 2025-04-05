import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';
import { animations, useReducedMotion } from '@/lib/animation';

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const prefersReducedMotion = useReducedMotion();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('lifestyle', { [name]: value });
  };

  const handlePrevious = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('site');
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
          title="Lifestyle Information" 
          description="Tell us about your lifestyle and how it will influence your home design."
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="occupants" className="design-brief-question-title">
              Who will be living in this home?
            </Label>
            <p className="design-brief-question-description">
              Please specify the number of adults, children, and any other occupants.
            </p>
            <Textarea
              id="occupants"
              name="occupants"
              placeholder="2 adults, 1 child, and a grandparent"
              value={formData.lifestyle.occupants}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="occupationDetails" className="design-brief-question-title">
              Occupations
            </Label>
            <p className="design-brief-question-description">
              What are the primary occupations or daily activities of the occupants?
            </p>
            <Textarea
              id="occupationDetails"
              name="occupationDetails"
              placeholder="Software Engineer, Teacher, Student"
              value={formData.lifestyle.occupationDetails}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="dailyRoutine" className="design-brief-question-title">
              Daily Routine
            </Label>
            <p className="design-brief-question-description">
              Describe a typical day in your household.
            </p>
            <Textarea
              id="dailyRoutine"
              name="dailyRoutine"
              placeholder="Wake up early, work/school, evening family time, etc."
              value={formData.lifestyle.dailyRoutine}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="entertainmentStyle" className="design-brief-question-title">
              Entertainment Style
            </Label>
            <p className="design-brief-question-description">
              How do you typically entertain guests? Formal dinners, casual get-togethers, etc.?
            </p>
            <Textarea
              id="entertainmentStyle"
              name="entertainmentStyle"
              placeholder="Casual backyard BBQs, formal dinner parties, etc."
              value={formData.lifestyle.entertainmentStyle}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="specialRequirements" className="design-brief-question-title">
              Special Requirements
            </Label>
            <p className="design-brief-question-description">
              Any specific needs or requirements for the home? Accessibility, allergies, etc.?
            </p>
            <Textarea
              id="specialRequirements"
              name="specialRequirements"
              placeholder="Wheelchair access, hypoallergenic materials, etc."
              value={formData.lifestyle.specialRequirements}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {/* Add homeFeeling field at the end */}
          <div className="mb-6">
            <Label htmlFor="homeFeeling" className="design-brief-question-title">
              How do you want to feel when you come home?
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="homeFeeling"
              name="homeFeeling"
              placeholder="Describe the feelings you want to experience in your home..."
              value={formData.lifestyle.homeFeeling || ''}
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
            <span>Previous: Budget</span>
          </Button>

          <Button 
            onClick={handleNext} 
            className={cn("group", animationClasses.button)}
          >
            <span>Next: Site</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
