
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Clipboard, PenLine, Share, AlertTriangle } from 'lucide-react';

export function IntroSection() {
  const { setCurrentSection } = useDesignBrief();
  
  const handleStart = () => {
    setCurrentSection('projectInfo');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 font-heading">
            <strong>Welcome!</strong>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This tool helps you get clear on your vision for your new home. 
            You'll walk through a few easy sections to share what matters most — 
            from your lifestyle to the spaces you want and how you want to feel when you walk in the door. 
            At the end, you'll receive a summary you can review, download, and share with your architect or designer.
          </p>
        </div>
        
        <Card className="mb-8 animate-enter">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 shrink-0" />
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  Your new home is a major investment. Taking time to complete this brief thoroughly will help you avoid unnecessary costs, delays, and regret later. A well-thought-out brief now saves time, money, and frustration during the design and build.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 transition-all hover:bg-muted/30 rounded-lg">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Clipboard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Share your intentions</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your dream home through a series of thoughtfully designed questions.
                </p>
              </div>
              
              <div className="text-center p-4 transition-all hover:bg-muted/30 rounded-lg">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <PenLine className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Check that we've captured your vision</h3>
                <p className="text-sm text-muted-foreground">
                  Review your design brief to ensure it accurately reflects your dreams and needs.
                </p>
              </div>
              
              <div className="text-center p-4 transition-all hover:bg-muted/30 rounded-lg">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Download and share your brief with us</h3>
                <p className="text-sm text-muted-foreground">
                  Send your completed brief to our design team so we can bring your vision to life.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            onClick={handleStart}
            className="group hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Start Your Design Brief</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

