
import React, { useState, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictiveAddressFinder } from '@/components/PredictiveAddressFinder';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export function ProjectInfoSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const projectInfoData = formData.projectInfo;

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
  
  const handleInputChange = (field: string, value: string) => {
    updateFormData('projectInfo', { [field]: value });
  };

  const handleNext = () => {
    // Form validation
    if (!projectInfoData.clientName || !projectInfoData.projectAddress || 
        !projectInfoData.contactEmail || !projectInfoData.contactPhone || 
        !projectInfoData.projectType) {
      toast.error("Please fill out all required fields marked with *");
      return;
    }
    
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Project Information" 
          description="Tell us about your project and its key details."
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="design-brief-question-title text-black font-bold">Client Name(s) *</Label>
              <Input 
                id="clientName" 
                value={projectInfoData.clientName || ''} 
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="text-black"
                placeholder="e.g., John and Mary Smith, Smith Family Trust"
              />
              <p className="text-sm italic text-black mt-1">
                You can enter multiple names for joint projects (e.g., couples, business partners, family members)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectAddress" className="design-brief-question-title text-black font-bold">Project Address *</Label>
              <PredictiveAddressFinder
                value={projectInfoData.projectAddress || ''}
                onChange={handleAddressChange}
                onCoordinatesSelect={handleCoordinatesChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="design-brief-question-title text-black font-bold">Contact Email *</Label>
              <Input 
                id="contactEmail" 
                type="email"
                value={projectInfoData.contactEmail || ''} 
                onChange={(e) => handleInputChange('contactEmail', e.target.value)} 
                className="text-black"
                placeholder="e.g., john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="design-brief-question-title text-black font-bold">Contact Phone *</Label>
              <Input 
                id="contactPhone" 
                type="tel"
                value={projectInfoData.contactPhone || ''} 
                onChange={(e) => handleInputChange('contactPhone', e.target.value)} 
                className="text-black"
                placeholder="e.g., (303) 555-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType" className="design-brief-question-title text-black font-bold">Project Type *</Label>
              <Select 
                value={projectInfoData.projectType || ''} 
                onValueChange={(value) => handleInputChange('projectType', value)}
              >
                <SelectTrigger id="projectType" className="text-black">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_build">New Build</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="addition">Addition</SelectItem>
                  <SelectItem value="mixed">Mixed (New + Renovation)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="design-brief-question-title text-black font-bold">Project Description</Label>
              <Textarea 
                id="projectDescription" 
                value={projectInfoData.projectDescription || ''} 
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                className="text-black" 
                placeholder="e.g., We're looking to build a modern mountain home with 4 bedrooms and an open-concept floor plan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInPreference" className="design-brief-question-title text-black font-bold">Move-In Preference</Label>
              <Select 
                value={projectInfoData.moveInPreference || ''} 
                onValueChange={(value) => handleInputChange('moveInPreference', value)}
              >
                <SelectTrigger id="moveInPreference" className="text-black">
                  <SelectValue placeholder="Select move-in preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As soon as possible</SelectItem>
                  <SelectItem value="flexible">Flexible timeline</SelectItem>
                  <SelectItem value="specific_date">Specific date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {projectInfoData.moveInPreference === 'specific_date' && (
              <div className="space-y-2">
                <Label htmlFor="moveInDate" className="design-brief-question-title text-black font-bold">Target Move-In Date</Label>
                <Input 
                  id="moveInDate" 
                  type="date"
                  value={projectInfoData.moveInDate || ''} 
                  onChange={(e) => handleInputChange('moveInDate', e.target.value)} 
                  className="text-black"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleNext} className="group bg-yellow-500 text-black hover:bg-yellow-600">
            <span className="font-bold">Next: Project Team</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
