
import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Computer } from 'lucide-react';

interface TesterNotePopupProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function TesterNotePopup({ isOpen = true, onClose }: TesterNotePopupProps) {
  const [open, setOpen] = useState(isOpen);
  
  // Update internal state when prop changes
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md border-blueprint-300 dark:border-blueprint-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-blueprint-700 dark:text-blueprint-400">
            Tester's Note
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-blueprint-50 dark:bg-blueprint-900/30 border border-blueprint-200 dark:border-blueprint-800 p-4 my-2">
          <DialogDescription className="text-sm text-blueprint-800 dark:text-blueprint-300 space-y-3">
            <p className="font-medium">Thank you for testing F9's Design Brief Tool in its early stages.</p>
            
            <p>While future versions will include more functionality, we've kept this initial version focused and straightforward.</p>
            
            <p>We value your honest feedback on what works, what doesn't, and what feels missing.</p>
            
            <p>Please make notes as you proceed through the brief.<br />
            At the end, you'll find a space to share your feedback.</p>
            
            <p>Your input will directly shape improvements to this tool.</p>
            
            <div className="flex items-center bg-blueprint-100 dark:bg-blueprint-900/50 p-3 rounded-lg mt-4 border border-blueprint-200 dark:border-blueprint-700">
              <Computer className="h-6 w-6 mr-3 text-blueprint-700 dark:text-blueprint-400" />
              <p className="text-sm text-blueprint-800 dark:text-blueprint-300">
                <strong>Note:</strong> Please use a desktop computer for optimal experience during testing.
              </p>
            </div>
          </DialogDescription>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleClose}
            className="w-full bg-blueprint-600 hover:bg-blueprint-700"
          >
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
