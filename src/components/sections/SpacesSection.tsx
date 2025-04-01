
import React, { useState, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Bed, Bath, Sofa, BookOpen, ShoppingBag, Car, Utensils } from 'lucide-react';
import { SpaceRoom } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { SectionHeader } from '@/components/sections/SectionHeader';

const predefinedRoomTypes = [
  { value: 'Bedroom', label: 'Bedroom', icon: <Bed className="h-4 w-4 mr-2" /> },
  { value: 'Bathroom', label: 'Bathroom', icon: <Bath className="h-4 w-4 mr-2" /> },
  { value: 'Living Room', label: 'Living Room', icon: <Sofa className="h-4 w-4 mr-2" /> },
  { value: 'Kitchen', label: 'Kitchen', icon: <Utensils className="h-4 w-4 mr-2" /> },
  { value: 'Dining Area', label: 'Dining Area', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
  { value: 'Office/Study', label: 'Office/Study', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { value: 'Garage', label: 'Garage', icon: <Car className="h-4 w-4 mr-2" /> },
];

const RoomItem = ({ 
  room, 
  onEdit, 
  onRemove 
}: { 
  room: SpaceRoom, 
  onEdit: (room: SpaceRoom) => void,
  onRemove: (id: string) => void 
}) => {
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onEdit({ ...room, quantity });
    }
  };

  const handleDescriptionChange = (value: string) => {
    onEdit({ ...room, description: value });
  };

  return (
    <div className="mb-4">
      <Card>
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {room.isCustom ? room.type : room.type}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onRemove(room.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <Label htmlFor={`quantity-${room.id}`}>Quantity</Label>
            <Input
              id={`quantity-${room.id}`}
              type="number"
              min="1"
              value={room.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor={`description-${room.id}`}>Special Requirements</Label>
            <Textarea
              id={`description-${room.id}`}
              placeholder="Describe any special requirements for this space..."
              value={room.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function SpacesSection() {
  const { 
    formData, 
    addRoom, 
    updateRoom, 
    removeRoom, 
    updateFormData, 
    setCurrentSection 
  } = useDesignBrief();
  
  const [newRoomType, setNewRoomType] = useState('');
  const [customRoomType, setCustomRoomType] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [roomsWithQuantities, setRoomsWithQuantities] = useState<{ type: string; quantity: number }[]>([]);
  
  const rooms = formData.spaces.rooms;
  
  useEffect(() => {
    const uniqueRoomTypes = Array.from(new Set(rooms.map(room => room.type)));
    
    const initialRoomsWithQuantities = uniqueRoomTypes.map(type => {
      const roomsOfType = rooms.filter(room => room.type === type);
      const totalQuantity = roomsOfType.reduce((sum, room) => sum + room.quantity, 0);
      return { type, quantity: totalQuantity };
    });
    
    setRoomsWithQuantities(initialRoomsWithQuantities);
  }, [rooms]);
  
  const handleAddRoom = () => {
    if ((showCustomInput && customRoomType.trim() !== '') || 
        (!showCustomInput && newRoomType !== '')) {
      const roomType = showCustomInput ? customRoomType.trim() : newRoomType;
      
      addRoom({
        type: roomType,
        quantity: 1,
        description: '',
        isCustom: showCustomInput
      });
      
      setNewRoomType('');
      setCustomRoomType('');
      setShowCustomInput(false);
      
      toast({
        title: "Space Added",
        description: `Added ${roomType} to your spaces.`,
      });
    }
  };
  
  const handleRemoveRoom = (id: string) => {
    removeRoom(id);
    toast({
      title: "Space Removed",
      description: "The space has been removed from your brief.",
    });
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData('spaces', { additionalNotes: e.target.value });
  };
  
  const handleRoomTypeChange = (value: string) => {
    setNewRoomType(value);
    setShowCustomInput(value === 'Other');
  };
  
  const handleRoomQuantityChange = (type: string, quantity: number) => {
    setRoomsWithQuantities(prev => 
      prev.map(room => 
        room.type === type ? { ...room, quantity } : room
      )
    );
    
    const existingRooms = rooms.filter(room => room.type === type);
    
    if (existingRooms.length === 0 && quantity > 0) {
      addRoom({
        type,
        quantity,
        description: '',
        isCustom: !predefinedRoomTypes.some(rt => rt.value === type)
      });
    } else if (existingRooms.length === 1) {
      if (quantity > 0) {
        updateRoom({
          ...existingRooms[0],
          quantity
        });
      } else {
        removeRoom(existingRooms[0].id);
      }
    } else if (existingRooms.length > 1) {
      if (quantity > 0) {
        updateRoom({
          ...existingRooms[0],
          quantity
        });
        
        existingRooms.slice(1).forEach(room => removeRoom(room.id));
      } else {
        existingRooms.forEach(room => removeRoom(room.id));
      }
    }
  };
  
  const getRoomQuantity = (type: string): number => {
    const roomMatch = roomsWithQuantities.find(r => r.type === type);
    return roomMatch ? roomMatch.quantity : 0;
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Spaces" 
          description="Tell us about the rooms and spaces you need in your home."
          isBold={true}
        />
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Room Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select the types of rooms you need and specify how many of each.
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {predefinedRoomTypes.map(roomType => (
                  <div 
                    key={roomType.value} 
                    className="flex items-center border rounded-md p-3 space-x-2"
                  >
                    {roomType.icon}
                    <span className="flex-grow">{roomType.label}</span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRoomQuantityChange(roomType.value, Math.max(0, getRoomQuantity(roomType.value) - 1))}
                        disabled={getRoomQuantity(roomType.value) <= 0}
                        className="h-8 w-8"
                      >
                        -
                      </Button>
                      <Input 
                        type="number" 
                        min="0" 
                        value={getRoomQuantity(roomType.value)} 
                        onChange={(e) => handleRoomQuantityChange(roomType.value, parseInt(e.target.value) || 0)}
                        className="w-16 text-center h-8"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRoomQuantityChange(roomType.value, getRoomQuantity(roomType.value) + 1)}
                        className="h-8 w-8"
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
                              <span>{type.label}</span>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Space Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes about your spaces here..."
                value={formData.spaces.additionalNotes}
                onChange={handleNotesChange}
                rows={4}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentSection('site')}
            >
              Previous: Site
            </Button>
            <Button
              onClick={() => setCurrentSection('architecture')}
            >
              Next: Architecture
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
