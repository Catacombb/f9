
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
        {/* Hero Section with Gradient Background */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-yellow-100/30 dark:from-amber-900/20 dark:to-yellow-900/10 rounded-2xl -z-10 transform -skew-y-1"></div>
          
          <div className="py-8 px-4 rounded-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 font-heading relative inline-block">
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">Welcome</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"></span>
            </h1>
            
            <div className="text-base text-muted-foreground max-w-2xl mx-auto space-y-4 animate-fade-in">
              <p className="text-lg font-medium">The design process always begins with an idea.</p>
              
              <p>To help me understand more about you, your needs for this project, and to explore its potential, I've developed the following list of questions. This questionnaire helps explore ideas for your project.</p>
              
              <p>Feel free to skip any questions that don't apply, and add any insights you think are important.</p>
              
              <div className="mt-6 p-4 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg shadow-sm">
                <p className="italic">Hi there — I've put this together to help you share your thoughts about your new home. It's a quick and simple way for me to understand what matters most to you — how you live, what kind of spaces you need, and what's important to your lifestyle.</p>
                
                <p className="font-medium mt-2">Once you've filled it out, I'll receive everything I need to guide the design of your home.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="mb-8 overflow-hidden border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">How It Works</h2>
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
              {/* Step 1 */}
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 mx-auto bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-800 dark:to-yellow-700 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                  <Clipboard className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                </div>
                <h3 className="font-medium mb-2">Step 1: Share your intentions</h3>
                <p className="text-sm text-muted-foreground">
                  Walk through a few simple sections and tell me what matters to you.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 mx-auto bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-800 dark:to-yellow-700 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                  <PenLine className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                </div>
                <h3 className="font-medium mb-2">Step 2: Check that I've captured your vision</h3>
                <p className="text-sm text-muted-foreground">
                  You'll get a summary to review before submitting.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 mx-auto bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-800 dark:to-yellow-700 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                  <Share className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                </div>
                <h3 className="font-medium mb-2">Step 3: Submit your brief to me</h3>
                <p className="text-sm text-muted-foreground">
                  When you're happy, send it through so I can get started.
                </p>
              </div>
              
              {/* Step 4 */}
              <div className="text-center p-4 hover:bg-primary/5 rounded-lg transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 mx-auto bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-800 dark:to-yellow-700 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                  <MessageCircle className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                </div>
                <h3 className="font-medium mb-2">Step 4: I'll be in touch to progress your dream home</h3>
                <p className="text-sm text-muted-foreground">
                  I'll use your brief to guide our next steps and bring your vision to life.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground italic">
            You can revisit this link anytime if you want to update or refine your answers.
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleStart} 
            className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>Start Your Design Brief</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>;
}
