
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
      <div className={`font-heading font-bold text-charcoal-800 dark:text-white ${sizeClasses[size] === 'small' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
        F9 <span className="text-blueprint-500">PRODUCTIONS</span>
      </div>
    </div>
  );
};
