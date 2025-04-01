
import React from 'react';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-10 md:h-12'
  };
  
  const textSizeClasses = {
    small: 'text-xl md:text-2xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  };
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/70d2354a-6971-4612-ada4-f1277078f209.png" 
        alt="Northstar Logo" 
        className={`${sizeClasses[size]}`}
      />
      {/* Remove the text span since it's included in the logo */}
    </div>
  );
};
