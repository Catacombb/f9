
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { predefinedRoomTypes } from './roomTypes';
import { SpaceRoom } from '@/types';
import { RoomItem } from './RoomItem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoomSelectionTabProps {
  rooms: SpaceRoom[];
  roomsWithQuantities: { type: string; quantity: number }[];
  newRoomType: string;
  customRoomType: string;
  showCustomInput: boolean;
  handleRoomTypeChange: (value: string) => void;
  setCustomRoomType: (value: string) => void;
  setShowCustomInput: (show: boolean) => void;
  handleAddRoom: () => void;
  getRoomQuantity: (type: string) => number;
  incrementRoomQuantity: (type: string) => void;
  decrementRoomQuantity: (type: string) => void;
  handleRoomQuantityChange: (type: string, quantity: number) => void;
  updateRoom: (room: SpaceRoom) => void;
  handleRemoveRoom: (id: string) => void;
}

export const RoomSelectionTab = ({
  rooms,
  roomsWithQuantities,
  newRoomType,
  customRoomType,
  showCustomInput,
  handleRoomTypeChange,
  setCustomRoomType,
  setShowCustomInput,
  handleAddRoom,
  getRoomQuantity,
  incrementRoomQuantity,
  decrementRoomQuantity,
  handleRoomQuantityChange,
  updateRoom,
  handleRemoveRoom
}: RoomSelectionTabProps) => {
  useEffect(() => {
    const addRoomsFromQuantities = () => {
      Object.entries(roomQuantitiesMap).forEach(([type, quantity]) => {
        const existingRooms = rooms.filter(room => room.type === type).length;
        const diff = quantity - existingRooms;
        
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            const newRoom: Omit<SpaceRoom, 'id'> = {
              type,
              quantity: 1,
              description: '',
              isCustom: false
            };
            addRoom(newRoom);
          }
        } else if (diff < 0) {
          const roomsToRemove = rooms.filter(room => room.type === type).slice(0, -diff);
          roomsToRemove.forEach(room => {
            handleRemoveRoom(room.id);
          });
        }
      });
    };
    
    addRoomsFromQuantities();
  }, [rooms]);
  
  const roomQuantitiesMap = predefinedRoomTypes.reduce((acc, roomType) => {
    acc[roomType.value] = getRoomQuantity(roomType.value);
    return acc;
  }, {} as Record<string, number>);
  
  const addRoom = (room: Omit<SpaceRoom, 'id'>) => {
    handleAddRoom();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select the types of rooms you need and specify how many of each.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {predefinedRoomTypes.map(roomType => (
              <div 
                key={roomType.value} 
                className="flex flex-col items-center border rounded-md p-4"
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {roomType.icon}
                  </div>
                  <span className="mt-2 text-center font-medium">{roomType.label}</span>
                  {roomType.value === 'Garage' && (
                    <span className="text-xs text-center text-muted-foreground mt-1">
                      (This is the number of garages. You'll select the number of vehicle stalls per garage later.)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => decrementRoomQuantity(roomType.value)}
                    disabled={getRoomQuantity(roomType.value) <= 0}
                    className="h-8 w-8 flex items-center justify-center"
                    aria-label={`Decrease ${roomType.label} quantity`}
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="0" 
                    value={getRoomQuantity(roomType.value)} 
                    onChange={(e) => handleRoomQuantityChange(roomType.value, parseInt(e.target.value) || 0)}
                    className="w-14 text-center h-8"
                    aria-label={`${roomType.label} quantity`}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => incrementRoomQuantity(roomType.value)}
                    className="h-8 w-8 flex items-center justify-center"
                    aria-label={`Increase ${roomType.label} quantity`}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add a Custom Space</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {!showCustomInput ? (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="roomType">Space Type</Label>
                <Select value={newRoomType} onValueChange={handleRoomTypeChange}>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select a space type" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedRoomTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Custom Space Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="customRoomType">Custom Space Type</Label>
                <div className="flex space-x-2">
                  <Input
                    id="customRoomType"
                    placeholder="e.g., Yoga Room, Workshop"
                    value={customRoomType}
                    onChange={(e) => setCustomRoomType(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCustomInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddRoom} disabled={(showCustomInput && customRoomType.trim() === '') || (!showCustomInput && !newRoomType)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Custom Space
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't added any spaces yet.</p>
              <p className="text-sm mt-2">Use the buttons above to add rooms to your project.</p>
            </div>
          ) : (
            <div>
              {rooms.map(room => (
                <RoomItem 
                  key={room.id} 
                  room={room} 
                  onEdit={updateRoom} 
                  onRemove={handleRemoveRoom} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
