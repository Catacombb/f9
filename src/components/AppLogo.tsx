
import React from 'react';
import { Compass } from 'lucide-react';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  };
  
  const iconSizes = {
    small: { width: 20, height: 20 },
    default: { width: 28, height: 28 },
    large: { width: 36, height: 36 }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Compass 
        className="text-primary" 
        width={iconSizes[size].width} 
        height={iconSizes[size].height} 
      />
      <span className={`font-bold ${sizeClasses[size]}`}>
        Northstar
      </span>
    </div>
  );
};
