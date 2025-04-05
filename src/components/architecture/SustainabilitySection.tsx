
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

const sustainabilityOptions = [
  { value: 'Solar Panels', label: 'Solar Panels' },
  { value: 'Energy-Efficient Windows', label: 'Energy-Efficient Windows' },
  { value: 'Rainwater Harvesting', label: 'Rainwater Harvesting' },
  { value: 'Green Roof', label: 'Green Roof' },
  { value: 'Passive Design', label: 'Passive Design' },
  { value: 'Insulation', label: 'Insulation' },
  { value: 'Smart Home Tech', label: 'Smart Home Tech' },
  { value: 'Reclaimed Materials', label: 'Reclaimed Materials' },
  { value: 'Low VOC Materials', label: 'Low VOC Materials' },
  { value: 'Water Conservation', label: 'Water Conservation' },
];

interface SustainabilitySectionProps {
  sustainabilityGoals: string;
  sustainabilityFeatures: string[];
  onSustainabilityChange: (values: string[]) => void;
  onInputChange: (field: string, value: string) => void;
}

export function SustainabilitySection({
  sustainabilityGoals,
  sustainabilityFeatures,
  onSustainabilityChange,
  onInputChange
}: SustainabilitySectionProps) {
  return (
    <div className="design-brief-form-group">
      <div className="grid gap-6">
        <MultiSelectButtons
          label="Sustainability Features"
          description="Select the sustainability features you're interested in including."
          options={sustainabilityOptions}
          selectedValues={sustainabilityFeatures || []}
          onChange={onSustainabilityChange}
        />

        <div className="space-y-2">
          <Label htmlFor="sustainabilityGoals" className="design-brief-question-title">Sustainability Goals</Label>
          <Textarea 
            id="sustainabilityGoals" 
            placeholder="Describe your sustainability goals and priorities..."
            value={sustainabilityGoals || ''}
            onChange={(e) => onInputChange('sustainabilityGoals', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
