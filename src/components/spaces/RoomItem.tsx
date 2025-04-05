
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, Trash2Icon, X, Check } from 'lucide-react';
import { SpaceRoom } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoomItemProps {
  room: SpaceRoom;
  onEdit: (room: SpaceRoom) => void;
  onRemove: (id: string) => void;
}

export const RoomItem: React.FC<RoomItemProps> = ({ room, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(room.displayName || room.customName || room.type);
  const [editedDescription, setEditedDescription] = useState(room.description || '');
  
  const handleSaveEdit = () => {
    onEdit({
      ...room,
      displayName: editedName,
      description: editedDescription
    });
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditedName(room.displayName || room.customName || room.type);
    setEditedDescription(room.description || '');
    setIsEditing(false);
  };
  
  return (
    <Card className={`mb-4 overflow-hidden transition-all duration-300 ${isEditing ? 'shadow-md' : 'hover:shadow-sm'}`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <div className="flex items-center mb-1">
                <label htmlFor={`room-name-${room.id}`} className="text-sm font-medium">
                  Room Name
                </label>
              </div>
              <Input
                id={`room-name-${room.id}`}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter room name"
                className="focus:ring-2 focus:ring-primary/20 transition-shadow"
              />
            </div>
            
            <div>
              <label htmlFor={`room-description-${room.id}`} className="text-sm font-medium block mb-1">
                Description
              </label>
              <Textarea
                id={`room-description-${room.id}`}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter room description"
                rows={3}
                className="focus:ring-2 focus:ring-primary/20 transition-shadow"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit} 
                className="h-8 transition-all duration-200 active:scale-95"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit} 
                className="h-8 transition-all duration-200 active:scale-95"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">
                  {room.displayName || room.customName || room.type}
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="ml-2 h-8 px-2 text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <PencilIcon className="h-4 w-4 mr-1 group-hover:text-primary transition-colors" />
                        <span className="text-xs text-muted-foreground">Edit room name (e.g., Master Bedroom, Taylor's Room)</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Edit to provide a more specific name
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(room.id)}
                className="h-8 px-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="mt-2 text-sm text-muted-foreground">
              {room.description || "No description provided"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
