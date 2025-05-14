import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { briefService } from '@/lib/supabase/services/briefService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

interface SummarySectionActionsProps {
  onPrevious: () => void;
}

export function SummarySectionActions({ onPrevious }: SummarySectionActionsProps) {
  const { currentBriefId } = useDesignBrief();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitToBrief = async () => {
    if (!currentBriefId) {
      toast({
        title: "Brief Not Saved",
        description: "Please save your brief first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await briefService.updateBriefStatus(currentBriefId, 'brief_ready');
      
      if (error) {
        toast({
          title: "Error Submitting Brief",
          description: "Could not submit your brief to F9. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Brief Submitted Successfully",
          description: "Your design brief has been submitted to F9 Productions. You will be redirected to the dashboard.",
        });
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (e) {
      console.error('[SummarySectionActions] Error submitting brief:', e);
      toast({
        title: "Error Submitting Brief",
        description: "An unexpected error occurred while submitting your brief.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="transition-all duration-200 active:scale-95"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform" />
        <span>Previous: Communication</span>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="ml-auto">
            <Send className="mr-2 h-4 w-4" />
            Submit to F9
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Design Brief to F9</DialogTitle>
            <DialogDescription>
              Your design brief will be sent to F9 Productions for review. Once submitted, the F9 team will review your brief and prepare a proposal based on your requirements.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {}}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitToBrief}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Brief'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
