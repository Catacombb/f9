
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Check, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EmailExportSectionProps {
  onExportPDF: () => Promise<Blob>;
  clientName: string;
  projectAddress?: string;
}

export function EmailExportSection({ 
  onExportPDF, 
  clientName,
  projectAddress
}: EmailExportSectionProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendTo, setSendTo] = useState("architect"); // Default: Send to Architect
  
  const handleSendBrief = async () => {
    setIsSending(true);
    try {
      // Prepare the PDF
      const pdfBlob = await onExportPDF();
      
      toast.info("Tester Note", {
        description: "This won't actually send anything during testing.",
        duration: 5000
      });
      
      // Show sent state
      setIsSent(true);
      
      // Reset after showing sent state for a while
      setTimeout(() => {
        setIsSent(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error preparing brief:", error);
      toast.error("Error", {
        description: "There was a problem preparing the brief. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold">Finalize Your Brief</h3>
      
      <div className="p-6 space-y-4 border rounded-lg">
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            Design Brief Submission
          </h4>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you want to share your design brief.
              </p>
              
              <RadioGroup 
                defaultValue="architect" 
                value={sendTo} 
                onValueChange={setSendTo}
                className="mb-4 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="architect" id="send-architect" />
                  <Label htmlFor="send-architect" className="font-medium">
                    Send to F9 Productions Architect
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="myself" id="send-myself" />
                  <Label htmlFor="send-myself" className="font-medium">
                    Send a Copy to Myself
                  </Label>
                </div>
              </RadioGroup>
              
              <Alert className="mb-4 bg-blueprint-50 dark:bg-blueprint-900/30 border border-blueprint-200 dark:border-blueprint-800">
                <InfoIcon className="h-4 w-4 text-blueprint-700 dark:text-blueprint-400" />
                <AlertDescription className="text-xs font-medium text-blueprint-800 dark:text-blueprint-300">
                  Tester Note: This won't actually send anything during testing.
                </AlertDescription>
              </Alert>
            </div>
            <Button 
              onClick={handleSendBrief} 
              disabled={isSending || isSent}
              className={`
                w-full md:w-auto md:min-w-[140px] 
                transition-all duration-200 
                bg-blueprint-600 text-white 
                hover:bg-blueprint-700 
                dark:bg-blueprint-500 dark:hover:bg-blueprint-600 
                ${isSent ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : ''}
              `}
            >
              {isSending ? (
                <span className="flex items-center justify-center w-full">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  <span>Sending...</span>
                </span>
              ) : isSent ? (
                <span className="flex items-center justify-center w-full">
                  <Check className="h-4 w-4 mr-2 animate-pop" />
                  <span>Sent!</span>
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  <span>Submit Design Brief</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
