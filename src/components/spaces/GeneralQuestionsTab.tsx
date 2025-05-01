
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneralQuestionsTabProps {
  additionalNotes: string;
  eliminableSpaces: string | undefined;
  homeSize: string | undefined;
  onAdditionalNotesChange: (notes: string) => void;
  onEliminableSpacesChange: (notes: string) => void;
  onHomeSizeChange: (notes: string) => void;
}

export const GeneralQuestionsTab = ({
  additionalNotes,
  eliminableSpaces,
  homeSize,
  onAdditionalNotesChange,
  onEliminableSpacesChange,
  onHomeSizeChange
}: GeneralQuestionsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Questions about Spaces</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="homeSize" className="text-base font-medium mb-2 block">
            Do you have an idea of the final size of the home?
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Please provide the approximate size in square feet or number of floors you envision for your home.
          </p>
          <Textarea
            id="homeSize"
            value={homeSize || ''}
            onChange={(e) => onHomeSizeChange(e.target.value)}
            placeholder="e.g., Approximately 2,500 square feet across 2 floors"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="eliminableSpaces" className="text-base font-medium mb-2 block">
            Are there any spaces that could be eliminated if necessary?
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            If budget constraints arise, which spaces could be removed or combined?
          </p>
          <Textarea
            id="eliminableSpaces"
            value={eliminableSpaces || ''}
            onChange={(e) => onEliminableSpacesChange(e.target.value)}
            placeholder="e.g., The home gym could be combined with the office if needed"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="additionalNotes" className="text-base font-medium mb-2 block">
            Additional notes about spaces
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Any other information about the spaces in your home that you'd like to share?
          </p>
          <Textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(e) => onAdditionalNotesChange(e.target.value)}
            placeholder="e.g., We'd like the kitchen to be open to the living area"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
