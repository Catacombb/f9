
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2 } from 'lucide-react';
import { featureOptions } from './roomTypes';

interface GeneralAnswers {
  mustHaveFeatures: string[];
  lessImportantSpaces: string;
  homeSize: string;
  roomArrangement: string;
  singleLevelLiving: string;
  levelPreference: string;
}

interface GeneralQuestionsTabProps {
  generalAnswers: GeneralAnswers;
  handleGeneralAnswersChange: (field: string, value: any) => void;
  handleFeatureToggle: (feature: string) => void;
}

export const GeneralQuestionsTab = ({ 
  generalAnswers, 
  handleGeneralAnswersChange, 
  handleFeatureToggle 
}: GeneralQuestionsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Space Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">
              What rooms and spaces do you want in your home?
            </Label>
            <p className="text-sm text-muted-foreground">
              Select the types of rooms below, then go to the "Room Selection" tab to add details.
            </p>
          </div>
          
          <div className="space-y-4">
            <Label className="text-base">
              Include must-have features
            </Label>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map(feature => (
                <Button
                  key={feature}
                  type="button"
                  variant={generalAnswers.mustHaveFeatures?.includes(feature) ? "default" : "outline"}
                  onClick={() => handleFeatureToggle(feature)}
                  className="flex items-center gap-1"
                >
                  {generalAnswers.mustHaveFeatures?.includes(feature) && (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  )}
                  {feature}
                </Button>
              ))}
            </div>
            <Input
              placeholder="Other features (comma-separated)"
              value={generalAnswers.mustHaveFeatures?.filter(f => !featureOptions.includes(f)).join(', ')}
              onChange={(e) => {
                const customFeatures = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
                const standardFeatures = generalAnswers.mustHaveFeatures?.filter(f => featureOptions.includes(f)) || [];
                handleGeneralAnswersChange('mustHaveFeatures', [...standardFeatures, ...customFeatures]);
              }}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base" htmlFor="lessImportantSpaces">
              Are there any of these spaces that you would deem less important or could eliminate if budget were an issue?
            </Label>
            <Textarea
              id="lessImportantSpaces"
              placeholder="List any spaces that could be eliminated or reduced if needed..."
              value={generalAnswers.lessImportantSpaces}
              onChange={(e) => handleGeneralAnswersChange('lessImportantSpaces', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base" htmlFor="homeSize">
              Do you have an idea of the final size of the home?
            </Label>
            <Input
              id="homeSize"
              placeholder="E.g., 200 square meters, two floors"
              value={generalAnswers.homeSize}
              onChange={(e) => handleGeneralAnswersChange('homeSize', e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base" htmlFor="roomArrangement">
              Do you have any preferences for how rooms should be arranged?
            </Label>
            <p className="text-sm text-muted-foreground">
              For example, should the kitchen be separate from bedrooms, or should a home office be in a quiet area?
            </p>
            <Textarea
              id="roomArrangement"
              placeholder="Describe your preferences for room arrangements..."
              value={generalAnswers.roomArrangement}
              onChange={(e) => handleGeneralAnswersChange('roomArrangement', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base">
              Is single-level living a priority for you?
            </Label>
            <RadioGroup
              value={generalAnswers.singleLevelLiving}
              onValueChange={(value) => handleGeneralAnswersChange('singleLevelLiving', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="singleLevel-yes" />
                <Label htmlFor="singleLevel-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="singleLevel-no" />
                <Label htmlFor="singleLevel-no">No</Label>
              </div>
            </RadioGroup>
            
            {generalAnswers.singleLevelLiving === 'no' && (
              <div className="pt-2">
                <Label className="text-sm" htmlFor="levelPreference">
                  Which spaces would you prefer to be on the main level versus an upper or lower level?
                </Label>
                <Textarea
                  id="levelPreference"
                  placeholder="E.g., Bedrooms upstairs, living areas on main level..."
                  value={generalAnswers.levelPreference}
                  onChange={(e) => handleGeneralAnswersChange('levelPreference', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
