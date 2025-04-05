
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectButtonsProps {
  label?: string;
  description?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  singleSelect?: boolean;
}

export function MultiSelectButtons({
  label,
  description,
  options,
  selectedValues,
  onChange,
  singleSelect = false
}: MultiSelectButtonsProps) {
  const handleSelect = (value: string) => {
    if (singleSelect) {
      // For radio-button like behavior (single select only)
      onChange([value]);
    } else {
      // For multi-select behavior
      const newSelected = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(newSelected);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="design-brief-question-title">{label}</div>
      )}
      {description && (
        <p className="design-brief-question-description">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            className={cn(
              "rounded-full",
              selectedValues.includes(option.value) &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
