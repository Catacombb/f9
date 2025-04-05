
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { RoomSelectionTab } from '@/components/spaces/RoomSelectionTab';
import { GeneralQuestionsTab } from '@/components/spaces/GeneralQuestionsTab';
import { LevelPreferenceTab } from '@/components/spaces/LevelPreferenceTab';
import { SpaceRoom } from '@/types';

export function SpacesSection() {
  const [activeTab, setActiveTab] = useState('level-preference');
  const { formData, updateFormData, setCurrentSection, addRoom, updateRoom, removeRoom } = useDesignBrief();
  const [newRoomType, setNewRoomType] = useState('');
  const [customRoomType, setCustomRoomType] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Room quantity management
  const [roomQuantities, setRoomQuantities] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    // Initialize room quantities from existing rooms
    const quantities: {[key: string]: number} = {};
    formData.spaces.rooms.forEach(room => {
      quantities[room.type] = (quantities[room.type] || 0) + 1;
    });
    setRoomQuantities(quantities);
  }, [formData.spaces.rooms]);
  
  const handleRoomTypeChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomInput(true);
      setNewRoomType('Other');
    } else {
      setNewRoomType(value);
    }
  };
  
  const handleAddRoom = () => {
    const roomType = showCustomInput ? customRoomType : newRoomType;
    if (roomType) {
      addRoom({
        type: roomType,
        quantity: 1,
        description: '',
        isCustom: showCustomInput,
        customName: showCustomInput ? customRoomType : undefined
      });
      
      // Reset form state
      setNewRoomType('');
      setCustomRoomType('');
      setShowCustomInput(false);
    }
  };
  
  const handleRemoveRoom = (id: string) => {
    removeRoom(id);
  };
  
  const getRoomQuantity = (type: string): number => {
    return roomQuantities[type] || 0;
  };
  
  const incrementRoomQuantity = (type: string) => {
    setRoomQuantities(prev => {
      const updatedQuantities = {
        ...prev,
        [type]: (prev[type] || 0) + 1
      };
      
      // Add a new room of this type
      addRoom({
        type: type,
        quantity: 1,
        description: '',
        isCustom: false
      });
      
      return updatedQuantities;
    });
  };
  
  const decrementRoomQuantity = (type: string) => {
    if (roomQuantities[type] > 0) {
      setRoomQuantities(prev => {
        const updatedQuantities = {
          ...prev,
          [type]: prev[type] - 1
        };
        
        // Remove the last room of this type
        const roomsOfType = formData.spaces.rooms.filter(r => r.type === type);
        if (roomsOfType.length > 0) {
          removeRoom(roomsOfType[roomsOfType.length - 1].id);
        }
        
        return updatedQuantities;
      });
    }
  };
  
  const handleRoomQuantityChange = (type: string, quantity: number) => {
    const currentQuantity = getRoomQuantity(type);
    const diff = quantity - currentQuantity;
    
    setRoomQuantities(prev => ({
      ...prev,
      [type]: Math.max(0, quantity)
    }));
    
    // Add or remove rooms based on quantity change
    if (diff > 0) {
      // Add rooms
      for (let i = 0; i < diff; i++) {
        addRoom({
          type: type,
          quantity: 1,
          description: '',
          isCustom: false
        });
      }
    } else if (diff < 0) {
      // Remove rooms
      const roomsOfType = formData.spaces.rooms.filter(r => r.type === type);
      const roomsToRemove = roomsOfType.slice(roomsOfType.length + diff);
      roomsToRemove.forEach(room => {
        removeRoom(room.id);
      });
    }
  };
  
  const handleAdditionalNotesChange = (notes: string) => {
    updateFormData('spaces', { additionalNotes: notes });
  };

  const handleEliminableSpacesChange = (notes: string) => {
    updateFormData('spaces', { eliminableSpaces: notes });
  };

  const handleHomeSizeChange = (notes: string) => {
    updateFormData('spaces', { homeSize: notes });
  };
  
  const handleHomeLevelTypeChange = (value: string) => {
    updateFormData('spaces', { homeLevelType: value });
    
    // Automatically move to the next tab when level preference is selected
    if (value && activeTab === 'level-preference') {
      setTimeout(() => {
        setActiveTab('room-selection');
      }, 500); // Half-second delay for better UX
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handlePrevious = () => {
    setCurrentSection('site');
    window.scrollTo(0, 0);
  };
  
  const handleNext = () => {
    setCurrentSection('architecture');
    window.scrollTo(0, 0);
  };
  
  // Get unique room types with quantities
  const roomsWithQuantities = formData.spaces.rooms.reduce((acc: { type: string; quantity: number }[], room) => {
    const existingRoom = acc.find(r => r.type === room.type);
    if (existingRoom) {
      existingRoom.quantity++;
    } else {
      acc.push({ type: room.type, quantity: 1 });
    }
    return acc;
  }, []);
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Spaces" 
          description="Tell us about the spaces you want to include in your project."
          isBold={true}
        />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="level-preference">
              Level Preferences
            </TabsTrigger>
            <TabsTrigger value="room-selection">
              Room Selection
            </TabsTrigger>
            <TabsTrigger value="general-questions">
              General Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="level-preference" className="mt-0">
            <LevelPreferenceTab
              homeLevelType={formData.spaces.homeLevelType}
              onHomeLevelTypeChange={handleHomeLevelTypeChange}
            />
            
            {/* Add a "Continue to Room Selection" button at the bottom of this tab */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setActiveTab('room-selection')}
                className="group"
              >
                <span>Continue to Room Selection</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="room-selection" className="mt-0">
            <RoomSelectionTab
              rooms={formData.spaces.rooms}
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
            
            {/* Add navigation buttons between tabs */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab('level-preference')}
                className="group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Level Preferences</span>
              </Button>
              
              <Button
                onClick={() => setActiveTab('general-questions')}
                className="group"
              >
                <span>Continue to General Questions</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="general-questions" className="mt-0">
            <GeneralQuestionsTab
              additionalNotes={formData.spaces.additionalNotes || ''}
              eliminableSpaces={formData.spaces.eliminableSpaces}
              homeSize={formData.spaces.homeSize}
              onAdditionalNotesChange={handleAdditionalNotesChange}
              onEliminableSpacesChange={handleEliminableSpacesChange}
              onHomeSizeChange={handleHomeSizeChange}
            />
            
            {/* Add a back button to Room Selection */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab('room-selection')}
                className="group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Room Selection</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Site</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Architecture</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
