
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('lifestyle', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('budget');
  };
  
  const handleNext = () => {
    setCurrentSection('site');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Lifestyle</h1>
        <p className="design-brief-section-description">
          Your lifestyle shapes how you'll use your home. This information helps us design spaces that support your daily activities and long-term needs.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="occupants" className="design-brief-question-title">
              Who will be living in this home?
            </Label>
            <p className="design-brief-question-description">
              Include details about family members, pets, and any regular visitors or staff.
            </p>
            <Textarea
              id="occupants"
              name="occupants"
              placeholder="Describe who will be living in or regularly using this home..."
              value={formData.lifestyle.occupants}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="occupationDetails" className="design-brief-question-title">
              Occupations and Work Needs
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Do you work from home? Need a home office? Have specific work-related requirements?
            </p>
            <Textarea
              id="occupationDetails"
              name="occupationDetails"
              placeholder="Describe your work situation and any home workspace needs..."
              value={formData.lifestyle.occupationDetails}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="dailyRoutine" className="design-brief-question-title">
              Daily Routines
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Describe your typical day and how you use different spaces throughout the day.
            </p>
            <Textarea
              id="dailyRoutine"
              name="dailyRoutine"
              placeholder="Outline how you typically move through your day at home..."
              value={formData.lifestyle.dailyRoutine}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="entertainmentStyle" className="design-brief-question-title">
              Entertainment and Social Activities
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              How do you entertain? Frequent dinner parties? Outdoor gatherings? Movie nights?
            </p>
            <Textarea
              id="entertainmentStyle"
              name="entertainmentStyle"
              placeholder="Describe how you like to entertain guests and use social spaces..."
              value={formData.lifestyle.entertainmentStyle}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="specialRequirements" className="design-brief-question-title">
              Special Requirements
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              Any accessibility needs, future planning considerations, or specific lifestyle requirements?
            </p>
            <Textarea
              id="specialRequirements"
              name="specialRequirements"
              placeholder="Note any special needs or future considerations for your home..."
              value={formData.lifestyle.specialRequirements}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Budget</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Site</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
