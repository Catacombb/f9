
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function BudgetSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const budgetData = formData.budget;

  const handlePrevious = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('lifestyle');
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

  const budgetCategoryOptions = [
    { value: 'Energy Efficiency', label: 'Energy Efficiency' },
    { value: 'Smart Home Tech', label: 'Smart Home Tech' },
    { value: 'Build Quality', label: 'Build Quality' },
    { value: 'Sustainable Materials', label: 'Sustainable Materials' },
    { value: 'Design Aesthetics', label: 'Design Aesthetics' },
    { value: 'Indoor Air Quality', label: 'Indoor Air Quality' },
    { value: 'Indoor-Outdoor Connection', label: 'Indoor-Outdoor Connection' },
    { value: 'Future-Proofing', label: 'Future-Proofing' },
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
          isBold={true}
        />
        
        <div className="design-brief-form-group">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="design-brief-question-title text-black font-bold">Budget Range</Label>
              <Select
                value={budgetData.budgetRange || ''}
                onValueChange={(value) => handleInputChange('budgetRange', value)}
              >
                <SelectTrigger id="budgetRange" className="text-black">
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
              <p className="text-sm italic text-black mt-1">
                Does your budget include design fees, permitting, and extras like landscaping or solar?
              </p>
            </div>

            <Card className="p-4 border-blueprint-200">
              <div className="space-y-4">
                <Label className="design-brief-question-title text-black font-bold">Budget Categories</Label>
                <p className="text-sm text-black">Select your top priorities for budget allocation:</p>

                <MultiSelectButtons
                  label="Area Priorities"
                  description="Which spaces are most important to invest in?"
                  options={budgetPriorityOptions}
                  selectedValues={budgetData.budgetPriorities || []}
                  onChange={handleBudgetPrioritiesChange}
                />

                <div className="mt-4">
                  <Label className="design-brief-question-title text-black font-bold">Category Priorities</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {budgetCategoryOptions.map(option => {
                      const isSelected = budgetData.budgetPriorities?.includes(option.value);
                      return (
                        <Badge 
                          key={option.value} 
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer py-2 px-3 ${isSelected ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-black hover:bg-yellow-100'}`}
                          onClick={() => {
                            const current = budgetData.budgetPriorities || [];
                            const updated = isSelected 
                              ? current.filter(p => p !== option.value)
                              : [...current, option.value];
                            handleBudgetPrioritiesChange(updated);
                          }}
                        >
                          {option.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="priorityAreas" className="design-brief-question-title text-black font-bold">Priority Areas Details</Label>
              <Textarea 
                id="priorityAreas" 
                placeholder="Describe which areas of your project are the highest priority for your budget..."
                value={budgetData.priorityAreas || ''}
                onChange={(e) => handleInputChange('priorityAreas', e.target.value)}
                className="text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flexibilityNotes" className="design-brief-question-title text-black font-bold">Budget Flexibility Notes</Label>
              <Textarea 
                id="flexibilityNotes" 
                placeholder="Provide details on how flexible your budget is and under what circumstances..."
                value={budgetData.flexibilityNotes || ''}
                onChange={(e) => handleInputChange('flexibilityNotes', e.target.value)}
                className="text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="design-brief-question-title text-black font-bold">Project Timeframe</Label>
              <Select
                value={budgetData.timeframe || ''}
                onValueChange={(value) => handleInputChange('timeframe', value)}
              >
                <SelectTrigger id="timeframe" className="text-black">
                  <SelectValue placeholder="Select your desired timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-6 months">0-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                  <SelectItem value="2+ years">2+ years</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm italic text-black mt-1">
                When would you like to break ground on construction?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetNotes" className="design-brief-question-title text-black font-bold">Additional Budget Notes</Label>
              <Textarea 
                id="budgetNotes" 
                placeholder="Any other budget considerations or financial constraints..."
                value={budgetData.budgetNotes || ''}
                onChange={(e) => handleInputChange('budgetNotes', e.target.value)}
                className="text-black"
              />
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group text-black">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Previous: Project Team</span>
          </Button>
          
          <Button onClick={handleNext} className="group bg-yellow-500 hover:bg-yellow-600 text-black">
            <span className="font-bold">Next: Lifestyle</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
