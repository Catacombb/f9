
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { PredictiveAddressFinder } from '@/components/PredictiveAddressFinder';

export function ProjectInfoSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    formData.projectInfo.coordinates || null
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
            <Label htmlFor="timeframe">Project Timeframe</Label>
            <Select 
              value={formData.budget.timeframe} 
              onValueChange={(value) => updateFormData('budget', { timeframe: value })}
            >
              <SelectTrigger id="timeframe" className="mt-1">
                <SelectValue placeholder="Select your preferred timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible / No specific timeline</SelectItem>
                <SelectItem value="under_6months">Less than 6 months</SelectItem>
                <SelectItem value="6months_1year">6 months to 1 year</SelectItem>
                <SelectItem value="1year_2years">1-2 years</SelectItem>
                <SelectItem value="over_2years">More than 2 years</SelectItem>
              </SelectContent>
            </Select>
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
