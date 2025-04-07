
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Check, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  const handleSendToArchitect = async () => {
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
            Send to My Architect
          </h4>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Choose how you want to share your design brief with your architect.
              </p>
              
              <Alert className="mb-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                <InfoIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                <AlertDescription className="text-xs font-medium text-purple-800 dark:text-purple-300">
                  Tester Note: This won't actually send anything during testing. You have options like:
                  <ul className="list-disc list-inside mt-1">
                    <li>Email with project brief and attachments</li>
                    <li>Generate a downloadable PDF report</li>
                    <li>etc.</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <Button 
              onClick={handleSendToArchitect} 
              disabled={isSending || isSent}
              className={`w-full md:w-auto md:min-w-[140px] transition-all duration-200 bg-magenta-500 text-white hover:bg-magenta-600 ${isSent ? 'bg-green-500 hover:bg-green-600' : ''}`}
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
                  <span>Send to My Architect</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
