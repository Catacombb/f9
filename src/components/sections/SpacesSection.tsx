import React, { useState, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpaceRoom } from '@/types';
import { GeneralQuestionsTab } from '../spaces/GeneralQuestionsTab';
import { RoomSelectionTab } from '../spaces/RoomSelectionTab';
import { predefinedRoomTypes } from '../spaces/roomTypes';

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
  const [activeTab, setActiveTab] = useState("rooms");
  
  const [generalAnswers, setGeneralAnswers] = useState({
    mustHaveFeatures: formData.spaces.specialSpaces || [],
    lessImportantSpaces: '',
    homeSize: '',
    roomArrangement: '',
    singleLevelLiving: '',
    levelPreference: ''
  });
  
  const rooms = formData.spaces.rooms;
  
  useEffect(() => {
    const uniqueRoomTypes = Array.from(new Set(predefinedRoomTypes.map(rt => rt.value)));
    
    const initialRoomsWithQuantities = uniqueRoomTypes.map(type => {
      const roomsOfType = rooms.filter(room => room.type === type);
      const totalQuantity = roomsOfType.reduce((sum, room) => sum + (room.quantity || 0), 0);
      return { type, quantity: totalQuantity };
    });
    
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
    
    if (formData.spaces.specialSpaces) {
      setGeneralAnswers(prev => ({ ...prev, mustHaveFeatures: formData.spaces.specialSpaces }));
    }
    if (formData.spaces.storageNeeds) {
      setGeneralAnswers(prev => ({ ...prev, lessImportantSpaces: formData.spaces.storageNeeds }));
    }
    if (formData.spaces.spatialRelationships) {
      setGeneralAnswers(prev => ({ ...prev, roomArrangement: formData.spaces.spatialRelationships }));
    }
    if (formData.spaces.accessibilityNeeds) {
      setGeneralAnswers(prev => ({ ...prev, singleLevelLiving: formData.spaces.accessibilityNeeds }));
    }
    if (formData.spaces.spacesNotes) {
      setGeneralAnswers(prev => ({ ...prev, homeSize: formData.spaces.spacesNotes }));
    }
  }, [rooms, formData.spaces]);
  
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
  
  const handleGeneralAnswersChange = (field: string, value: any) => {
    setGeneralAnswers(prev => ({ ...prev, [field]: value }));
    
    const formDataUpdates: any = {};
    
    if (field === 'mustHaveFeatures') {
      formDataUpdates.specialSpaces = value;
    } else if (field === 'lessImportantSpaces') {
      formDataUpdates.storageNeeds = value;
    } else if (field === 'roomArrangement') {
      formDataUpdates.spatialRelationships = value;
    } else if (field === 'singleLevelLiving') {
      formDataUpdates.accessibilityNeeds = value;
    } else if (field === 'homeSize') {
      formDataUpdates.spacesNotes = value;
    }
    
    updateFormData('spaces', formDataUpdates);
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
    } 
    else if (existingRooms.length === 1) {
      if (quantity > 0) {
        updateRoom({
          ...existingRooms[0],
          quantity
        });
      } else {
        removeRoom(existingRooms[0].id);
      }
    } 
    else if (existingRooms.length > 1) {
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
  
  const handleFeatureToggle = (feature: string) => {
    const features = generalAnswers.mustHaveFeatures || [];
    const updatedFeatures = features.includes(feature) 
      ? features.filter(f => f !== feature)
      : [...features, feature];
    
    handleGeneralAnswersChange('mustHaveFeatures', updatedFeatures);
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="rooms">Room Spaces</TabsTrigger>
              <TabsTrigger value="general">General Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms">
              <RoomSelectionTab
                rooms={rooms}
                roomsWithQuantities={roomsWithQuantities}
                newRoomType={newRoomType}
                customRoomType={customRoomType}
                showCustomInput={showCustomInput}
                handleRoomTypeChange={handleRoomTypeChange}
                setCustomRoomType={setCustomRoomType}
                setShowCustomInput={setShowCustomInput}
                handleAddRoom={handleAddRoom}
                getRoomQuantity={getRoomQuantity}
                incrementRoomQuantity={incrementRoomQuantity}
                decrementRoomQuantity={decrementRoomQuantity}
                handleRoomQuantityChange={handleRoomQuantityChange}
                updateRoom={updateRoom}
                handleRemoveRoom={handleRemoveRoom}
              />
            </TabsContent>
            
            <TabsContent value="general">
              <GeneralQuestionsTab
                generalAnswers={generalAnswers}
                handleGeneralAnswersChange={handleGeneralAnswersChange}
                handleFeatureToggle={handleFeatureToggle}
              />
            </TabsContent>
          </Tabs>
          
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
