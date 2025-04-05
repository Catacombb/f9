import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    { value: 'night', label: 'Night (8pm+)' }
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
            <RadioGroup
              value={formData.communication.frequency}
              onValueChange={(value) => handleSelectChange('frequency', value)}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="frequency_daily" />
                <Label htmlFor="frequency_daily" className="font-normal">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="frequency_weekly" />
                <Label htmlFor="frequency_weekly" className="font-normal">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="frequency_biweekly" />
                <Label htmlFor="frequency_biweekly" className="font-normal">Every Two Weeks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="frequency_monthly" />
                <Label htmlFor="frequency_monthly" className="font-normal">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="milestones" id="frequency_milestones" />
                <Label htmlFor="frequency_milestones" className="font-normal">Only at Key Milestones</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <Label htmlFor="urgentContact" className="design-brief-question-title">
              How to Contact for Urgent Matters
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="urgentContact"
              name="urgentContact"
              placeholder="For urgent matters, please contact me via..."
              value={formData.communication.urgentContact}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="responseTime" className="design-brief-question-title">
              Expected Response Time
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <p className="design-brief-question-description">
              How quickly would you like to receive responses to your questions or inquiries?
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
