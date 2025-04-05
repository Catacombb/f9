
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('room-selection');
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  
  const handleRoomsChange = (rooms: SpaceRoom[]) => {
    updateFormData('spaces', { rooms });
  };
  
  const handleAdditionalNotesChange = (notes: string) => {
    updateFormData('spaces', { additionalNotes: notes });
  };
  
  const handleHomeLevelTypeChange = (value: string) => {
    updateFormData('spaces', { homeLevelType: value });
  };
  
  const handleLevelAssignmentChange = (roomType: string, level: string) => {
    const currentAssignments = formData.spaces.levelAssignments || {};
    updateFormData('spaces', { 
      levelAssignments: {
        ...currentAssignments,
        [roomType]: level
      }
    });
  };
  
  const handleLevelAssignmentNotesChange = (notes: string) => {
    updateFormData('spaces', { levelAssignmentNotes: notes });
  };
  
  const handlePrevious = () => {
    setCurrentSection('site');
  };
  
  const handleNext = () => {
    setCurrentSection('architecture');
  };
  
  // Get unique room types with quantities for level assignments
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="room-selection">
              Room Selection
            </TabsTrigger>
            <TabsTrigger value="level-preference">
              Level Preferences
            </TabsTrigger>
            <TabsTrigger value="general-questions">
              General Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="room-selection" className="mt-0">
            <RoomSelectionTab
              rooms={formData.spaces.rooms}
              onRoomsChange={handleRoomsChange}
            />
          </TabsContent>
          
          <TabsContent value="level-preference" className="mt-0">
            <LevelPreferenceTab
              homeLevelType={formData.spaces.homeLevelType}
              levelAssignments={formData.spaces.levelAssignments}
              levelAssignmentNotes={formData.spaces.levelAssignmentNotes}
              roomsWithQuantities={roomsWithQuantities}
              onHomeLevelTypeChange={handleHomeLevelTypeChange}
              onLevelAssignmentChange={handleLevelAssignmentChange}
              onLevelAssignmentNotesChange={handleLevelAssignmentNotesChange}
            />
          </TabsContent>
          
          <TabsContent value="general-questions" className="mt-0">
            <GeneralQuestionsTab
              additionalNotes={formData.spaces.additionalNotes}
              onAdditionalNotesChange={handleAdditionalNotesChange}
            />
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
