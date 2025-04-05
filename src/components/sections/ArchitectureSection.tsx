
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

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
    <div className="space-y-6">
      <SectionHeader 
        title="Architectural Style & Features" 
        description="Provide details about your design preferences, materials, and special architectural features."
      />
      
      <div className="space-y-6">
        {/* Architecture content will be added here */}
        <div className="py-8 text-center text-muted-foreground">
          <p>Architecture preferences content to be completed.</p>
        </div>
      </div>
      
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
