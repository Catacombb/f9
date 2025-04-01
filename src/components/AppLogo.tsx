
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-10 md:h-12'
  };
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src={isDarkMode 
          ? "/lovable-uploads/70d2354a-6971-4612-ada4-f1277078f209.png" 
          : "/lovable-uploads/679db516-7bcb-4615-b61d-df2ce461c388.png"
        } 
        alt="Northstar Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};
