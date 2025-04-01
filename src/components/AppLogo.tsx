
import React from 'react';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-10 md:h-12'
  };
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/679db516-7bcb-4615-b61d-df2ce461c388.png" 
        alt="Northstar Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};
