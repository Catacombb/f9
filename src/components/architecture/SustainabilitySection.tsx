
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { AlertTriangle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        {/* F9 Productions Sustainability Message */}
        <div className="bg-blueprint-50 dark:bg-blueprint-900/30 border border-blueprint-200 dark:border-blueprint-800 p-4 mb-2">
          <div className="flex justify-between items-start">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-blueprint-600 dark:text-blueprint-400 mt-0.5 mr-2 shrink-0" />
              <p className="text-black dark:text-gray-300 text-sm">
                F9 designs for long-term performance. We integrate passive solar, energy-efficient materials, and future-ready systems. Your home should work for you, not against the planet.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-yellow-400 hover:bg-yellow-50 bg-yellow-500 hover:border-yellow-600 text-black ml-4 shrink-0"
              onClick={() => window.open("https://f9productions.com/f9-sustainability/", "_blank")}
            >
              <Leaf className="mr-2 h-4 w-4 text-black" />
              Learn how F9 builds sustainably
            </Button>
          </div>
        </div>

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
            placeholder="Describe your specific sustainability priorities and goals..."
            value={sustainabilityGoals || ''}
            onChange={(e) => onInputChange('sustainabilityGoals', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
