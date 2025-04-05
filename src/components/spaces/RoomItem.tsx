
import React, { useState, useEffect } from 'react';
import { SpaceRoom } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { roomSpecificQuestions } from './roomQuestions';

interface RoomItemProps {
  room: SpaceRoom;
  onEdit: (room: SpaceRoom) => void;
  onRemove: (id: string) => void;
}

export const RoomItem = ({ room, onEdit, onRemove }: RoomItemProps) => {
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onEdit({ ...room, quantity });
    }
  };

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleDescriptionChange = (value: string) => {
    onEdit({ ...room, description: value });
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    
    // Convert answers object to a JSON string for storage
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
        // If description isn't valid JSON, use it as a notes field
        setAnswers({ notes: room.description });
      }
    }
  }, [room.description]);

  // Get the room type and look up corresponding questions
  const roomType = room.isCustom ? (room.customName || room.type) : room.type;
  const questions = roomSpecificQuestions[roomType as keyof typeof roomSpecificQuestions] || [];

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
            {room.isCustom && room.customName ? room.customName : room.type}
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
