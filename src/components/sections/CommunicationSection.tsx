
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckboxGroup } from '@/components/CheckboxGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const communicationMethods = [
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Text/SMS', label: 'Text/SMS' },
  { value: 'Video Call', label: 'Video Call' },
  { value: 'In-Person', label: 'In-Person Meeting' },
];

const availableDays = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Weekend', label: 'Weekend' },
];

const bestTimes = [
  { value: 'Morning', label: 'Morning (8-11am)' },
  { value: 'Midday', label: 'Midday (11am-2pm)' },
  { value: 'Afternoon', label: 'Afternoon (2-5pm)' },
  { value: 'Evening', label: 'Evening (after 5pm)' },
];

export function CommunicationSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const communicationData = formData.communication;

  const handlePrevious = () => {
    setCurrentSection('uploads');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('summary');
    window.scrollTo(0, 0);
  };

  const handleMethodsChange = (values: string[]) => {
    updateFormData('communication', { preferredMethods: values });
  };

  const handleDaysChange = (values: string[]) => {
    updateFormData('communication', { availableDays: values });
  };

  const handleTimesChange = (values: string[]) => {
    updateFormData('communication', { bestTimes: values });
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Communication Preferences" 
          description="Help us understand how you'd prefer to communicate throughout the project."
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <CheckboxGroup
              label="Preferred Communication Methods"
              description="How would you like us to communicate with you?"
              options={communicationMethods}
              selectedValues={communicationData.preferredMethods || []}
              onChange={handleMethodsChange}
            />
            
            <CheckboxGroup
              label="Availability"
              description="Which days are best for meetings or calls?"
              options={availableDays}
              selectedValues={communicationData.availableDays || []}
              onChange={handleDaysChange}
            />
            
            <CheckboxGroup
              label="Best Times"
              description="Which times of day work best for you?"
              options={bestTimes}
              selectedValues={communicationData.bestTimes || []}
              onChange={handleTimesChange}
            />
            
            <div className="space-y-2">
              <Label htmlFor="responseTime" className="design-brief-question-title">Expected Response Time</Label>
              <p className="text-sm text-black mb-2">The F9 team is trained to respond to all client questions within 24 hours.</p>
              <Select
                value={communicationData.responseTime || ''}
                onValueChange={(value) => updateFormData('communication', { responseTime: value })}
              >
                <SelectTrigger id="responseTime" className="text-black">
                  <SelectValue placeholder="Select your expectation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                  <SelectItem value="1-2 business days">1-2 business days</SelectItem>
                  <SelectItem value="By the end of the week">By the end of the week</SelectItem>
                  <SelectItem value="No specific timeframe">No specific timeframe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="design-brief-question-title">Additional Communication Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any other communication preferences or details we should know about..."
                value={communicationData.additionalNotes || ''}
                onChange={(e) => updateFormData('communication', { additionalNotes: e.target.value })}
                className="min-h-24"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group text-black">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Previous: Uploads</span>
          </Button>
          
          <Button onClick={handleNext} className="group bg-yellow-500 hover:bg-yellow-600 text-black">
            <span className="font-bold">Next: Summary</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
