import React from 'react';
import { DesignBrief } from '@/components/DesignBrief';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useParams } from 'react-router-dom';

const Index = () => {
  // Get projectId from URL if available
  const { projectId } = useParams();
  
  return (
    <ThemeProvider>
      <DesignBrief projectId={projectId} />
    </ThemeProvider>
  );
};

export default Index;
