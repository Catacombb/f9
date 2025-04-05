
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LevelPreferenceTabProps {
  homeLevelType: string | undefined;
  levelAssignments: Record<string, string> | undefined;
  levelAssignmentNotes: string | undefined;
  roomsWithQuantities: { type: string; quantity: number }[];
  onHomeLevelTypeChange: (value: string) => void;
  onLevelAssignmentChange: (roomType: string, level: string) => void;
  onLevelAssignmentNotesChange: (notes: string) => void;
}

export const LevelPreferenceTab: React.FC<LevelPreferenceTabProps> = ({
  homeLevelType,
  levelAssignments = {},
  levelAssignmentNotes = '',
  roomsWithQuantities,
  onHomeLevelTypeChange,
  onLevelAssignmentChange,
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
              <div>
                <Label className="text-base font-medium">
                  Which level would you like each space to be on?
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  For each space you're considering, indicate your preferred level placement.
                </p>
                
                <div className="space-y-4 mt-4">
                  {roomsWithQuantities
                    .filter(room => room.quantity > 0)
                    .map(room => (
                      <div key={room.type} className="grid grid-cols-2 gap-4 items-center border-b pb-4">
                        <div className="font-medium">{room.type}</div>
                        <Select
                          value={levelAssignments[room.type] || ''}
                          onValueChange={(value) => onLevelAssignmentChange(room.type, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ground">Ground Floor</SelectItem>
                            <SelectItem value="upper">Upper Floor</SelectItem>
                            <SelectItem value="either">Either / No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                </div>
              </div>
              
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
