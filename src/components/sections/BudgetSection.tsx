
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

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
    <div className="space-y-6">
      <SectionHeader 
        title="Budget & Timeline" 
        description="Provide information about your project budget and timeline expectations."
      />
      
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="budgetRange">Budget Range</Label>
            <Input 
              id="budgetRange" 
              placeholder="e.g. $100,000 - $200,000"
              value={budgetData.budgetRange || ''}
              onChange={(e) => handleInputChange('budgetRange', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetFlexibility">Budget Flexibility</Label>
            <Input 
              id="budgetFlexibility" 
              placeholder="e.g. 5%, 10%, etc."
              value={budgetData.budgetFlexibility || ''}
              onChange={(e) => handleInputChange('budgetFlexibility', e.target.value)}
            />
          </div>

          <MultiSelectButtons
            label="Budget Priorities"
            description="Select the areas where you would prioritize spending."
            options={budgetPriorityOptions}
            selectedValues={budgetData.budgetPriorities || []}
            onChange={handleBudgetPrioritiesChange}
          />

          <div className="space-y-2">
            <Label htmlFor="priorityAreas">Priority Areas Details</Label>
            <Textarea 
              id="priorityAreas" 
              placeholder="Describe which areas of your project are the highest priority for your budget..."
              value={budgetData.priorityAreas || ''}
              onChange={(e) => handleInputChange('priorityAreas', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Project Timeframe</Label>
            <Input 
              id="timeframe" 
              placeholder="e.g. 6 months, 1 year, etc."
              value={budgetData.timeframe || ''}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flexibilityNotes">Budget Flexibility Notes</Label>
            <Textarea 
              id="flexibilityNotes" 
              placeholder="Provide details on how flexible your budget is and under what circumstances..."
              value={budgetData.flexibilityNotes || ''}
              onChange={(e) => handleInputChange('flexibilityNotes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetNotes">Additional Budget Notes</Label>
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
  );
}
