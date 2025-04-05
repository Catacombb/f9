
import React from 'react';
import { Button } from '@/components/ui/button';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="w-[100px]"
      >
        Previous
      </Button>
      
      <Button
        className="w-[100px]"
      >
        Finish
      </Button>
    </div>
  );
}
