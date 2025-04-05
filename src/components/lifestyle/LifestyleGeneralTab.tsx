
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { animations } from '@/lib/animation';
import { cn } from '@/lib/utils';
import { FormData } from '@/types';

interface LifestyleGeneralTabProps {
  formData: FormData['lifestyle'];
  onFormChange: (name: string, value: string) => void;
}

export function LifestyleGeneralTab({ formData, onFormChange }: LifestyleGeneralTabProps) {
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="space-y-6">
      <div className={cn("transition-all", animations.fadeIn, "delay-100")}>
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
          value={formData.occupationDetails}
          onChange={handleTextAreaChange}
          className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
        />
      </div>
      
      <div className={cn("transition-all", animations.fadeIn, "delay-200")}>
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
          value={formData.dailyRoutine}
          onChange={handleTextAreaChange}
          className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
        />
      </div>
      
      <div className={cn("transition-all", animations.fadeIn, "delay-300")}>
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
          value={formData.entertainmentStyle}
          onChange={handleTextAreaChange}
          className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
        />
      </div>
      
      <div className={cn("transition-all", animations.fadeIn, "delay-400")}>
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
          value={formData.specialRequirements}
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
          value={formData.homeFeeling || ''}
          onChange={handleTextAreaChange}
          className="mt-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow"
        />
      </div>
    </div>
  );
}
