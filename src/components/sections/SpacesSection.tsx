import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { SpaceRoom } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { SectionHeader } from '@/components/ui/section-header';

// Predefined room types
const predefinedRoomTypes = [
  'Bedroom',
  'Bathroom',
  'Living Room',
  'Kitchen',
  'Dining Area',
  'Office/Study',
  'Laundry',
  'Garage',
  'Utility Room',
  'Playroom',
  'Media Room',
  'Other'
];

// RoomItem component
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
  
  const rooms = formData.spaces.rooms;
  
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
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Spaces" 
          description="Tell us about the rooms and spaces you need in your home."
          isBold={true}
        />
        
        <div className="space-y-8">
          {/* Room List Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Spaces</CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't added any spaces yet.</p>
                  <p className="text-sm mt-2">Start by adding bedrooms, bathrooms, and other spaces below.</p>
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
          
          {/* Add Room Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add a Space</CardTitle>
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
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
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
                Add Space
              </Button>
            </CardFooter>
          </Card>
          
          {/* Additional Notes */}
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
          
          {/* Navigation Buttons */}
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
