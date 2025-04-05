
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface LevelPreferenceTabProps {
  homeLevelType: string | undefined;
  levelAssignmentNotes: string | undefined;
  onHomeLevelTypeChange: (value: string) => void;
  onLevelAssignmentNotesChange: (notes: string) => void;
}

export const LevelPreferenceTab: React.FC<LevelPreferenceTabProps> = ({
  homeLevelType,
  levelAssignmentNotes = '',
  onHomeLevelTypeChange,
  onLevelAssignmentNotesChange
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
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="single-level" id="level-single" />
                <div>
                  <Label htmlFor="level-single" className="font-medium">Single-Level</Label>
                  <p className="text-sm text-muted-foreground">All rooms on the same floor, better accessibility</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="multi-level" id="level-multi" />
                <div>
                  <Label htmlFor="level-multi" className="font-medium">Multi-Level</Label>
                  <p className="text-sm text-muted-foreground">Rooms distributed across multiple floors</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="unsure" id="level-unsure" />
                <div>
                  <Label htmlFor="level-unsure" className="font-medium">I'm Not Sure / Don't Mind</Label>
                  <p className="text-sm text-muted-foreground">Open to recommendations based on other requirements</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {homeLevelType === 'multi-level' && (
            <div className="mt-8 space-y-5 border-t pt-6">
              <div className="mt-6">
                <Label className="text-base font-medium" htmlFor="levelAssignmentNotes">
                  Any notes or preferences for how the levels are arranged?
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  For example, you might want all bedrooms on the upper level, or prefer the main living spaces to have direct access to the garden.
                </p>
                <Textarea
                  id="levelAssignmentNotes"
                  value={levelAssignmentNotes}
                  onChange={(e) => onLevelAssignmentNotesChange(e.target.value)}
                  placeholder="e.g., I want bedrooms upstairs for privacy and living spaces on the ground floor with garden access..."
                  className="mt-2"
                  rows={5}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
