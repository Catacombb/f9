
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

const technologyOptions = [
  { value: 'Smart Home System', label: 'Smart Home System' },
  { value: 'Automated Lighting', label: 'Automated Lighting' },
  { value: 'Climate Control', label: 'Climate Control' },
  { value: 'Security System', label: 'Security System' },
  { value: 'Entertainment System', label: 'Entertainment System' },
  { value: 'Electric Vehicle Charging', label: 'Electric Vehicle Charging' },
  { value: 'High-Speed Internet', label: 'High-Speed Internet' },
  { value: 'Voice Control', label: 'Voice Control' },
  { value: 'Energy Monitoring', label: 'Energy Monitoring' },
  { value: 'Automated Irrigation', label: 'Automated Irrigation' },
];

interface TechnologySectionProps {
  specialFeatures: string;
  inspirationNotes: string;
  architectureNotes: string;
  technologyRequirements: string[];
  onTechnologyChange: (values: string[]) => void;
  onInputChange: (field: string, value: string) => void;
}

export function TechnologySection({
  specialFeatures,
  inspirationNotes,
  architectureNotes,
  technologyRequirements,
  onTechnologyChange,
  onInputChange
}: TechnologySectionProps) {
  return (
    <div className="design-brief-form-group">
      <div className="grid gap-6">
        <MultiSelectButtons
          label="Technology Requirements"
          description="Select the technology features you want to include."
          options={technologyOptions}
          selectedValues={technologyRequirements || []}
          onChange={onTechnologyChange}
        />

        <div className="space-y-2">
          <Label htmlFor="specialFeatures" className="design-brief-question-title">Special Architectural Features</Label>
          <Textarea 
            id="specialFeatures" 
            placeholder="Describe any special architectural features you're interested in..."
            value={specialFeatures || ''}
            onChange={(e) => onInputChange('specialFeatures', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspirationNotes" className="design-brief-question-title">Inspiration Notes</Label>
          <Textarea 
            id="inspirationNotes" 
            placeholder="Describe sources of inspiration or reference projects..."
            value={inspirationNotes || ''}
            onChange={(e) => onInputChange('inspirationNotes', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="architectureNotes" className="design-brief-question-title">Additional Architecture Notes</Label>
          <Textarea 
            id="architectureNotes" 
            placeholder="Any other architectural considerations or preferences..."
            value={architectureNotes || ''}
            onChange={(e) => onInputChange('architectureNotes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
