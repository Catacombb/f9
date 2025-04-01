
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectButtonsProps {
  label: string;
  description?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  optional?: boolean;
}

export function MultiSelectButtons({
  label,
  description,
  options,
  selectedValues,
  onChange,
  optional = false
}: MultiSelectButtonsProps) {
  // Handle toggle selection
  const handleValueChange = (values: string[]) => {
    onChange(values);
  };

  return (
    <div className="space-y-3">
      <Label className="design-brief-question-title">
        {label}
        {optional && <span className="text-muted-foreground text-sm ml-2">(optional)</span>}
      </Label>
      
      {description && (
        <p className="design-brief-question-description mb-2">
          {description}
        </p>
      )}
      
      <ToggleGroup 
        type="multiple" 
        variant="outline"
        className="flex flex-wrap gap-2"
        value={selectedValues}
        onValueChange={handleValueChange}
      >
        {options.map((option) => (
          <ToggleGroupItem 
            key={option.value} 
            value={option.value}
            className="px-4 py-2 rounded-md border border-input data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
