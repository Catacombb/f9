
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BudgetSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const budgetData = formData.budget;

  const handlePrevious = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('communication');
    window.scrollTo(0, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('budget', { [field]: value });
  };

  const budgetPriorityOptions = [
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Bathrooms', label: 'Bathrooms' },
    { value: 'Living Areas', label: 'Living Areas' },
    { value: 'Bedrooms', label: 'Bedrooms' },
    { value: 'Outdoor Spaces', label: 'Outdoor Spaces' },
    { value: 'Energy Efficiency', label: 'Energy Efficiency' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Finishes', label: 'Finishes' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'Storage', label: 'Storage' },
  ];

  const handleBudgetPrioritiesChange = (values: string[]) => {
    updateFormData('budget', { budgetPriorities: values });
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Budget & Timeline" 
          description="Provide information about your project budget and timeline expectations."
        />
        
        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="design-brief-question-title">Budget Range</Label>
              <Select
                value={budgetData.budgetRange || ''}
                onValueChange={(value) => handleInputChange('budgetRange', value)}
              >
                <SelectTrigger id="budgetRange">
                  <SelectValue placeholder="Select a budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$500k–$750k">$500k–$750k</SelectItem>
                  <SelectItem value="$750k–$1M">$750k–$1M</SelectItem>
                  <SelectItem value="$1M–$1.5M">$1M–$1.5M</SelectItem>
                  <SelectItem value="$1.5M–$2M">$1.5M–$2M</SelectItem>
                  <SelectItem value="$2M–$3M">$2M–$3M</SelectItem>
                  <SelectItem value="$3M+">$3M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <MultiSelectButtons
              label="Budget Priorities"
              description="Select the areas where you would prioritize spending."
              options={budgetPriorityOptions}
              selectedValues={budgetData.budgetPriorities || []}
              onChange={handleBudgetPrioritiesChange}
            />

            <div className="space-y-2">
              <Label htmlFor="priorityAreas" className="design-brief-question-title">Priority Areas Details</Label>
              <Textarea 
                id="priorityAreas" 
                placeholder="Describe which areas of your project are the highest priority for your budget..."
                value={budgetData.priorityAreas || ''}
                onChange={(e) => handleInputChange('priorityAreas', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flexibilityNotes" className="design-brief-question-title">Budget Flexibility Notes</Label>
              <Textarea 
                id="flexibilityNotes" 
                placeholder="Provide details on how flexible your budget is and under what circumstances..."
                value={budgetData.flexibilityNotes || ''}
                onChange={(e) => handleInputChange('flexibilityNotes', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetNotes" className="design-brief-question-title">Additional Budget Notes</Label>
              <Textarea 
                id="budgetNotes" 
                placeholder="Any other budget considerations or financial constraints..."
                value={budgetData.budgetNotes || ''}
                onChange={(e) => handleInputChange('budgetNotes', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Project Team</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Communication</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
