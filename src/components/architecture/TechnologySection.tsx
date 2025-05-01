
import React from 'react';
import { Label } from '@/components/ui/label';
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
  technologyRequirements: string[];
  onTechnologyChange: (values: string[]) => void;
}

export function TechnologySection({
  technologyRequirements,
  onTechnologyChange
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
      </div>
    </div>
  );
}
