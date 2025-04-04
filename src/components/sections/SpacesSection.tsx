import React, { useState, useEffect } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Bed, Bath, Sofa, BookOpen, ShoppingBag, Car, Utensils, Toilet, CheckCircle2, Music, Dumbbell, BookOpen as BookIcon } from 'lucide-react';
import { SpaceRoom } from '@/types';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const predefinedRoomTypes = [
  { value: 'Bedroom', label: 'Bedroom', icon: <Bed className="h-5 w-5" /> },
  { value: 'Bathroom', label: 'Bathroom', icon: <Bath className="h-5 w-5" /> },
  { value: 'Powder', label: 'Powder', icon: <Toilet className="h-5 w-5" /> },
  { value: 'Living', label: 'Living', icon: <Sofa className="h-5 w-5" /> },
  { value: 'Kitchen', label: 'Kitchen', icon: <Utensils className="h-5 w-5" /> },
  { value: 'Dining', label: 'Dining', icon: <ShoppingBag className="h-5 w-5" /> },
  { value: 'Office', label: 'Office', icon: <BookOpen className="h-5 w-5" /> },
  { value: 'Garage', label: 'Garage', icon: <Car className="h-5 w-5" /> },
  { value: 'Media', label: 'Media Room', icon: <Music className="h-5 w-5" /> },
  { value: 'Library', label: 'Library', icon: <BookIcon className="h-5 w-5" /> },
  { value: 'Gym', label: 'Gym', icon: <Dumbbell className="h-5 w-5" /> },
];

const roomSpecificQuestions = {
  Office: [
    {
      id: 'workFromHome',
      question: 'Do you work from home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'officeType',
          question: 'Do you need a dedicated office, shared space, or adaptable work area?',
          type: 'select',
          options: ['Dedicated Office', 'Shared Space', 'Adaptable Work Area']
        }
      ]
    }
  ],
  Kitchen: [
    {
      id: 'kitchenType',
      question: 'Should the kitchen be open and designed for social gatherings, or include high-performance appliances for serious cooking?',
      type: 'select',
      options: ['Social Gathering Space', 'Serious Cooking Space', 'Both']
    },
    {
      id: 'kitchenLayout',
      question: 'Do you envision a kitchen that is open to other spaces or enclosed and separate?',
      type: 'select',
      options: ['Open to Other Spaces', 'Enclosed and Separate']
    },
    {
      id: 'kitchenUse',
      question: 'Will it also be a place to eat, or just for food preparation?',
      type: 'select',
      options: ['Also for Eating', 'Just for Food Preparation', 'Both']
    }
  ],
  Living: [
    {
      id: 'entertainmentFocus',
      question: 'Is TV, movie viewing, or music a focus in your home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'entertainmentDesign',
          question: 'Should it be incorporated into the design?',
          type: 'boolean'
        },
        {
          id: 'entertainmentSpace',
          question: 'How does it relate to your living spaces?',
          type: 'select',
          options: ['Separate Space', 'Integrated with Living Areas']
        }
      ]
    },
    {
      id: 'acousticNeeds',
      question: 'Do you have any acoustic needs or large instruments to accommodate (e.g., piano, drums)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'instrumentDetails',
          question: 'What instruments do you need to accommodate?',
          type: 'text'
        }
      ]
    }
  ],
  Media: [
    {
      id: 'entertainmentFocus',
      question: 'Is TV, movie viewing, or music a focus in your home?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'entertainmentDesign',
          question: 'Should it be incorporated into the design?',
          type: 'boolean'
        },
        {
          id: 'entertainmentSpace',
          question: 'How does it relate to your living spaces?',
          type: 'select',
          options: ['Separate Space', 'Integrated with Living Areas']
        }
      ]
    },
    {
      id: 'acousticNeeds',
      question: 'Do you have any acoustic needs or large instruments to accommodate (e.g., piano, drums)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'instrumentDetails',
          question: 'What instruments do you need to accommodate?',
          type: 'text'
        }
      ]
    }
  ],
  Library: [
    {
      id: 'readingForPleasure',
      question: 'Do you enjoy reading for pleasure?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'readingSpace',
          question: 'Would you like a cozy reading nook or dedicated space for bookshelves?',
          type: 'select',
          options: ['Cozy Reading Nook', 'Dedicated Space for Bookshelves', 'Both']
        }
      ]
    }
  ],
  Gym: [
    {
      id: 'specialEquipment',
      question: 'Do you have any specialized equipment (e.g., exercise gear)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'equipmentStorage',
          question: 'Would you like dedicated storage or usage space for them?',
          type: 'select',
          options: ['Dedicated Storage', 'Usage Space', 'Both']
        }
      ]
    }
  ],
  Garage: [
    {
      id: 'specialEquipment',
      question: 'Do you have any specialized equipment (e.g., workshop tools, hobby supplies)?',
      type: 'boolean',
      conditionalQuestions: [
        {
          id: 'equipmentStorage',
          question: 'Would you like dedicated storage or usage space for them?',
          type: 'select',
          options: ['Dedicated Storage', 'Usage Space', 'Both']
        }
      ]
    }
  ]
};

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

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (questionId: string, value: any) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    
    const updatedDescription = JSON.stringify(updatedAnswers);
    onEdit({ ...room, description: updatedDescription });
  };

  useEffect(() => {
    if (room.description) {
      try {
        const parsedAnswers = JSON.parse(room.description);
        if (typeof parsedAnswers === 'object') {
          setAnswers(parsedAnswers);
        }
      } catch (e) {
        setAnswers({ notes: room.description });
      }
    }
  }, [room.description]);

  const questions = roomSpecificQuestions[room.type as keyof typeof roomSpecificQuestions] || [];

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'boolean':
        return (
          <div key={question.id} className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${room.id}-${question.id}`}>{question.question}</Label>
              <Switch
                id={`${room.id}-${question.id}`}
                checked={answers[question.id] === true}
                onCheckedChange={(checked) => handleAnswerChange(question.id, checked)}
              />
            </div>
            
            {answers[question.id] === true && question.conditionalQuestions && (
              <div className="ml-6 mt-2 space-y-3 border-l-2 border-gray-200 pl-4">
                {question.conditionalQuestions.map((conditionalQ: any) => renderQuestion(conditionalQ))}
              </div>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div key={question.id} className="flex flex-col space-y-2">
            <Label htmlFor={`${room.id}-${question.id}`}>{question.question}</Label>
            <Select 
              value={answers[question.id] || ''}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <SelectTrigger id={`${room.id}-${question.id}`}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'text':
        return (
          <div key={question.id} className="flex flex-col space-y-2">
            <Label htmlFor={`${room.id}-${question.id}`}>{question.question}</Label>
            <Input
              id={`${room.id}-${question.id}`}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        );
      
      default:
        return null;
    }
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
          
          {questions.length > 0 && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">Room-specific details:</h4>
              <div className="space-y-4">
                {questions.map(q => renderQuestion(q))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor={`notes-${room.id}`}>Any other special requirements</Label>
            <Textarea
              id={`notes-${room.id}`}
              placeholder="Describe any other special requirements for this space..."
              value={answers.notes || ''}
              onChange={(e) => handleAnswerChange('notes', e.target.value)}
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
  const [activeTab, setActiveTab] = useState("general");
  
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
  
  const featureOptions = [
    'Vaulted Ceilings',
    'Large Windows',
    'Built-in Storage',
    'Special Lighting',
    'Fireplace',
    'Heated Floors',
    'Walk-in Closets'
  ];
  
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
              <TabsTrigger value="general">General Questions</TabsTrigger>
              <TabsTrigger value="rooms">Room Selection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Space Planning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base">
                      What rooms and spaces do you want in your home?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Select the types of rooms below, then go to the "Room Selection" tab to add details.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base">
                      Include must-have features
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {featureOptions.map(feature => (
                        <Button
                          key={feature}
                          type="button"
                          variant={generalAnswers.mustHaveFeatures?.includes(feature) ? "default" : "outline"}
                          onClick={() => handleFeatureToggle(feature)}
                          className="flex items-center gap-1"
                        >
                          {generalAnswers.mustHaveFeatures?.includes(feature) && (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          {feature}
                        </Button>
                      ))}
                    </div>
                    <Input
                      placeholder="Other features (comma-separated)"
                      value={generalAnswers.mustHaveFeatures?.filter(f => !featureOptions.includes(f)).join(', ')}
                      onChange={(e) => {
                        const customFeatures = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
                        const standardFeatures = generalAnswers.mustHaveFeatures?.filter(f => featureOptions.includes(f)) || [];
                        handleGeneralAnswersChange('mustHaveFeatures', [...standardFeatures, ...customFeatures]);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base" htmlFor="lessImportantSpaces">
                      Are there any of these spaces that you would deem less important or could eliminate if budget were an issue?
                    </Label>
                    <Textarea
                      id="lessImportantSpaces"
                      placeholder="List any spaces that could be eliminated or reduced if needed..."
                      value={generalAnswers.lessImportantSpaces}
                      onChange={(e) => handleGeneralAnswersChange('lessImportantSpaces', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base" htmlFor="homeSize">
                      Do you have an idea of the final size of the home?
                    </Label>
                    <Input
                      id="homeSize"
                      placeholder="E.g., 200 square meters, two floors"
                      value={generalAnswers.homeSize}
                      onChange={(e) => handleGeneralAnswersChange('homeSize', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base" htmlFor="roomArrangement">
                      Do you have any preferences for how rooms should be arranged?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      For example, should the kitchen be separate from bedrooms, or should a home office be in a quiet area?
                    </p>
                    <Textarea
                      id="roomArrangement"
                      placeholder="Describe your preferences for room arrangements..."
                      value={generalAnswers.roomArrangement}
                      onChange={(e) => handleGeneralAnswersChange('roomArrangement', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base">
                      Is single-level living a priority for you?
                    </Label>
                    <RadioGroup
                      value={generalAnswers.singleLevelLiving}
                      onValueChange={(value) => handleGeneralAnswersChange('singleLevelLiving', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="singleLevel-yes" />
                        <Label htmlFor="singleLevel-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="singleLevel-no" />
                        <Label htmlFor="singleLevel-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {generalAnswers.singleLevelLiving === 'no' && (
                      <div className="pt-2">
                        <Label className="text-sm" htmlFor="levelPreference">
                          Which spaces would you prefer to be on the main level versus an upper or lower level?
                        </Label>
                        <Textarea
                          id="levelPreference"
                          placeholder="E.g., Bedrooms upstairs, living areas on main level..."
                          value={generalAnswers.levelPreference}
                          onChange={(e) => handleGeneralAnswersChange('levelPreference', e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-6">
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
