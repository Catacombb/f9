import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="font-inter h-full w-full overflow-hidden">
        {children}
      </div>
    </NextThemesProvider>
  );
};

// Export the useTheme hook directly from next-themes
export { useTheme } from 'next-themes';
