
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GeneralQuestionsTabProps {
  additionalNotes: string;
  eliminableSpaces: string | undefined;
  homeSize: string | undefined;
  onAdditionalNotesChange: (value: string) => void;
  onEliminableSpacesChange: (value: string) => void;
  onHomeSizeChange: (value: string) => void;
}

export const GeneralQuestionsTab: React.FC<GeneralQuestionsTabProps> = ({
  additionalNotes,
  eliminableSpaces,
  homeSize,
  onAdditionalNotesChange,
  onEliminableSpacesChange,
  onHomeSizeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Space Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="homeSize" className="text-base font-medium">
              Approximately how large do you envision your home being?
            </Label>
            <p className="text-sm text-muted-foreground">
              You can provide this in square meters or number of bedrooms/bathrooms.
            </p>
            <Textarea
              id="homeSize"
              placeholder="e.g., 200-250m², 3 bedrooms/2 bathrooms, etc."
              value={homeSize || ''}
              onChange={(e) => onHomeSizeChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="eliminableSpaces" className="text-base font-medium">
              Are there any spaces you're willing to eliminate if necessary?
            </Label>
            <p className="text-sm text-muted-foreground">
              This helps with prioritization during design trade-offs.
            </p>
            <Textarea
              id="eliminableSpaces"
              placeholder="e.g., formal dining room, guest bedroom, etc."
              value={eliminableSpaces || ''}
              onChange={(e) => onEliminableSpacesChange(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="additionalNotes" className="text-base font-medium">
              Any additional information about spaces we should know?
            </Label>
            <p className="text-sm text-muted-foreground">
              Include any other preferences, requirements, or ideas about spaces in your home.
            </p>
            <Textarea
              id="additionalNotes"
              placeholder="Share any other space-related requirements or preferences..."
              value={additionalNotes}
              onChange={(e) => onAdditionalNotesChange(e.target.value)}
              rows={5}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
