
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="transition-all duration-200 active:scale-95"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform" />
        <span>Previous: Communication</span>
      </Button>
    </div>
  );
}
