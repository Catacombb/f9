
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Clipboard, PenLine, Share, AlertTriangle, MessageCircle } from 'lucide-react';
import { TesterNotePopup } from '@/components/Testers/TesterNotePopup';

export function IntroSection() {
  const { setCurrentSection } = useDesignBrief();
  const [showTesterPopup, setShowTesterPopup] = useState(true);
  
  // Effect to ensure popup shows every time this component mounts
  useEffect(() => {
    setShowTesterPopup(true);
  }, []);
  
  const handleStart = () => {
    setCurrentSection('projectInfo');
  };
  
  const handleClosePopup = () => {
    setShowTesterPopup(false);
  };
  
  return <div className="design-brief-section-wrapper">
      <TesterNotePopup isOpen={showTesterPopup} onClose={handleClosePopup} />
      <div className="design-brief-section-container">
        {/* Header Section with Blueprint Grid Background */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 blueprint-grid-bg -z-10"></div>
          
          <div className="py-8 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 font-heading text-charcoal-800 dark:text-gray-200">
              Design Brief
            </h1>
            
            <div className="text-base text-muted-foreground max-w-2xl mx-auto space-y-4 animate-fade-in">
              <p className="text-lg font-medium">Your input shapes our design process.</p>
              
              <p>This brief helps us understand your needs and expectations before we begin the design-build process. The more specific you are, the better we can tailor our solutions to your project requirements.</p>
              
              <p>Feel free to skip any questions that don't apply to your project, but try to be as thorough as possible with the ones that do.</p>
              
              <p>Let's get started.</p>
            </div>
          </div>
        </div>
        
        <Card className="mb-8 border-blueprint-200 dark:border-blueprint-800">
          <div className="h-1 bg-blueprint-500"></div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-blueprint-600 dark:text-blueprint-400">Our Design-Build Process</h2>
            </div>
            
            <div className="bg-blueprint-50 dark:bg-blueprint-900/30 border border-blueprint-200 dark:border-blueprint-800 p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-blueprint-600 dark:text-blueprint-400 mt-0.5 mr-2 shrink-0" />
                <p className="text-charcoal-800 dark:text-gray-300 text-sm">
                  Your new home is a significant investment. Taking time to complete this brief thoroughly will help avoid unnecessary costs, delays, and future regrets. A well-thought-out brief saves time, money, and frustration during the design and construction phases.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4">
              {/* Step 1 */}
              <div className="p-4 hover:bg-blueprint-50 dark:hover:bg-blueprint-900/20 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Clipboard className="h-8 w-8 text-blueprint-600 dark:text-blueprint-400" />
                </div>
                <h3 className="font-medium mb-2">Step 1: Complete the Brief</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out this brief with your project requirements and vision.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="p-4 hover:bg-blueprint-50 dark:hover:bg-blueprint-900/20 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <PenLine className="h-8 w-8 text-blueprint-600 dark:text-blueprint-400" />
                </div>
                <h3 className="font-medium mb-2">Step 2: F9 Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your brief before your first consultation.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="p-4 hover:bg-blueprint-50 dark:hover:bg-blueprint-900/20 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Share className="h-8 w-8 text-blueprint-600 dark:text-blueprint-400" />
                </div>
                <h3 className="font-medium mb-2">Step 3: Concept Design</h3>
                <p className="text-sm text-muted-foreground">
                  Your project moves into the concept design phase.
                </p>
              </div>
              
              {/* Step 4 */}
              <div className="p-4 hover:bg-blueprint-50 dark:hover:bg-blueprint-900/20 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blueprint-600 dark:text-blueprint-400" />
                </div>
                <h3 className="font-medium mb-2">Step 4: Design-Build Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  We provide accurate pricing based on your design specifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground italic">
            You can return to this link anytime if you need to update or refine your answers.
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleStart} 
            className="bg-blueprint-600 hover:bg-blueprint-700 transition-all duration-300"
          >
            <span>Begin Your Design Brief</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
          </Button>
        </div>
      </div>
    </div>;
}
