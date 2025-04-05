
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailExportSectionProps {
  defaultEmail: string;
  onSendEmail: (email: string) => Promise<boolean>;
  onExportPDF: () => Promise<void>;
  clientName: string;
}

export function EmailExportSection({ 
  defaultEmail, 
  onSendEmail, 
  onExportPDF, 
  clientName 
}: EmailExportSectionProps) {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to receive the brief.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEmailSending(true);
    try {
      const success = await onSendEmail(recipientEmail);
      if (success) {
        toast({
          title: "Email Sent",
          description: "Your design brief has been sent to " + recipientEmail,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Email Delivery Failed",
        description: "We couldn't send your email. The issue has been logged and we'll try again soon.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await onExportPDF();
      toast({
        title: "PDF Generated",
        description: "Your design brief has been exported as a PDF.",
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
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Send by Email</h4>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Label htmlFor="recipientEmail">Email Address</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
            <div className="pt-6">
              <Button 
                onClick={handleSendEmail} 
                disabled={isEmailSending}
                className="min-w-[140px]"
              >
                <Mail className={`h-4 w-4 mr-2 ${isEmailSending ? 'animate-spin' : ''}`} />
                <span>Send Email</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Receive a copy of your design brief by email. We'll also send a copy to our team for reference.
          </p>
          {!defaultEmail && (
            <p className="text-sm text-yellow-500 mt-2">
              Tip: Add your email to the Project Information section to pre-fill this field.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
