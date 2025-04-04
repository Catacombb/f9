
import React from 'react';
import { Bed, Bath, Sofa, BookOpen, ShoppingBag, Car, Utensils, Toilet, Music, Dumbbell } from 'lucide-react';

export const predefinedRoomTypes = [
  { value: 'Bedroom', label: 'Bedroom', icon: <Bed className="h-5 w-5" /> },
  { value: 'Bathroom', label: 'Bathroom', icon: <Bath className="h-5 w-5" /> },
  { value: 'Powder', label: 'Powder Room', icon: <Toilet className="h-5 w-5" /> },
  { value: 'Living', label: 'Living Room', icon: <Sofa className="h-5 w-5" /> },
  { value: 'Kitchen', label: 'Kitchen', icon: <Utensils className="h-5 w-5" /> },
  { value: 'Dining', label: 'Dining Room', icon: <ShoppingBag className="h-5 w-5" /> },
  { value: 'Office', label: 'Office', icon: <BookOpen className="h-5 w-5" /> },
  { value: 'Garage', label: 'Garage', icon: <Car className="h-5 w-5" /> },
  { value: 'Media', label: 'Media Room', icon: <Music className="h-5 w-5" /> },
  { value: 'Library', label: 'Library', icon: <BookOpen className="h-5 w-5" /> },
  { value: 'Gym', label: 'Gym', icon: <Dumbbell className="h-5 w-5" /> },
];

export const featureOptions = [
  'Vaulted Ceilings',
  'Large Windows',
  'Built-in Storage',
  'Special Lighting',
  'Fireplace',
  'Heated Floors',
  'Walk-in Closets'
];
