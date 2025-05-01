
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, UploadCloud, AlertTriangle } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

// Import the FileUploadHandler components
import { InspirationsUploader } from '@/components/uploads/InspirationsUploader';
import { SiteDocumentsUploader } from '@/components/uploads/SiteDocumentsUploader';
import { SupportingDocumentsUploader } from '@/components/uploads/SupportingDocumentsUploader';

export function UploadsSection() {
  const { setCurrentSection } = useDesignBrief();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevious = () => {
    setCurrentSection('communication');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('summary');
    window.scrollTo(0, 0);
  };

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Document Uploads" 
          description="Upload any documents or images that will help us understand your project better." 
          isBold={true} 
        />

        <div className="mb-6">
          <div className="bg-blueprint-50 border border-blueprint-200 p-4 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-black mt-0.5 mr-2 shrink-0" />
              <p className="text-black text-sm">
                If you don't have these documents, F9 Productions can obtain them on your behalf.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <InspirationsUploader />
          <SiteDocumentsUploader />
          <SupportingDocumentsUploader />
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Previous: Communication</span>
          </Button>
          
          <Button 
            onClick={handleNext} 
            className="group bg-yellow-500 hover:bg-yellow-600 text-black"
            disabled={isSubmitting}
          >
            <span className="font-bold">Next: Summary</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
