
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Clipboard, PenLine, Share, AlertTriangle, MessageCircle } from 'lucide-react';

export function IntroSection() {
  const { setCurrentSection } = useDesignBrief();
  const [showTesterPopup, setShowTesterPopup] = useState(false);
  
  // Effect to ensure popup is not shown
  useEffect(() => {
    setShowTesterPopup(false);
  }, []);
  
  const handleStart = () => {
    setCurrentSection('projectInfo');
  };
  
  const handleClosePopup = () => {
    setShowTesterPopup(false);
  };
  
  return <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        {/* Header Section with Blueprint Grid Background */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 blueprint-grid-bg -z-10"></div>
          
          <div className="py-8 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 font-heading text-charcoal-800">
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
        
        <Card className="mb-8 border-blueprint-200">
          <div className="h-1 bg-blueprint-500"></div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-blueprint-600">Our Design-Build Process</h2>
            </div>
            
            <div className="bg-blueprint-50 border border-blueprint-200 p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-blueprint-600 mt-0.5 mr-2 shrink-0" />
                <p className="text-charcoal-800 text-sm">
                  Your new home is a significant investment. Taking time to complete this brief thoroughly will help avoid unnecessary costs, delays, and future regrets. A well-thought-out brief saves time, money, and frustration during the design and construction phases.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-7">
              {/* Step 1 - Programming */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Clipboard className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Programming</h3>
                <p className="text-sm text-muted-foreground">
                  Gathering information about your needs, wants, and budget.
                </p>
              </div>
              
              {/* Step 2 - Schematic Design */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <PenLine className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Schematic Design</h3>
                <p className="text-sm text-muted-foreground">
                  Creating concept sketches and design options.
                </p>
              </div>
              
              {/* Step 3 - Design Development */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Share className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Design Development</h3>
                <p className="text-sm text-muted-foreground">
                  Refining the design and selecting materials.
                </p>
              </div>
              
              {/* Step 4 - Construction Documents */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Construction Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Preparing detailed plans for building.
                </p>
              </div>
              
              {/* Step 5 - Permitting */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Permitting</h3>
                <p className="text-sm text-muted-foreground">
                  Obtaining necessary approvals from local authorities.
                </p>
              </div>
              
              {/* Step 6 - Bidding */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Bidding</h3>
                <p className="text-sm text-muted-foreground">
                  Selecting contractors for your project.
                </p>
              </div>
              
              {/* Step 7 - Construction Administration */}
              <div className="p-4 hover:bg-blueprint-50 transition-colors duration-300">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blueprint-600" />
                </div>
                <h3 className="font-medium mb-2 text-center">Construction Administration</h3>
                <p className="text-sm text-muted-foreground">
                  Overseeing construction to ensure design intent.
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
