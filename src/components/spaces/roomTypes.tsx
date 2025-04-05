
import React from 'react';
import { 
  Bed, 
  Bath, 
  Utensils, 
  Sofa, 
  Car, 
  Briefcase, 
  Warehouse, 
  Dumbbell, 
  Wine, 
  BookOpen, 
  TentTree,
  PlayCircle,
  WashingMachine
} from 'lucide-react';

export const predefinedRoomTypes = [
  { 
    value: 'Bedroom', 
    label: 'Bedroom',
    icon: <Bed className="h-6 w-6" />
  },
  { 
    value: 'Bathroom', 
    label: 'Bathroom',
    icon: <Bath className="h-6 w-6" />
  },
  { 
    value: 'Kitchen', 
    label: 'Kitchen',
    icon: <Utensils className="h-6 w-6" />
  },
  { 
    value: 'Living Room', 
    label: 'Living Room',
    icon: <Sofa className="h-6 w-6" />
  },
  { 
    value: 'Garage', 
    label: 'Garage',
    icon: <Car className="h-6 w-6" />
  },
  { 
    value: 'Office', 
    label: 'Office',
    icon: <Briefcase className="h-6 w-6" />
  },
  { 
    value: 'Storage', 
    label: 'Storage',
    icon: <Warehouse className="h-6 w-6" />
  },
  { 
    value: 'Gym', 
    label: 'Gym',
    icon: <Dumbbell className="h-6 w-6" />
  },
  { 
    value: 'Bar', 
    label: 'Bar',
    icon: <Wine className="h-6 w-6" />
  },
  { 
    value: 'Library', 
    label: 'Library',
    icon: <BookOpen className="h-6 w-6" />
  },
  { 
    value: 'Outdoor', 
    label: 'Outdoor',
    icon: <TentTree className="h-6 w-6" />
  },
  { 
    value: 'Entertainment', 
    label: 'Entertainment',
    icon: <PlayCircle className="h-6 w-6" />
  },
  { 
    value: 'Laundry', 
    label: 'Laundry',
    icon: <WashingMachine className="h-6 w-6" />
  },
];
