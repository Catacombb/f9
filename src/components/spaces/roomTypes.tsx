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
  Monitor,
  UtensilsCrossed,
  Toilet,
  Shirt,
  DoorOpen,
  Package,
  LandPlot
} from 'lucide-react';

export const predefinedRoomTypes = [
  { 
    value: 'Bedroom', 
    label: 'Bedroom',
    icon: <Bed className="h-5 w-5" />
  },
  { 
    value: 'Bathroom', 
    label: 'Bathroom',
    icon: <Bath className="h-5 w-5" />
  },
  { 
    value: 'Kitchen', 
    label: 'Kitchen',
    icon: <Utensils className="h-5 w-5" />
  },
  { 
    value: 'Living Room', 
    label: 'Living Room',
    icon: <Sofa className="h-5 w-5" />
  },
  { 
    value: 'Dining Room', 
    label: 'Dining Room',
    icon: <Utensils className="h-5 w-5" />
  },
  { 
    value: 'Office', 
    label: 'Office',
    icon: <Briefcase className="h-5 w-5" />
  },
  { 
    value: 'Laundry', 
    label: 'Laundry',
    icon: <Shirt className="h-5 w-5" />
  },
  { 
    value: 'Garage', 
    label: 'Garage',
    icon: <Car className="h-5 w-5" />
  },
  { 
    value: 'Mudroom', 
    label: 'Mudroom',
    icon: <DoorOpen className="h-5 w-5" />
  },
  { 
    value: 'Pantry', 
    label: 'Pantry',
    icon: <Package className="h-5 w-5" />
  },
  { 
    value: 'Closet', 
    label: 'Closet',
    icon: <Shirt className="h-5 w-5" />
  },
  { 
    value: 'Basement', 
    label: 'Basement',
    icon: <LandPlot className="h-5 w-5" />
  }
];
