
import React from 'react';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' | 'xlarge' }) => {
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-12 md:h-14',
    xlarge: 'h-14 md:h-16'
  };
  
  return (
    <div className="flex items-center justify-center w-full">
      <img 
        src="https://f9productions.com/wp-content/uploads/2023/01/cropped-logo-3.png" 
        alt="F9 Productions Logo" 
        className={`${sizeClasses[size]}`} 
      />
    </div>
  );
};
