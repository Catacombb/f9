import React from 'react';
import { DesignBrief } from '@/components/DesignBrief';
import { useParams } from 'react-router-dom';

const Index = () => {
  // Get briefId from URL if available
  const { briefId } = useParams();
  
  return <DesignBrief projectId={briefId} />;
};

export default Index;
