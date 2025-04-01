
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function BudgetSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('budget', { [name]: value });
  };
  
  const handleBudgetChange = (value: string) => {
    updateFormData('budget', { budgetRange: value });
  };
  
  const handlePrevious = () => {
    setCurrentSection('projectInfo');
  };
  
  const handleNext = () => {
    setCurrentSection('lifestyle');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Budget Information</h1>
        <p className="design-brief-section-description">
          Understanding your budget helps us tailor solutions that meet your financial parameters while achieving your design goals.
        </p>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label>What is your approximate budget range for this project?</Label>
            <RadioGroup 
              value={formData.budget.budgetRange} 
              onValueChange={handleBudgetChange}
              className="mt-3 space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under_100k" id="under_100k" />
                <Label htmlFor="under_100k" className="font-normal">Under $100,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100k_250k" id="100k_250k" />
                <Label htmlFor="100k_250k" className="font-normal">$100,000 - $250,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="250k_500k" id="250k_500k" />
                <Label htmlFor="250k_500k" className="font-normal">$250,000 - $500,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="500k_1m" id="500k_1m" />
                <Label htmlFor="500k_1m" className="font-normal">$500,000 - $1,000,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="above_1m" id="above_1m" />
                <Label htmlFor="above_1m" className="font-normal">Above $1,000,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tbd" id="tbd" />
                <Label htmlFor="tbd" className="font-normal">To be determined</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="flexibilityNotes">
              Budget Flexibility Notes
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="flexibilityNotes"
              name="flexibilityNotes"
              placeholder="Are there areas where you're willing to be flexible with the budget? Any specific constraints?"
              value={formData.budget.flexibilityNotes}
              onChange={handleTextChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="priorityAreas">
              Priority Areas for Budget Allocation
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="priorityAreas"
              name="priorityAreas"
              placeholder="Are there specific areas of the project where you'd prefer to allocate more budget? (e.g., kitchen, master suite, sustainable features)"
              value={formData.budget.priorityAreas}
              onChange={handleTextChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="timeframe">
              Project Timeframe
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
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
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Project Info</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Lifestyle</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
