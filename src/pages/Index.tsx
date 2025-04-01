
import React from 'react';
import { DesignBrief } from '@/components/DesignBrief';
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <DesignBriefProvider>
        <DesignBrief />
      </DesignBriefProvider>
    </ThemeProvider>
  );
};

export default Index;
