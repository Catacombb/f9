
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Download } from 'lucide-react';
import { toast } from 'sonner';

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
  
  const handleSendBrief = async () => {
    setIsSending(true);
    try {
      // Prepare the PDF
      const pdfBlob = await onExportPDF();
      
      toast.info("Processing", {
        description: "Your brief is being prepared for submission to F9 Productions.",
        duration: 3000
      });
      
      // Show sent state
      setIsSent(true);
      
      // Reset after showing sent state for a while
      setTimeout(() => {
        setIsSent(false);
      }, 3000);
      
      toast.success("Success", {
        description: "Your design brief has been submitted to F9 Productions.",
        duration: 5000
      });
      
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
  
  const handleDownload = async () => {
    try {
      const pdfBlob = await onExportPDF();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `F9-Design-Brief-${clientName.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Success", {
        description: "Your design brief has been downloaded.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error downloading brief:", error);
      toast.error("Error", {
        description: "There was a problem downloading the brief. Please try again.",
        duration: 5000
      });
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
                Your design brief will be sent directly to the F9 Productions team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSendBrief} 
                disabled={isSending || isSent}
                className={`
                  w-full min-w-[200px] 
                  transition-all duration-200 
                  bg-yellow-500 text-black
                  hover:bg-yellow-600
                  ${isSent ? 'bg-green-500 hover:bg-green-600' : ''}
                `}
              >
                {isSending ? (
                  <span className="flex items-center justify-center w-full">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-black border-t-transparent rounded-full" />
                    <span>Sending...</span>
                  </span>
                ) : isSent ? (
                  <span className="flex items-center justify-center w-full">
                    <span>Sent!</span>
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    <span>Send to F9 Productions</span>
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="w-full min-w-[200px]"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download for My Records</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
