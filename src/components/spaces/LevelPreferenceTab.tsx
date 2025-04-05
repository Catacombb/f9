
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
        <div className="space-y-4">
          <Label className="text-base">
            Do you want your home to be single-level, multi-level, or are you unsure?
          </Label>
          <RadioGroup
            value={homeLevelType || ''}
            onValueChange={onHomeLevelTypeChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single-level" id="level-single" />
              <Label htmlFor="level-single">Single-Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multi-level" id="level-multi" />
              <Label htmlFor="level-multi">Multi-Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id="level-unsure" />
              <Label htmlFor="level-unsure">I'm Not Sure / Don't Mind</Label>
            </div>
          </RadioGroup>
        </div>

        {homeLevelType === 'multi-level' && (
          <div className="mt-6 space-y-4">
            <Label className="text-base">
              Which level would you like each space to be on?
            </Label>
            <div className="space-y-4">
              {roomsWithQuantities
                .filter(room => room.quantity > 0)
                .map(room => (
                  <div key={room.type} className="grid grid-cols-2 gap-4 items-center border-b pb-2">
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
            
            <div className="mt-4">
              <Label className="text-base" htmlFor="levelAssignmentNotes">
                Any notes or reasoning behind how you've arranged the levels?
              </Label>
              <Textarea
                id="levelAssignmentNotes"
                value={levelAssignmentNotes}
                onChange={(e) => onLevelAssignmentNotesChange(e.target.value)}
                placeholder="e.g., I want bedrooms upstairs for privacy..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
