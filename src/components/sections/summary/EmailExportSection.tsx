
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from 'emailjs-com';

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
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdfBlob = await onExportPDF();
      // Create a download link for the blob
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Northstar_Brief_${clientName || "Client"}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast({
        title: "PDF Generated",
        description: "Your design brief has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Error",
        description: "There was a problem exporting your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendToArchitect = async () => {
    setIsSending(true);
    try {
      // Prepare the PDF
      const pdfBlob = await onExportPDF();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Get the architect's email (in a real app, this would come from the invitation context)
      const architectEmail = "architect@example.com"; // This would be replaced with actual architect email
      const architectName = "Your Architect"; // This would be replaced with actual architect name
      
      // Prepare email parameters
      const emailParams = {
        to_email: architectEmail,
        to_name: architectName,
        from_name: clientName || "Client",
        project_address: projectAddress || "Project Address",
        pdf_link: window.location.origin + "/download/" + encodeURIComponent(`Northstar_Brief_${clientName || "Client"}_${new Date().toISOString().split('T')[0]}.pdf`),
        message: "This brief was completed by your client using Northstar.",
        reply_to: "no-reply@northstar.design"
      };
      
      // Send email using EmailJS
      await emailjs.send(
        'service_opdkitc',
        'template_architect_brief', // Template ID (needs to be created in EmailJS)
        emailParams,
        'EMAILJS_USER_ID' // This would be the actual user ID
      );
      
      // Cleanup
      URL.revokeObjectURL(pdfUrl);
      
      toast({
        title: "Done",
        description: "Your architect has received the brief.",
      });
    } catch (error) {
      console.error("Error sending to architect:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the brief to your architect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-bold">Finalize Your Brief</h3>
      
      <div className="p-6 space-y-4 border rounded-lg">
        <div>
          <h4 className="font-medium mb-2">Export as PDF</h4>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Download your complete design brief as a PDF document with the title: 
                <span className="font-semibold block">
                  "Northstar_Brief_{clientName || "[Client Name]"}_{new Date().toISOString().split('T')[0]}"
                </span>
              </p>
            </div>
            <Button 
              onClick={handleExportPDF} 
              disabled={isExporting}
              className="min-w-[140px]"
            >
              <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Send to My Architect</h4>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Automatically send your brief to your architect including all details and attachments.
              </p>
            </div>
            <Button 
              onClick={handleSendToArchitect} 
              disabled={isSending}
              className="min-w-[140px]"
            >
              <Send className={`h-4 w-4 mr-2 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Sending...' : 'Send to My Architect'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
