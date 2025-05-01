
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useDesignBrief } from '@/context/DesignBriefContext';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const handleStartBrief = () => {
    // Simply close the modal without changing the section
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-blueprint-200">
        <DialogHeader className="text-center">
          <h2 className="text-xl font-bold text-black">Design Brief</h2>
        </DialogHeader>
        
        <div className="space-y-4 text-black text-center mb-4">
          <p className="font-medium">
            Your input helps F9 Productions design and build smarter.
          </p>
          
          <p>
            This brief is the starting point for your project with F9. It helps us understand your goals, preferences, and priorities before we begin our design and build process.
          </p>
          
          <p>
            The more specific you are, the better we can tailor our work to suit your project. You're welcome to skip questions that don't apply, but be as detailed as you can where it matters.
          </p>
          
          <p>
            Let's build your vision with F9 Productions.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center mt-4">
          <Button 
            onClick={handleStartBrief} 
            className="bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-300 hover:scale-105"
          >
            <span className="font-bold">Start My Brief</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
