
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface GeneralQuestionsTabProps {
  additionalNotes: string;
  eliminableSpaces: string | undefined;
  homeSize: string | undefined;
  roomArrangement: string | undefined;
  onAdditionalNotesChange: (notes: string) => void;
  onEliminableSpacesChange: (notes: string) => void;
  onHomeSizeChange: (notes: string) => void;
  onRoomArrangementChange: (notes: string) => void;
}

export const GeneralQuestionsTab = ({
  additionalNotes,
  eliminableSpaces,
  homeSize,
  roomArrangement,
  onAdditionalNotesChange,
  onEliminableSpacesChange,
  onHomeSizeChange,
  onRoomArrangementChange
}: GeneralQuestionsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Questions About Your Spaces</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="eliminableSpaces" className="text-base">
              Are there any of these spaces that you would deem less important or could eliminate if budget were an issue?
            </Label>
            <Textarea
              id="eliminableSpaces"
              value={eliminableSpaces || ''}
              onChange={(e) => onEliminableSpacesChange(e.target.value)}
              placeholder="List any spaces that could be eliminated if needed..."
              className="mt-1 h-28"
            />
          </div>

          <div>
            <Label htmlFor="homeSize" className="text-base">
              Do you have an idea of the final size of the home?
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Square meters, number of floors
            </p>
            <Textarea
              id="homeSize"
              value={homeSize || ''}
              onChange={(e) => onHomeSizeChange(e.target.value)}
              placeholder="e.g., Approximately 200 square meters, 2 floors..."
              className="mt-1 h-24"
            />
          </div>

          <div>
            <Label htmlFor="roomArrangement" className="text-base">
              Do you have any preferences for how rooms should be arranged?
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              For example, should the kitchen be separate from bedrooms, or should a home office be in a quiet area?
            </p>
            <Textarea
              id="roomArrangement"
              value={roomArrangement || ''}
              onChange={(e) => onRoomArrangementChange(e.target.value)}
              placeholder="Describe your preferences for room arrangements..."
              className="mt-1 h-28"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
