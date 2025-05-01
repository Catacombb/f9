import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SpaceRoom } from '@/types';
import { RoomLevelSelect } from './RoomLevelSelect';

interface RoomItemProps {
  room: SpaceRoom;
  onEdit: (room: SpaceRoom) => void;
  onRemove: (id: string) => void;
}

export const RoomItem: React.FC<RoomItemProps> = ({ room, onEdit, onRemove }) => {
  const [displayName, setDisplayName] = useState(room.displayName || '');
  const [description, setDescription] = useState(room.description || '');
  const [level, setLevel] = useState(room.level || 'main');
  const [primaryUsers, setPrimaryUsers] = useState(room.primaryUsers || []);
  
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = e.target.value;
    setDisplayName(newDisplayName);
    onEdit({ ...room, displayName: newDisplayName });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onEdit({ ...room, description: newDescription });
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    onEdit({ ...room, level: newLevel });
  };
  
  const handleRemove = () => {
    onRemove(room.id);
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`displayName-${room.id}`}>Space Name</Label>
              <Input
                type="text"
                id={`displayName-${room.id}`}
                value={displayName}
                onChange={handleDisplayNameChange}
                placeholder={`e.g., Master ${room.type}`}
              />
            </div>
            
            <div>
              <Label htmlFor={`level-${room.id}`}>Level</Label>
              <RoomLevelSelect 
                currentLevel={level}
                onLevelChange={handleLevelChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor={`description-${room.id}`}>Details</Label>
            <Textarea
              id={`description-${room.id}`}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="e.g., good natural light, street view"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="destructive" size="sm" onClick={handleRemove}>
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};
