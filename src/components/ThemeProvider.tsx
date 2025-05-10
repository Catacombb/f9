import React from 'react';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The NextThemesProvider has been removed. 
  // The theme is effectively hardcoded to whatever your global CSS dictates (likely light).
  // If you re-introduce theme switching later, you can add a theme provider here.
  return (
    <div className="font-inter h-full w-full overflow-hidden">
      {children}
    </div>
  );
};

// The export of useTheme from 'next-themes' has been removed as the package is not installed.
// If you need theme-specific logic elsewhere, you'll need to implement it or install a theme provider.
