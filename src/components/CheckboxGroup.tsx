
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  description?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function CheckboxGroup({ 
  label, 
  description, 
  options, 
  selectedValues = [], 
  onChange 
}: CheckboxGroupProps) {
  
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(item => item !== value));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="design-brief-question-title">{label}</h3>
        {description && <p className="design-brief-question-description">{description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`checkbox-${option.value}`} 
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, checked === true)} 
            />
            <Label 
              htmlFor={`checkbox-${option.value}`} 
              className="text-sm font-normal text-gray-700"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
