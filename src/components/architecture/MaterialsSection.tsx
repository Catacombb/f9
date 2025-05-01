
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';

// Material options with Colorado-specific materials prioritized
const externalMaterialOptions = [
  { value: 'Fiber Cement', label: 'Fiber Cement' },
  { value: 'Stucco', label: 'Stucco' },
  { value: 'Brick', label: 'Brick' },
  { value: 'Stone', label: 'Natural Stone' },
  { value: 'Metal Cladding', label: 'Metal Panels' },
  { value: 'Weatherboard', label: 'Weatherboard' },
  { value: 'Linea', label: 'Linea' },
  { value: 'Cedar', label: 'Cedar' },
  { value: 'Corten Steel', label: 'Corten Steel' },
  { value: 'Aluminum Composite Panel', label: 'Aluminum Composite Panel' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'ColorSteel', label: 'ColorSteel' },
];

const internalMaterialOptions = [
  { value: 'Plasterboard', label: 'Drywall' },
  { value: 'Timber Flooring', label: 'Hardwood Flooring' },
  { value: 'Quartz', label: 'Quartz Countertops' },
  { value: 'Shaker Cabinets', label: 'Shaker Cabinets' },
  { value: 'Engineered Wood', label: 'Engineered Wood' },
  { value: 'Carpet', label: 'Carpet' },
  { value: 'Tile', label: 'Tile' },
  { value: 'Vinyl', label: 'Vinyl' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Natural Stone', label: 'Natural Stone' },
  { value: 'Timber Paneling', label: 'Timber Paneling' },
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
          <Label htmlFor="externalMaterials" className="design-brief-question-title">External Materials</Label>
          <p className="text-sm text-muted-foreground mb-2">
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
            className="mt-4"
            placeholder="Any additional details about external materials and finishes..."
            value={externalMaterials || ''}
            onChange={(e) => onInputChange('externalMaterials', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalFinishes" className="design-brief-question-title">Internal Materials</Label>
          <p className="text-sm text-muted-foreground mb-2">
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
            className="mt-4"
            placeholder="Any additional details about internal finishes, colors, and textures..."
            value={internalFinishes || ''}
            onChange={(e) => onInputChange('internalFinishes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
