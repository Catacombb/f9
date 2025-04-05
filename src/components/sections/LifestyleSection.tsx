
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Plus, Trash } from 'lucide-react';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { SectionHeader } from './SectionHeader';

// Options for lifestyle selections
const hobbiesOptions = [
  'Reading', 'Cooking', 'Gardening', 'Crafts', 'Music', 'Art', 'Woodworking', 
  'Electronics', 'Gaming', 'Sports', 'Exercise', 'Yoga/Meditation', 'Entertaining', 
  'Collecting', 'Photography', 'Writing'
];

const entertainingOptions = [
  'Frequent dinner parties', 'Casual gatherings', 'Large celebrations', 
  'Outdoor entertaining', 'Professional events', 'Family gatherings',
  'Minimal entertaining'
];

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    formData.lifestyle.hobbies || []
  );
  const [entertainingStyle, setEntertainingStyle] = useState<string[]>(
    formData.lifestyle.entertaining ? [formData.lifestyle.entertaining] : []
  );
  const [wfhOptions, setWfhOptions] = useState<string[]>(
    formData.lifestyle.workFromHome ? [formData.lifestyle.workFromHome] : []
  );
  
  // Handle hobbies selection
  const handleHobbiesChange = (hobbies: string[]) => {
    setSelectedHobbies(hobbies);
    updateFormData('lifestyle', { hobbies });
  };
  
  // Handle entertaining style selection
  const handleEntertainingChange = (style: string[]) => {
    const entertainingValue = style.length > 0 ? style[0] : '';
    setEntertainingStyle(style);
    updateFormData('lifestyle', { entertaining: entertainingValue });
  };
  
  // Handle WFH selection
  const handleWorkFromHomeChange = (options: string[]) => {
    const wfhValue = options.length > 0 ? options[0] : '';
    setWfhOptions(options);
    updateFormData('lifestyle', { workFromHome: wfhValue });
  };
  
  // Handle text input changes
  const handleOccupantsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('lifestyle', { occupants: e.target.value });
  };
  
  const handleSpecialNeedsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('lifestyle', { specialNeeds: e.target.value });
  };
  
  // Navigation handlers
  const handlePrevious = () => {
    setCurrentSection('budget');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    // Fixed navigation flow to go to 'site' instead of 'spaces'
    setCurrentSection('site');
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Lifestyle & Living Patterns" 
          description="Tell us about your lifestyle and how it will influence your living spaces."
          isBold={true}
        />
        
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6 pb-8">
              <div className="space-y-8">
                <div>
                  <Label htmlFor="occupants" className="text-base font-medium">Who will be living in the home?</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    Please provide details about the occupants including adults, children, and pets.
                  </div>
                  <Textarea
                    id="occupants"
                    placeholder="e.g. 2 adults, 3 children (ages 8, 12, 15), 1 dog, 2 cats"
                    value={formData.lifestyle.occupants || ''}
                    onChange={handleOccupantsChange}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="specialNeeds" className="text-base font-medium">Are there any special needs or requirements?</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    Accessibility requirements, elderly care, etc.
                  </div>
                  <Textarea
                    id="specialNeeds"
                    placeholder="e.g. Wheelchair access required, elderly parent visits frequently, etc."
                    value={formData.lifestyle.specialNeeds || ''}
                    onChange={handleSpecialNeedsChange}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label className="text-base font-medium">Hobbies and Interests</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    Select hobbies that might influence your home design.
                  </div>
                  <MultiSelectButtons
                    options={hobbiesOptions}
                    selected={selectedHobbies}
                    onChange={handleHobbiesChange}
                    allowMultiple={true}
                  />
                </div>
                
                <div>
                  <Label className="text-base font-medium">Entertaining</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    How do you entertain guests in your home?
                  </div>
                  <MultiSelectButtons
                    options={entertainingOptions}
                    selected={entertainingStyle}
                    onChange={handleEntertainingChange}
                    allowMultiple={false}
                  />
                </div>
                
                <div>
                  <Label className="text-base font-medium">Work from Home</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    Do you or others in the household work from home?
                  </div>
                  <MultiSelectButtons
                    options={['Yes, full-time', 'Yes, part-time', 'No', 'Occasionally']}
                    selected={wfhOptions}
                    onChange={handleWorkFromHomeChange}
                    allowMultiple={false}
                  />
                </div>
                
                <div>
                  <Label htmlFor="lifestyleNotes" className="text-base font-medium">Additional Lifestyle Notes</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    Any other lifestyle factors that should influence your home design?
                  </div>
                  <Textarea
                    id="lifestyleNotes"
                    placeholder="e.g. We love to cook and entertain outdoors, need ample bookshelves for our collection, etc."
                    value={formData.lifestyle.lifestyleNotes || ''}
                    onChange={(e) => updateFormData('lifestyle', { lifestyleNotes: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between">
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
