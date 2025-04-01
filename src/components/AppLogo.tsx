
import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const AppLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' | 'xlarge' }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const sizeClasses = {
    small: 'h-6 md:h-7',
    default: 'h-8 md:h-9',
    large: 'h-12 md:h-14',
    xlarge: 'h-14 md:h-16'
  };
  
  return (
    <div className="flex items-center justify-center w-full">
      <img 
        src={isDarkMode 
          ? "/lovable-uploads/3e4d3eb9-8d76-44ba-8a4a-15faf8837c49.png" // Dark mode logo
          : "/lovable-uploads/c36ffe10-cbba-49ee-9805-4661cfbb83a3.png" // New light mode logo
        } 
        alt="Northstar Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};
