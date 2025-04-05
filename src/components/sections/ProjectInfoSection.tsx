
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Calendar } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { PredictiveAddressFinder } from '@/components/PredictiveAddressFinder';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export function ProjectInfoSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    formData.projectInfo.coordinates || null
  );
  
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(
    formData.projectInfo.moveInDate ? new Date(formData.projectInfo.moveInDate) : undefined
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('projectInfo', { [name]: value });
  };

  const handleAddressChange = (address: string) => {
    updateFormData('projectInfo', { projectAddress: address });
  };

  const handleCoordinatesChange = (coords: [number, number]) => {
    setCoordinates(coords);
    updateFormData('projectInfo', { coordinates: coords });
  };
  
  const handleMoveInPreferenceChange = (value: string) => {
    updateFormData('projectInfo', { moveInPreference: value });
    // Clear the moveInDate if "as soon as possible" is selected
    if (value === 'as_soon_as_possible') {
      setMoveInDate(undefined);
      updateFormData('projectInfo', { moveInDate: undefined });
    }
  };
  
  const handleMoveInDateChange = (date: Date | undefined) => {
    setMoveInDate(date);
    if (date) {
      updateFormData('projectInfo', { 
        moveInDate: date.toISOString(),
        moveInPreference: 'specific_date'
      });
    }
  };
  
  const handleNext = () => {
    setCurrentSection('contractors');
  };
  
  // Calculate completion percentage based on required fields
  const calculateCompletion = () => {
    const requiredFields = ['clientName', 'projectAddress', 'contactEmail', 'contactPhone'];
    let filledCount = 0;
    
    requiredFields.forEach(field => {
      if (formData.projectInfo[field]) filledCount++;
    });
    
    return Math.round((filledCount / requiredFields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Project Information" 
          description="Tell us about yourself and your project. This information helps us understand the basics of what you're looking to achieve."
          progress={completionPercentage}
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="clientName">Your Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Enter your full name"
              value={formData.projectInfo.clientName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="projectAddress">Project Address</Label>
            <div className="mt-1 space-y-4">
              <PredictiveAddressFinder 
                address={formData.projectInfo.projectAddress} 
                onAddressChange={handleAddressChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label className="block mb-2">When would you like to move into your new home?</Label>
            <RadioGroup 
              value={formData.projectInfo.moveInPreference || 'as_soon_as_possible'}
              onValueChange={handleMoveInPreferenceChange}
              className="space-y-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="as_soon_as_possible" id="as_soon_as_possible" />
                <Label htmlFor="as_soon_as_possible">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific_date" id="specific_date" />
                <Label htmlFor="specific_date">On or around a specific date</Label>
              </div>
            </RadioGroup>
            
            {formData.projectInfo.moveInPreference === 'specific_date' && (
              <div className="mt-3 ml-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !moveInDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {moveInDate ? format(moveInDate, "PPP") : <span>Pick a target move-in date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={moveInDate}
                      onSelect={handleMoveInDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="Your email address"
                value={formData.projectInfo.contactEmail}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="Your contact number"
                value={formData.projectInfo.contactPhone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div></div> {/* Empty div for spacing */}
          <Button onClick={handleNext} className="group">
            <span>Next: Project Team</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
