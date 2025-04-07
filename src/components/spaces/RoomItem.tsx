import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Parse description if it exists and is a valid JSON string
  const descriptionData = useMemo(() => {
    try {
      if (room.description) {
        return JSON.parse(room.description);
      }
    } catch (e) {}
    return {}; // Default empty object if parse fails
  }, [room.description]);
  
  // Get primaryUsers from description data or use empty array
  const primaryUsers = useMemo(() => {
    return room.primaryUsers || [];
  }, [room.primaryUsers]);

  // Handle level change
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    updateRoomDescription('level', value);
  };
  
  // Handle room type specific property changes
  const handlePropertyChange = (key: string, value: string | boolean) => {
    updateRoomDescription(key, value);
  };
  
  const handlePrimaryUsersChange = (selectedIds: string[]) => {
    onEdit({
      ...room,
      primaryUsers: selectedIds
    });
  };

  // Update description JSON
  const updateRoomDescription = (key: string, value: any) => {
    try {
      let currentData = {};
      
      if (room.description) {
        try {
          currentData = JSON.parse(room.description);
        } catch (e) {
          // If parse fails, start fresh
          currentData = {};
        }
      }
      
      // Update the specified key
      currentData = {
        ...currentData,
        [key]: value
      };
      
      // Update the room with new description JSON
      onEdit({
        ...room,
        description: JSON.stringify(currentData)
      });
      
    } catch (e) {
      console.error("Error updating room description:", e);
      toast.error("Could not update room details");
    }
  };
  
  // Get any custom questions for this room type
  const questions = getRoomQuestions(room.type);

  // Handle display name change
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  
  const handleDisplayNameSave = () => {
    onEdit({
      ...room,
      displayName
    });
    toast.success("Room name updated");
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRoomDescription('notes', e.target.value);
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Get custom or default room name for display
  const roomName = room.displayName || room.customName || `${room.type}`;

  // Create room-specific note placeholder
  const getNotesPlaceholder = () => {
    if (room.type === 'Bedroom') {
      return "Any additional notes about this room, including proximity preferences (e.g., master bedroom away from children's bedrooms)...";
    }
    return "Any additional notes about this room...";
  };

  return (
    <Card className="mb-4 border">
      <CardContent className="p-4">
        {/* Primary Users Displayed at the Top */}
        {primaryUsers && primaryUsers.length > 0 && (
          <div className="mb-2 text-xs text-muted-foreground">
            Intended for: {primaryUsers.map(id => {
              const user = occupants.find(o => o.id === id);
              return user?.name || 'Unknown';
            }).join(", ")}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="font-medium text-lg">{roomName}</div>
            {descriptionData.level && (
              <div className="text-xs text-muted-foreground mt-1">
                Level: {descriptionData.level.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpanded} 
              aria-label="Expand room details"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(room.id)} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remove room"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`room-name-${room.id}`}>Room Name</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id={`room-name-${room.id}`}
                    value={displayName} 
                    onChange={handleDisplayNameChange} 
                    placeholder={`${room.type} Name`} 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDisplayNameSave}
                    className="shrink-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`room-level-${room.id}`}>Level</Label>
                <Select 
                  value={descriptionData.level || ''} 
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger id={`room-level-${room.id}`} className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="upper">Upper Floor</SelectItem>
                    <SelectItem value="lower">Lower Floor/Basement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Room-specific questions */}
            {questions.map((question) => (
              <div key={question.id}>
                <Label htmlFor={`room-${question.id}-${room.id}`}>{question.label}</Label>
                {question.type === 'select' && (
                  <Select 
                    value={descriptionData[question.id] || ''} 
                    onValueChange={value => handlePropertyChange(question.id, value)}
                  >
                    <SelectTrigger id={`room-${question.id}-${room.id}`} className="mt-1">
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
                    />
                    <Label 
                      htmlFor={`room-${question.id}-${room.id}`}
                      className="text-sm text-muted-foreground"
                    >
                      {question.checkboxLabel || question.label}
                    </Label>
                  </div>
                )}
              </div>
            ))}
            
            {/* Primary Users Select */}
            <PrimaryUsersSelect 
              occupants={occupants}
              selectedUsers={primaryUsers}
              onChange={handlePrimaryUsersChange}
            />
            
            <div>
              <Label htmlFor={`room-notes-${room.id}`}>Notes</Label>
              <Textarea 
                id={`room-notes-${room.id}`}
                value={descriptionData.notes || ''} 
                onChange={handleNotesChange}
                placeholder={getNotesPlaceholder()}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
