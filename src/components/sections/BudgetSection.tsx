
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function BudgetSection() {
  const { setCurrentSection } = useDesignBrief();

  const handlePrevious = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('communication');
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Budget & Timeline" 
        description="Provide information about your project budget and timeline expectations."
      />
      
      <div className="space-y-6">
        {/* Budget content will be added here */}
        <div className="py-8 text-center text-muted-foreground">
          <p>Budget and timeline content to be completed.</p>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevious} className="group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Previous: Project Team</span>
        </Button>
        
        <Button onClick={handleNext} className="group">
          <span>Next: Communication</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
