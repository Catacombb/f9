
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function ArchitectureSection() {
  const { setCurrentSection } = useDesignBrief();

  const handlePrevious = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('contractors');
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* Architecture section content */}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevious} className="group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Previous: Spaces</span>
        </Button>
        
        <Button onClick={handleNext} className="group">
          <span>Next: Project Team</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
