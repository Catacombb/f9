
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

export function CommunicationSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('communication', { [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData('communication', { [name]: value });
  };

  const handleContactMethodsChange = (values: string[]) => {
    updateFormData('communication', { 'preferredMethods': values });
  };

  const handleBestTimesChange = (values: string[]) => {
    updateFormData('communication', { 'bestTimes': values });
  };

  const handleAvailableDaysChange = (values: string[]) => {
    updateFormData('communication', { 'availableDays': values });
  };
  
  const handleFrequencyChange = (values: string[]) => {
    if (values.length > 0) {
      updateFormData('communication', { 'frequency': values[0] });
    }
  };

  const handlePrevious = () => {
    setCurrentSection('uploads');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('summary');
    window.scrollTo(0, 0);
  };

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'text', label: 'Text Message' },
    { value: 'video', label: 'Video Call' },
    { value: 'in_person', label: 'In-Person Meeting' }
  ];

  const timeOptions = [
    { value: 'early_morning', label: 'Early Morning (6-9am)' },
    { value: 'morning', label: 'Morning (9am-12pm)' },
    { value: 'afternoon', label: 'Afternoon (12-5pm)' },
    { value: 'evening', label: 'Evening (5-8pm)' },
    { value: 'night', label: 'Night (8pm+)' },
    { value: 'anytime', label: 'Anytime' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];
  
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every Two Weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'milestones', label: 'Only at Key Milestones' }
  ];

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Communication Preferences"
          description="Help us understand how you prefer to communicate during the design process."
        />

        <div className="design-brief-form-group">
          <div className="mb-6">
            <MultiSelectButtons
              label="Preferred Methods of Communication"
              description="How would you prefer we contact you for day-to-day updates and questions? Select all that apply."
              options={contactMethodOptions}
              selectedValues={formData.communication.preferredMethods || []}
              onChange={handleContactMethodsChange}
            />
          </div>

          <div className="mb-6">
            <MultiSelectButtons
              label="Best Times to Contact You"
              description="When are the best times for us to reach you? Select all that apply."
              options={timeOptions}
              selectedValues={formData.communication.bestTimes || []}
              onChange={handleBestTimesChange}
            />
          </div>

          <div className="mb-6">
            <MultiSelectButtons
              label="Available Days"
              description="Which days of the week are you typically available? Select all that apply."
              options={dayOptions}
              selectedValues={formData.communication.availableDays || []}
              onChange={handleAvailableDaysChange}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="frequency" className="design-brief-question-title">
              Communication Frequency
            </Label>
            <p className="design-brief-question-description">
              How often would you like to receive project updates?
            </p>
            <MultiSelectButtons
              options={frequencyOptions}
              selectedValues={formData.communication.frequency ? [formData.communication.frequency] : []}
              onChange={handleFrequencyChange}
              singleSelect={true}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="responseTime" className="design-brief-question-title">
              Expected Response Time
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              The F9 team is trained to respond to all client questions within 24 hours.
            </p>
            <Select
              value={formData.communication.responseTime}
              onValueChange={(value) => handleSelectChange('responseTime', value)}
            >
              <SelectTrigger id="responseTime" className="mt-1">
                <SelectValue placeholder="Select expected response time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same_day">Same Day</SelectItem>
                <SelectItem value="24_hours">Within 24 Hours</SelectItem>
                <SelectItem value="48_hours">Within 48 Hours</SelectItem>
                <SelectItem value="week">Within a Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="additionalNotes" className="design-brief-question-title">
              Additional Communication Notes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any additional notes about communication..."
              value={formData.communication.additionalNotes}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Uploads</span>
          </Button>

          <Button onClick={handleNext} className="group">
            <span>Next: Summary</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
