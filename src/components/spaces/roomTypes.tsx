
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
  WashingMachine,
  Television,
  Spoon,
  Toilet
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
    value: 'Powder Room', 
    label: 'Powder Room',
    icon: <Toilet className="h-6 w-6" />
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
    value: 'Media Room', 
    label: 'Media Room',
    icon: <Television className="h-6 w-6" />
  },
  { 
    value: 'Scullery', 
    label: 'Scullery',
    icon: <Spoon className="h-6 w-6" />
  },
  { 
    value: 'Laundry', 
    label: 'Laundry',
    icon: <WashingMachine className="h-6 w-6" />
  },
];
