
import React, { useState, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Bed, Bath, Sofa, BookOpen, ShoppingBag, Car, Utensils, Toilet } from 'lucide-react';
import { SpaceRoom } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { SectionHeader } from '@/components/sections/SectionHeader';

const predefinedRoomTypes = [
  { value: 'Bedroom', label: 'Bedroom', icon: <Bed className="h-5 w-5" /> },
  { value: 'Bathroom', label: 'Bathroom', icon: <Bath className="h-5 w-5" /> },
  { value: 'Powder', label: 'Powder', icon: <Toilet className="h-5 w-5" /> },
  { value: 'Living', label: 'Living', icon: <Sofa className="h-5 w-5" /> },
  { value: 'Kitchen', label: 'Kitchen', icon: <Utensils className="h-5 w-5" /> },
  { value: 'Dining', label: 'Dining', icon: <ShoppingBag className="h-5 w-5" /> },
  { value: 'Office', label: 'Office', icon: <BookOpen className="h-5 w-5" /> },
  { value: 'Garage', label: 'Garage', icon: <Car className="h-5 w-5" /> },
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
  
  // Initialize room quantities from existing rooms data
  useEffect(() => {
    const uniqueRoomTypes = Array.from(new Set(predefinedRoomTypes.map(rt => rt.value)));
    
    const initialRoomsWithQuantities = uniqueRoomTypes.map(type => {
      const roomsOfType = rooms.filter(room => room.type === type);
      const totalQuantity = roomsOfType.reduce((sum, room) => sum + (room.quantity || 0), 0);
      return { type, quantity: totalQuantity };
    });
    
    // Add any custom room types that are already in the data
    const customTypes = rooms
      .filter(room => !predefinedRoomTypes.some(pt => pt.value === room.type))
      .map(room => room.type);
    
    const uniqueCustomTypes = Array.from(new Set(customTypes));
    
    uniqueCustomTypes.forEach(type => {
      const roomsOfType = rooms.filter(room => room.type === type);
      const totalQuantity = roomsOfType.reduce((sum, room) => sum + (room.quantity || 0), 0);
      initialRoomsWithQuantities.push({ type, quantity: totalQuantity });
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
    // Update the roomsWithQuantities state for UI display
    setRoomsWithQuantities(prev => 
      prev.map(room => 
        room.type === type ? { ...room, quantity } : room
      )
    );
    
    const existingRooms = rooms.filter(room => room.type === type);
    
    // If there are no existing rooms of this type and quantity > 0, add a new room
    if (existingRooms.length === 0 && quantity > 0) {
      addRoom({
        type,
        quantity,
        description: '',
        isCustom: !predefinedRoomTypes.some(rt => rt.value === type)
      });
    } 
    // If there's exactly one room of this type, update its quantity
    else if (existingRooms.length === 1) {
      if (quantity > 0) {
        updateRoom({
          ...existingRooms[0],
          quantity
        });
      } else {
        // If quantity is 0, remove the room
        removeRoom(existingRooms[0].id);
      }
    } 
    // If there are multiple rooms of this type, consolidate them
    else if (existingRooms.length > 1) {
      if (quantity > 0) {
        // Update the first room to have the total quantity
        updateRoom({
          ...existingRooms[0],
          quantity
        });
        
        // Remove the other rooms of the same type
        existingRooms.slice(1).forEach(room => removeRoom(room.id));
      } else {
        // If quantity is 0, remove all rooms of this type
        existingRooms.forEach(room => removeRoom(room.id));
      }
    }
  };
  
  const getRoomQuantity = (type: string): number => {
    const roomMatch = roomsWithQuantities.find(r => r.type === type);
    return roomMatch ? roomMatch.quantity : 0;
  };
  
  const incrementRoomQuantity = (type: string) => {
    const currentQuantity = getRoomQuantity(type);
    handleRoomQuantityChange(type, currentQuantity + 1);
  };
  
  const decrementRoomQuantity = (type: string) => {
    const currentQuantity = getRoomQuantity(type);
    if (currentQuantity > 0) {
      handleRoomQuantityChange(type, currentQuantity - 1);
    }
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
