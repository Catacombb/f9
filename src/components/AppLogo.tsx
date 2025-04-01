
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' | 'xlarge' }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-10 md:h-12',
    xlarge: 'h-14 md:h-16'
  };
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src={isDarkMode 
          ? "/lovable-uploads/0679123b-9830-4a7a-940f-f2cde6a6b8bf.png" 
          : "/lovable-uploads/81adeef4-57be-44d5-852f-e132204f107a.png"
        } 
        alt="Northstar Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};
