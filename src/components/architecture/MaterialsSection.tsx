
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

// Updated material options with US-specific terms
const externalMaterialOptions = [
  { value: 'Fiber Cement', label: 'Fiber Cement' },
  { value: 'Stucco', label: 'Stucco' },
  { value: 'Brick Veneer', label: 'Brick Veneer' },
  { value: 'Natural Stone', label: 'Natural Stone' },
  { value: 'Metal Panels', label: 'Metal Panels' },
  { value: 'Lap Siding', label: 'Lap Siding' },
  { value: 'Cedar', label: 'Cedar Siding' },
  { value: 'Corten Steel', label: 'Corten Steel' },
  { value: 'Aluminum Composite Panel', label: 'Aluminum Panels' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Vinyl Siding', label: 'Vinyl Siding' },
];

const internalMaterialOptions = [
  { value: 'Drywall', label: 'Drywall' },
  { value: 'Hardwood Flooring', label: 'Hardwood Flooring' },
  { value: 'Quartz Countertops', label: 'Quartz Countertops' },
  { value: 'Shaker Cabinets', label: 'Shaker Cabinets' },
  { value: 'Engineered Wood', label: 'Engineered Wood' },
  { value: 'Carpet', label: 'Carpet' },
  { value: 'Tile', label: 'Tile' },
  { value: 'Vinyl', label: 'Vinyl' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Natural Stone', label: 'Natural Stone' },
  { value: 'Wood Paneling', label: 'Wood Paneling' },
  { value: 'Marble', label: 'Marble' },
  { value: 'Granite', label: 'Granite' },
];

interface MaterialsSectionProps {
  externalMaterials: string;
  internalFinishes: string;
  externalMaterialsSelected: string[];
  internalMaterialsSelected: string[];
  onExternalMaterialsChange: (values: string[]) => void;
  onInternalMaterialsChange: (values: string[]) => void;
  onInputChange: (field: string, value: string) => void;
}

export function MaterialsSection({
  externalMaterials,
  internalFinishes,
  externalMaterialsSelected,
  internalMaterialsSelected,
  onExternalMaterialsChange,
  onInternalMaterialsChange,
  onInputChange
}: MaterialsSectionProps) {
  return (
    <div className="design-brief-form-group">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="externalMaterials" className="design-brief-question-title text-black font-bold">External Materials</Label>
          <p className="text-sm text-black mb-2">
            Select your preferred external cladding and finishes.
          </p>
          <MultiSelectButtons
            label="External Materials"
            options={externalMaterialOptions}
            selectedValues={externalMaterialsSelected}
            onChange={onExternalMaterialsChange}
          />
          <Textarea 
            id="externalMaterials" 
            className="mt-4 text-black"
            placeholder="e.g. I prefer dark metal panels for the second story and stone accents at the base"
            value={externalMaterials || ''}
            onChange={(e) => onInputChange('externalMaterials', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalFinishes" className="design-brief-question-title text-black font-bold">Internal Materials</Label>
          <p className="text-sm text-black mb-2">
            Select your preferred internal materials and finishes.
          </p>
          <MultiSelectButtons
            label="Internal Materials"
            options={internalMaterialOptions}
            selectedValues={internalMaterialsSelected}
            onChange={onInternalMaterialsChange}
          />
          <Textarea 
            id="internalFinishes" 
            className="mt-4 text-black"
            placeholder="e.g. I prefer light oak hardwood floors throughout and white quartz countertops in kitchen"
            value={internalFinishes || ''}
            onChange={(e) => onInputChange('internalFinishes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
