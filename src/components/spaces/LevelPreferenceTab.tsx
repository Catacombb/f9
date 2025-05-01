
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, House } from 'lucide-react';

interface LevelPreferenceTabProps {
  homeLevelType: string;
  onHomeLevelTypeChange: (value: string) => void;
}

export const LevelPreferenceTab: React.FC<LevelPreferenceTabProps> = ({ 
  homeLevelType, 
  onHomeLevelTypeChange 
}) => {
  return (
    <Card className="border-blueprint-200">
      <CardHeader>
        <CardTitle className="text-black">Level Preference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-black">
            Select your preferred level configuration for your home:
          </p>
          <div className="pt-4">
            <RadioGroup 
              value={homeLevelType} 
              onValueChange={onHomeLevelTypeChange}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="single_level" 
                      id="single_level" 
                      className="text-black"
                    />
                    <Label htmlFor="single_level" className="text-lg font-medium text-black">Single Level</Label>
                  </div>
                  <div className="flex items-center justify-center p-4 mt-2 bg-gray-50 rounded-md h-32">
                    <House className="h-16 w-16 text-black" />
                  </div>
                  <p className="mt-2 text-sm text-black">
                    All rooms on one floor. Great for accessibility and aging in place.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="two_level" 
                      id="two_level"
                      className="text-black"
                    />
                    <Label htmlFor="two_level" className="text-lg font-medium text-black">Multi Level</Label>
                  </div>
                  <div className="flex items-center justify-center p-4 mt-2 bg-gray-50 rounded-md h-32">
                    <Building className="h-16 w-16 text-black" />
                  </div>
                  <p className="mt-2 text-sm text-black">
                    Main living areas plus bedrooms upstairs. Most common layout.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="basement" 
                    id="basement"
                    className="text-black" 
                  />
                  <Label htmlFor="basement" className="text-lg font-medium text-black">With Basement</Label>
                </div>
                <p className="ml-6 mt-2 text-sm text-black">
                  Includes a finished or unfinished basement below the main level(s).
                </p>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
