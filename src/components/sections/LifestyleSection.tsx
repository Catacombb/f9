
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Users, Cat, Dog } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

// Custom icon for adult (since it's not in lucide-react by default)
const AdultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v14" />
    <path d="M8 16h8" />
  </svg>
);

// Custom icon for child (since it's not in lucide-react by default)
const ChildIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 8v6" />
    <path d="M10 14h4" />
    <path d="M9 22v-6.5" />
    <path d="M15 22v-6.5" />
  </svg>
);

export function LifestyleSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  // States for family members and pets
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [dogs, setDogs] = useState<number>(0);
  const [cats, setCats] = useState<number>(0);
  
  // Initialize values from formData
  useEffect(() => {
    if (formData.lifestyle.occupants) {
      try {
        const occupantsData = JSON.parse(formData.lifestyle.occupants);
        if (occupantsData) {
          setAdults(occupantsData.adults || 0);
          setChildren(occupantsData.children || 0);
          setDogs(occupantsData.dogs || 0);
          setCats(occupantsData.cats || 0);
        }
      } catch (e) {
        // If not valid JSON, initialize with zeros
      }
    }
  }, [formData.lifestyle]);
  
  // Update formData when values change
  useEffect(() => {
    const occupantsData = JSON.stringify({ adults, children, dogs, cats });
    updateFormData('lifestyle', { occupants: occupantsData });
  }, [adults, children, dogs, cats, updateFormData]);
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('lifestyle', { [name]: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('site');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };
  
  // Handle direct number input changes (fixed to prevent glitches)
  const handleNumberInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Lifestyle" 
          description="Your lifestyle shapes how you'll use your home. This information helps us design spaces that support your daily activities and long-term needs."
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Who will be living in this home?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select the number of people and pets who will be living in or regularly using this home.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="mb-2 p-3 rounded-full bg-primary/10 text-primary">
                    <AdultIcon />
                  </div>
                  <Label className="mb-1">Adults</Label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setAdults(Math.max(0, adults - 1))}
                      disabled={adults <= 0}
                      type="button"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      min="0"
                      value={adults} 
                      onChange={handleNumberInputChange(setAdults)}
                      className="w-16 mx-2 text-center"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setAdults(adults + 1)}
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="mb-2 p-3 rounded-full bg-primary/10 text-primary">
                    <ChildIcon />
                  </div>
                  <Label className="mb-1">Children</Label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      type="button"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      min="0" 
                      value={children} 
                      onChange={handleNumberInputChange(setChildren)}
                      className="w-16 mx-2 text-center"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setChildren(children + 1)}
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="mb-2 p-3 rounded-full bg-primary/10 text-primary">
                    <Dog />
                  </div>
                  <Label className="mb-1">Dogs</Label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setDogs(Math.max(0, dogs - 1))}
                      disabled={dogs <= 0}
                      type="button"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      min="0" 
                      value={dogs}
                      onChange={handleNumberInputChange(setDogs)}
                      className="w-16 mx-2 text-center"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setDogs(dogs + 1)}
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="mb-2 p-3 rounded-full bg-primary/10 text-primary">
                    <Cat />
                  </div>
                  <Label className="mb-1">Cats</Label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCats(Math.max(0, cats - 1))}
                      disabled={cats <= 0}
                      type="button"
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      min="0" 
                      value={cats}
                      onChange={handleNumberInputChange(setCats)}
                      className="w-16 mx-2 text-center"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCats(cats + 1)}
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
              onChange={handleTextAreaChange}
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
              onChange={handleTextAreaChange}
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
              onChange={handleTextAreaChange}
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
              onChange={handleTextAreaChange}
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
            <span>Next: Spaces</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
