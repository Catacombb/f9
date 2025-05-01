
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
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Project Information" 
          description="Tell us about yourself and your project. This information helps us understand the basics of what you're looking to achieve."
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="clientName" className="font-bold text-black">Your Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="e.g. John Smith"
              value={formData.projectInfo.clientName}
              onChange={handleChange}
              className="mt-1 text-black"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="projectAddress" className="font-bold text-black">Project Address</Label>
            <div className="mt-1 space-y-4">
              <PredictiveAddressFinder 
                address={formData.projectInfo.projectAddress} 
                onAddressChange={handleAddressChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label className="block mb-2 font-bold text-black">When would you like to move into your new home?</Label>
            <RadioGroup 
              value={formData.projectInfo.moveInPreference || 'as_soon_as_possible'}
              onValueChange={handleMoveInPreferenceChange}
              className="space-y-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="as_soon_as_possible" id="as_soon_as_possible" />
                <Label htmlFor="as_soon_as_possible" className="text-black">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific_date" id="specific_date" />
                <Label htmlFor="specific_date" className="text-black">On or around a specific date</Label>
              </div>
            </RadioGroup>
            
            {formData.projectInfo.moveInPreference === 'specific_date' && (
              <div className="mt-3 ml-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-black",
                        !moveInDate && "text-black/70"
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
              <Label htmlFor="contactEmail" className="font-bold text-black">Email Address</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="e.g. yourname@example.com"
                value={formData.projectInfo.contactEmail}
                onChange={handleChange}
                className="mt-1 text-black"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone" className="font-bold text-black">Phone Number</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="e.g. (303) 555-1234"
                value={formData.projectInfo.contactPhone}
                onChange={handleChange}
                className="mt-1 text-black"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div></div> {/* Empty div for spacing */}
          <Button 
            onClick={handleNext} 
            className="group bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-300 hover:scale-105"
          >
            <span className="font-bold">Next: Project Team</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
