
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusCircle, X, Trash2, GripVertical, MoveHorizontal, ArrowRightLeft } from 'lucide-react';
import { SpaceRoom, ProximityPair } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

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

// SortableRoomItem component
const SortableRoomItem = ({ room, onEdit, onRemove }: { 
  room: SpaceRoom, 
  onEdit: (room: SpaceRoom) => void,
  onRemove: (id: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: room.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="cursor-move mr-2" {...attributes} {...listeners}>
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">
              {room.isCustom ? room.type : room.type}
            </CardTitle>
          </div>
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

// ProximityPairItem component
const ProximityPairItem = ({ 
  pair, 
  rooms, 
  onUpdate, 
  onRemove 
}: { 
  pair: ProximityPair, 
  rooms: SpaceRoom[], 
  onUpdate: (pair: ProximityPair) => void, 
  onRemove: (id: string) => void 
}) => {
  const room1 = rooms.find(r => r.id === pair.space1Id);
  const room2 = rooms.find(r => r.id === pair.space2Id);

  if (!room1 || !room2) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-2 bg-muted p-3 rounded-md">
      <div className="flex-1 font-medium">{room1.type}</div>
      <div className="flex items-center">
        <ArrowRightLeft className="h-5 w-5 mx-2" />
        <Select 
          value={pair.relation} 
          onValueChange={(value: 'close' | 'far') => onUpdate({ ...pair, relation: value })}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Relation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="close">Close</SelectItem>
            <SelectItem value="far">Far</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 font-medium text-right">{room2.type}</div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(pair.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const SpacesSection = () => {
  const { 
    formData, 
    addRoom, 
    updateRoom, 
    removeRoom, 
    addProximityPair, 
    updateProximityPair, 
    removeProximityPair, 
    updateFormData, 
    setCurrentSection 
  } = useDesignBrief();
  
  const [newRoomType, setNewRoomType] = useState('');
  const [customRoomType, setCustomRoomType] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const [space1Id, setSpace1Id] = useState('');
  const [space2Id, setSpace2Id] = useState('');
  const [proximityRelation, setProximityRelation] = useState<'close' | 'far'>('close');
  
  const rooms = formData.spaces.rooms;
  const proximitySettings = formData.spaces.proximitySettings;
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = rooms.findIndex((room) => room.id === active.id);
      const newIndex = rooms.findIndex((room) => room.id === over.id);
      
      const newRooms = arrayMove(rooms, oldIndex, newIndex);
      updateFormData('spaces', { rooms: newRooms });
    }
  };
  
  const handleAddProximityPair = () => {
    if (space1Id && space2Id && space1Id !== space2Id) {
      // Check if this pair already exists
      const pairExists = proximitySettings.some(
        p => (p.space1Id === space1Id && p.space2Id === space2Id) || 
             (p.space1Id === space2Id && p.space2Id === space1Id)
      );
      
      if (pairExists) {
        toast({
          title: "Proximity Already Set",
          description: "This relationship is already defined.",
          variant: "destructive",
        });
        return;
      }
      
      addProximityPair({
        space1Id,
        space2Id,
        relation: proximityRelation
      });
      
      setSpace1Id('');
      setSpace2Id('');
      setProximityRelation('close');
      
      toast({
        title: "Proximity Setting Added",
        description: "The space relationship has been added to your brief.",
      });
    } else {
      toast({
        title: "Invalid Selection",
        description: "Please select two different spaces.",
        variant: "destructive",
      });
    }
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
        <h1 className="design-brief-section-title">Spaces</h1>
        <p className="design-brief-section-description">
          Define the spaces you need in your home, including quantities and special requirements.
        </p>
        
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
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={rooms.map(room => room.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {rooms.map(room => (
                      <SortableRoomItem 
                        key={room.id} 
                        room={room} 
                        onEdit={updateRoom} 
                        onRemove={handleRemoveRoom} 
                      />
                    ))}
                  </SortableContext>
                </DndContext>
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
          
          {/* Proximity Settings Section */}
          {rooms.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Space Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Display existing proximity settings */}
                  {proximitySettings.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Relationships</Label>
                      <div className="space-y-2 mt-2">
                        {proximitySettings.map(pair => (
                          <ProximityPairItem 
                            key={pair.id} 
                            pair={pair} 
                            rooms={rooms} 
                            onUpdate={updateProximityPair} 
                            onRemove={removeProximityPair} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add new proximity setting */}
                  <div className="space-y-4">
                    <Label>Add New Relationship</Label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="space1">First Space</Label>
                        <Select value={space1Id} onValueChange={setSpace1Id}>
                          <SelectTrigger id="space1">
                            <SelectValue placeholder="Select a space" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map(room => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <Select value={proximityRelation} onValueChange={(value: 'close' | 'far') => setProximityRelation(value)}>
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="close">Close To</SelectItem>
                            <SelectItem value="far">Far From</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="space2">Second Space</Label>
                        <Select value={space2Id} onValueChange={setSpace2Id}>
                          <SelectTrigger id="space2">
                            <SelectValue placeholder="Select a space" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map(room => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={handleAddProximityPair}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
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
};
