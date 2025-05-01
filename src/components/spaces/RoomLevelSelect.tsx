
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignBrief } from '@/context/DesignBriefContext';

interface RoomLevelSelectProps {
  currentLevel: string;
  onLevelChange: (level: string) => void;
  disabled?: boolean;
}

export const RoomLevelSelect: React.FC<RoomLevelSelectProps> = ({
  currentLevel,
  onLevelChange,
  disabled = false
}) => {
  const { formData } = useDesignBrief();
  const homeLevelType = formData.spaces.homeLevelType;
  
  // If single level is selected, disable the dropdown and set to "Single Level"
  const isSingleLevel = homeLevelType === 'single_level';

  // If the home level type is single_level and the currentLevel is not "main"
  // we should force it to be "main"
  React.useEffect(() => {
    if (isSingleLevel && currentLevel !== "main") {
      onLevelChange("main");
    }
  }, [isSingleLevel, currentLevel, onLevelChange]);

  return (
    <div className="w-full">
      <Select 
        value={isSingleLevel ? "main" : currentLevel} 
        onValueChange={onLevelChange}
        disabled={disabled || isSingleLevel}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">Main Level</SelectItem>
          {!isSingleLevel && (
            <>
              <SelectItem value="upper">Upper Level</SelectItem>
              <SelectItem value="lower">Lower Level</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
