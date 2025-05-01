
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SpaceRoom, OccupantEntry } from '@/types';
import { getRoomQuestions } from './roomQuestions';
import { PrimaryUsersSelect } from './PrimaryUsersSelect';
import { useDesignBrief } from '@/context/DesignBriefContext';

interface RoomItemProps {
  room: SpaceRoom;
  onEdit: (room: SpaceRoom) => void;
  onRemove: (id: string) => void;
}

export const RoomItem = ({ room, onEdit, onRemove }: RoomItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayName, setDisplayName] = useState(room.displayName || '');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const { formData } = useDesignBrief();
  const occupants = formData.lifestyle.occupantEntries || [];
  
  // Get the homeLevelType to auto-set or hide level selection
  const homeLevelType = formData.spaces.homeLevelType;
  const isSingleLevel = homeLevelType === 'single_level';

  const descriptionData = useMemo(() => {
    try {
      if (room.description) {
        return JSON.parse(room.description);
      }
    } catch (e) {}
    return {};
  }, [room.description]);
  
  const primaryUsers = useMemo(() => {
    return room.primaryUsers || [];
  }, [room.primaryUsers]);

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    updateRoomDescription('level', value);
  };
  
  const handlePropertyChange = (key: string, value: string | boolean) => {
    updateRoomDescription(key, value);
  };
  
  const handlePrimaryUsersChange = (selectedIds: string[]) => {
    onEdit({
      ...room,
      primaryUsers: selectedIds
    });
  };

  const updateRoomDescription = (key: string, value: any) => {
    try {
      let currentData = {};
      
      if (room.description) {
        try {
          currentData = JSON.parse(room.description);
        } catch (e) {
          currentData = {};
        }
      }
      
      currentData = {
        ...currentData,
        [key]: value
      };
      
      onEdit({
        ...room,
        description: JSON.stringify(currentData)
      });
    } catch (e) {
      console.error("Error updating room description:", e);
      toast.error("Could not update room details");
    }
  };
  
  const questions = getRoomQuestions(room.type);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  
  const handleDisplayNameSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({
      ...room,
      displayName
    });
    toast.success("Room name updated");
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRoomDescription('notes', e.target.value);
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const roomName = room.displayName || room.customName || `${room.type}`;

  const getNotesPlaceholder = () => {
    if (room.type === 'Bedroom') {
      return "Any additional notes about this room, including proximity preferences (e.g., master bedroom away from children's bedrooms)...";
    }
    return "Any additional notes about this room...";
  };

  // This handler prevents click events from bubbling up when interacting with form controls
  const preventPropagation = (e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
  };

  // Conditionally set the level if it's a single level home
  const autoSetSingleLevel = () => {
    if (isSingleLevel && descriptionData.level !== 'single_level') {
      handleLevelChange('single_level');
      return null; // Return null to avoid rendering anything
    }
    return null;
  };

  return (
    <Card className="mb-4 border">
      <CardContent 
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
        onClick={toggleExpanded}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="font-bold text-lg text-black">{roomName}</div>
            
            {primaryUsers && primaryUsers.length > 0 && (
              <div className="text-sm text-black mt-1">
                <span className="font-medium">Used by:</span> {primaryUsers.map(id => {
                  const user = occupants.find(o => o.id === id);
                  return user?.name || 'Unknown';
                }).join(", ")}
              </div>
            )}
            
            {descriptionData.level && (
              <div className="text-sm text-black mt-1">
                <span className="font-medium">Level:</span> {descriptionData.level.replace(/_/g, ' ').toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(room.id);
              }} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remove room"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4" onClick={preventPropagation}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor={`room-name-${room.id}`} className="text-black font-medium">Room Name</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id={`room-name-${room.id}`}
                    value={displayName} 
                    onChange={handleDisplayNameChange} 
                    placeholder={`${room.type} Name`} 
                    className="flex-1 text-black"
                    onFocus={preventPropagation}
                    onClick={preventPropagation}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDisplayNameSave}
                    className="shrink-0 text-black"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Move PrimaryUsersSelect to be right after the room name */}
              <PrimaryUsersSelect 
                occupants={occupants}
                selectedUsers={primaryUsers}
                onChange={handlePrimaryUsersChange}
              />
              
              {/* Only show level selection if not single level or if explicitly overridden */}
              {!isSingleLevel && (
                <div>
                  <Label htmlFor={`room-level-${room.id}`} className="text-black font-medium">Level</Label>
                  <Select 
                    value={descriptionData.level || ''} 
                    onValueChange={handleLevelChange}
                  >
                    <SelectTrigger 
                      id={`room-level-${room.id}`} 
                      className="mt-1 text-black"
                      onClick={preventPropagation}
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground Floor</SelectItem>
                      <SelectItem value="upper">Upper Floor</SelectItem>
                      <SelectItem value="lower">Lower Floor/Basement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isSingleLevel && (
                <div className="hidden">
                  {autoSetSingleLevel()}
                </div>
              )}
            </div>
            
            {questions.map((question) => (
              <div key={question.id}>
                <Label htmlFor={`room-${question.id}-${room.id}`} className="text-black font-medium">{question.label}</Label>
                {question.type === 'select' && (
                  <Select 
                    value={descriptionData[question.id] || ''} 
                    onValueChange={value => handlePropertyChange(question.id, value)}
                  >
                    <SelectTrigger 
                      id={`room-${question.id}-${room.id}`} 
                      className="mt-1 text-black"
                      onClick={preventPropagation}
                    >
                      <SelectValue placeholder={question.placeholder || `Select ${question.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options?.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {question.type === 'checkbox' && (
                  <div className="flex items-center space-x-2 mt-1">
                    <input 
                      type="checkbox" 
                      id={`room-${question.id}-${room.id}`}
                      checked={!!descriptionData[question.id]} 
                      onChange={e => handlePropertyChange(question.id, e.target.checked)}
                      className="h-4 w-4"
                      onClick={preventPropagation}
                    />
                    <Label 
                      htmlFor={`room-${question.id}-${room.id}`}
                      className="text-sm text-black"
                    >
                      {question.checkboxLabel || question.label}
                    </Label>
                  </div>
                )}
              </div>
            ))}
            
            <div>
              <Label htmlFor={`room-notes-${room.id}`} className="text-black font-medium">Notes</Label>
              <Textarea 
                id={`room-notes-${room.id}`}
                value={descriptionData.notes || ''} 
                onChange={handleNotesChange}
                placeholder={getNotesPlaceholder()}
                className="mt-1 text-black"
                onFocus={preventPropagation}
                onClick={preventPropagation}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
