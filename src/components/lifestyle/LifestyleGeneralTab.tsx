
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AIHelper } from '@/components/AIHelper';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

interface LifestyleGeneralTabProps {
  dailyRoutine: string;
  entertainingStyle: string;
  workFromHome: string;
  homeFeeling: string;
  specialRequirements: string;
  hobbies: string[];
  onInputChange: (field: string, value: string) => void;
  onHobbiesChange: (values: string[]) => void;
}

export const LifestyleGeneralTab = ({
  dailyRoutine,
  entertainingStyle,
  workFromHome,
  homeFeeling,
  specialRequirements,
  hobbies,
  onInputChange,
  onHobbiesChange
}: LifestyleGeneralTabProps) => {
  
  // Generate AI insights for lifestyle content
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  useEffect(() => {
    // Simple analysis of lifestyle content to provide suggestions
    if (dailyRoutine.includes('morning') && dailyRoutine.includes('coffee') && !hobbies.includes('Coffee Enthusiast')) {
      setAiSuggestion('Looks like coffee is an important part of your morning routine. Consider adding "Coffee Enthusiast" to your hobbies?');
    } else if (entertainingStyle.includes('outdoor') && !hobbies.includes('Outdoor Entertaining')) {
      setAiSuggestion('You mentioned enjoying outdoor entertaining. Would you like to add "Outdoor Entertaining" to your hobbies?');
    } else if (specialRequirements.includes('music') && !hobbies.includes('Music')) {
      setAiSuggestion('Music seems important to you. Consider adding "Music" to your hobbies?');
    } else {
      setAiSuggestion(null);
    }
  }, [dailyRoutine, entertainingStyle, specialRequirements, hobbies]);
  
  // Add AI-suggested hobby
  const addSuggestedHobby = () => {
    if (aiSuggestion?.includes("Coffee Enthusiast")) {
      onHobbiesChange([...hobbies, 'Coffee Enthusiast']);
    } else if (aiSuggestion?.includes("Outdoor Entertaining")) {
      onHobbiesChange([...hobbies, 'Outdoor Entertaining']);
    } else if (aiSuggestion?.includes("Music")) {
      onHobbiesChange([...hobbies, 'Music']);
    }
  };
  
  const hobbyOptions = [
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Gardening', label: 'Gardening' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Entertaining', label: 'Entertaining' },
    { value: 'Outdoor Activities', label: 'Outdoor Activities' },
    { value: 'Work from Home', label: 'Work from Home' },
    { value: 'Meditation', label: 'Meditation' },
    { value: 'Yoga', label: 'Yoga' },
    { value: 'Coffee Enthusiast', label: 'Coffee Enthusiast' },
    { value: 'Wine Enthusiast', label: 'Wine Enthusiast' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Crafting', label: 'Crafting' },
    { value: 'Outdoor Entertaining', label: 'Outdoor Entertaining' },
  ];

  return (
    <Card className="border-blueprint-200">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dailyRoutine" className="text-black font-bold">Daily Routine</Label>
            <Textarea 
              id="dailyRoutine"
              value={dailyRoutine}
              onChange={(e) => onInputChange('dailyRoutine', e.target.value)}
              placeholder="e.g., Busy mornings getting kids ready for school, work from home during the day, family dinner and relaxation in the evenings"
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entertainingStyle" className="text-black font-bold">Entertaining Style</Label>
            <Textarea 
              id="entertainingStyle"
              value={entertainingStyle}
              onChange={(e) => onInputChange('entertainingStyle', e.target.value)}
              placeholder="e.g., We host family dinners weekly for 10-12 people, occasional larger gatherings 3-4 times per year"
              className="text-black"
            />
            {entertainingStyle && (
              <AIHelper 
                text="Consider mentioning if you prefer indoor formal dining, casual outdoor gatherings, or a mix of both - this helps us design appropriate spaces."
                fieldContent={entertainingStyle}
                type="insight"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workFromHome" className="text-black font-bold">Work From Home</Label>
            <Textarea 
              id="workFromHome"
              value={workFromHome}
              onChange={(e) => onInputChange('workFromHome', e.target.value)}
              placeholder="e.g., Full-time remote work requiring a dedicated office with good natural light and sound isolation"
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeFeeling" className="text-black font-bold">Desired Home Feeling</Label>
            <Textarea 
              id="homeFeeling"
              value={homeFeeling}
              onChange={(e) => onInputChange('homeFeeling', e.target.value)}
              placeholder="e.g., We want our home to feel warm and cozy but with clean modern lines - a sanctuary from busy work lives"
              className="text-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements" className="text-black font-bold">Special Requirements</Label>
            <Textarea 
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => onInputChange('specialRequirements', e.target.value)}
              placeholder="e.g., Need wheelchair-accessible doorways, aging-in-place considerations, space for a grand piano"
              className="text-black"
            />
            {aiSuggestion && (
              <AIHelper 
                text={aiSuggestion} 
                fieldContent={specialRequirements} 
                onApply={addSuggestedHobby}
              />
            )}
          </div>

          <MultiSelectButtons
            label="Hobbies & Interests"
            description="Select hobbies that will influence your home design:"
            options={hobbyOptions}
            selectedValues={hobbies}
            onChange={onHobbiesChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
