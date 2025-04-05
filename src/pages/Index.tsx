
import React from 'react';
import { DesignBrief } from '@/components/DesignBrief';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  return (
    <ThemeProvider>
      <DesignBrief />
    </ThemeProvider>
  );
};

export default Index;
