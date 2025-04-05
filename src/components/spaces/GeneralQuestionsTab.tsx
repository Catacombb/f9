
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface GeneralQuestionsTabProps {
  additionalNotes: string;
  onAdditionalNotesChange: (notes: string) => void;
}

export const GeneralQuestionsTab = ({
  additionalNotes,
  onAdditionalNotesChange
}: GeneralQuestionsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="additionalNotes">Is there anything specific about your space needs that you'd like to share?</Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes || ''}
              onChange={(e) => onAdditionalNotesChange(e.target.value)}
              placeholder="E.g., specific workflow requirements, accessibility needs, or unique considerations"
              className="mt-2 h-40"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
