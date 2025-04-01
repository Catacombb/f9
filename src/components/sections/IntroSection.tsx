
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Clipboard, PenLine, Share } from 'lucide-react';

export function IntroSection() {
  const { setCurrentSection } = useDesignBrief();
  
  const handleStart = () => {
    setCurrentSection('projectInfo');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Start Your New Home Journey with Northstar</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to Northstar! Let's create a design brief that will bring your vision to life. 
            With our step-by-step guide, you'll have a comprehensive plan for your dream home — 
            all tailored to your unique needs and preferences.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
              <p className="text-muted-foreground">
                The more detail you provide, the better your brief will be. All fields are optional, but we encourage you to share as much as you can.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Clipboard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Complete the Sections</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate through each section and answer the questions at your own pace.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <PenLine className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Review the Summary</h3>
                <p className="text-sm text-muted-foreground">
                  We'll generate an AI-written summary of your brief, which you can review and edit.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Get Your Report</h3>
                <p className="text-sm text-muted-foreground">
                  Download or share your comprehensive design brief with your chosen architect or designer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleStart}
            className="group"
          >
            <span>Start Your Design Brief</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
