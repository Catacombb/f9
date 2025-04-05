
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight, Clipboard, PenLine, Share, AlertTriangle, MessageCircle } from 'lucide-react';

export function IntroSection() {
  const {
    setCurrentSection
  } = useDesignBrief();
  
  const handleStart = () => {
    setCurrentSection('projectInfo');
  };
  
  return <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-heading">
            <strong>Welcome</strong>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hi there — I've put this together to help you share your thoughts about your new home.
            <br /><br />
            It's a quick and simple way for me to understand what matters most to you — how you live, what kind of spaces you need, and what's important to your lifestyle.
            <br /><br />
            Once you've filled it out, I'll receive everything I need to guide the design of your home.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 shrink-0" />
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  Your new home is a major investment. Taking time to complete this brief properly will help you avoid unnecessary costs, delays, and regret later. A well-thought-out brief now saves time, money, and frustration during the design and build.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Clipboard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Step 1: Share your intentions</h3>
                <p className="text-sm text-muted-foreground">
                  Walk through a few simple sections and tell me what matters to you.
                </p>
              </div>
              
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <PenLine className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Step 2: Check that I've captured your vision</h3>
                <p className="text-sm text-muted-foreground">
                  You'll get a summary to review before submitting.
                </p>
              </div>
              
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Step 3: Submit your brief to me</h3>
                <p className="text-sm text-muted-foreground">
                  When you're happy, send it through so I can get started.
                </p>
              </div>
              
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Step 4: I'll be in touch</h3>
                <p className="text-sm text-muted-foreground">
                  I'll use your brief to guide our next steps and bring your vision to life.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            You can revisit this link anytime if you want to update or refine your answers.
          </p>
        </div>
        
        <div className="text-center">
          <Button size="lg" onClick={handleStart} className="group">
            <span>Start Your Design Brief</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>;
}
