
import React from 'react';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const styleOptions = [
  { value: 'Modern', label: 'Modern' },
  { value: 'Contemporary', label: 'Contemporary' },
  { value: 'Traditional', label: 'Traditional' },
  { value: 'Minimalist', label: 'Minimalist' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Farmhouse', label: 'Farmhouse' },
  { value: 'Mid-Century Modern', label: 'Mid-Century Modern' },
  { value: 'Craftsman', label: 'Craftsman' },
  { value: 'Mediterranean', label: 'Mediterranean' },
  { value: 'Scandinavian', label: 'Scandinavian' },
];

interface StylePreferencesProps {
  preferredStyles: string[];
  stylePrefences: string;
  onStylesChange: (values: string[]) => void;
  onInputChange: (field: string, value: string) => void;
}

export function StylePreferences({
  preferredStyles,
  stylePrefences,
  onStylesChange,
  onInputChange
}: StylePreferencesProps) {
  return (
    <div className="design-brief-form-group">
      <MultiSelectButtons
        label="Preferred Architectural Styles"
        description="Select the architectural styles you prefer for your project."
        options={styleOptions}
        selectedValues={preferredStyles || []}
        onChange={onStylesChange}
      />

      <div className="space-y-2 mt-6">
        <Label htmlFor="stylePrefences" className="design-brief-question-title">Style Preferences Details</Label>
        <Textarea 
          id="stylePrefences" 
          placeholder="Describe your architectural style preferences in detail..."
          value={stylePrefences || ''}
          onChange={(e) => onInputChange('stylePrefences', e.target.value)}
        />
      </div>
    </div>
  );
}
