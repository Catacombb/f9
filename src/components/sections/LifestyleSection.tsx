
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { LifestyleOccupantsSection } from '../lifestyle/LifestyleOccupantsSection';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animation';
import { Toaster } from '@/components/ui/toaster';

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  
  // Handle occupants data
  const handleOccupantsChange = (occupantsData: string) => {
    updateFormData('lifestyle', { occupants: occupantsData });
  };
  
  // Handle occupant entries change
  const handleOccupantEntriesChange = (entries: any[]) => {
    updateFormData('lifestyle', { occupantEntries: entries });
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Lifestyle" 
          description="Your lifestyle shapes how you'll use your home. This information helps us design spaces that support your daily activities and long-term needs."
          isBold={true}
        />
        
        <div className="design-brief-form-group space-y-6">
          {/* Occupants Section */}
          <LifestyleOccupantsSection 
            occupants={formData.lifestyle.occupants || ''}
            onOccupantsChange={handleOccupantsChange}
            occupantEntries={formData.lifestyle.occupantEntries || []}
            onOccupantEntriesChange={handleOccupantEntriesChange}
          />
          
          <div className={cn("mb-6 transition-all", animations.fadeIn, "delay-100")}>
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
              onChange={handleTextAreaChange}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
            />
          </div>
          
          <div className={cn("mb-6 transition-all", animations.fadeIn, "delay-200")}>
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
              onChange={handleTextAreaChange}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
            />
          </div>
          
          <div className={cn("mb-6 transition-all", animations.fadeIn, "delay-300")}>
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
              onChange={handleTextAreaChange}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
            />
          </div>
          
          <div className={cn("mb-6 transition-all", animations.fadeIn, "delay-400")}>
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
              onChange={handleTextAreaChange}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
            />
          </div>
          
          <div className={cn("transition-all", animations.fadeIn, "delay-500")}>
            <Label htmlFor="homeFeeling" className="design-brief-question-title">
              How do you want to feel when you come home?
            </Label>
            <p className="design-brief-question-description">
              Describe the emotions, sensations, or feelings you want your home to evoke when you enter it.
            </p>
            <Textarea
              id="homeFeeling"
              name="homeFeeling"
              placeholder="e.g., I want to feel calm and relaxed, with a sense of warmth and security..."
              value={formData.lifestyle.homeFeeling || ''}
              onChange={handleTextAreaChange}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            className="group transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Budget</span>
          </Button>
          
          <Button 
            onClick={handleNext} 
            className="group transition-all duration-200"
          >
            <span>Next: Site</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
