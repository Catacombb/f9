
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  const { setCurrentSection } = useDesignBrief();
  
  const handleContinue = () => {
    toast.info("Design brief completed successfully!");
    setCurrentSection('feedback');
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Previous</span>
      </Button>
      
      <Button
        onClick={handleContinue}
        className="bg-yellow-500 hover:bg-yellow-600 text-black"
      >
        Continue to Feedback Form
      </Button>
    </div>
  );
}
