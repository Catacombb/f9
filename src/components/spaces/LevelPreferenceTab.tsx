
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LevelPreferenceTabProps {
  homeLevelType: string | undefined;
  onHomeLevelTypeChange: (value: string) => void;
}

export const LevelPreferenceTab: React.FC<LevelPreferenceTabProps> = ({
  homeLevelType,
  onHomeLevelTypeChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Home Level Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Do you want your home to be single-level, multi-level, or are you unsure?
            </Label>
            <p className="text-sm text-muted-foreground">
              This decision affects the overall layout and accessibility of your design.
            </p>
            <RadioGroup
              value={homeLevelType || ''}
              onValueChange={onHomeLevelTypeChange}
              className="space-y-3 pt-2"
            >
              <div 
                className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onHomeLevelTypeChange('single-level')}
              >
                <RadioGroupItem value="single-level" id="level-single" />
                <div className="flex-1">
                  <Label htmlFor="level-single" className="font-medium cursor-pointer">Single-Level</Label>
                  <p className="text-sm text-muted-foreground">All rooms on the same floor, better accessibility</p>
                </div>
              </div>
              <div 
                className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onHomeLevelTypeChange('multi-level')}
              >
                <RadioGroupItem value="multi-level" id="level-multi" />
                <div className="flex-1">
                  <Label htmlFor="level-multi" className="font-medium cursor-pointer">Multi-Level</Label>
                  <p className="text-sm text-muted-foreground">Rooms distributed across multiple floors</p>
                </div>
              </div>
              <div 
                className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onHomeLevelTypeChange('unsure')}
              >
                <RadioGroupItem value="unsure" id="level-unsure" />
                <div className="flex-1">
                  <Label htmlFor="level-unsure" className="font-medium cursor-pointer">I'm Not Sure / Don't Mind</Label>
                  <p className="text-sm text-muted-foreground">Open to recommendations based on other requirements</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
