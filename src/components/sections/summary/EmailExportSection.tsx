
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface EmailExportSectionProps {
  defaultEmail: string;
  onSendEmail: (email: string) => Promise<boolean>;
  onExportPDF: () => Promise<Blob>;
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
  const [emailError, setEmailError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSendEmail = async () => {
    // Reset error state
    setEmailError(null);
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to receive the brief.",
        variant: "destructive",
      });
      return;
    }
    
    if (!emailRegex.test(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEmailSending(true);
    toast({
      title: "Preparing Download and Email",
      description: "Generating PDF and preparing your email client...",
    });
    
    try {
      const success = await onSendEmail(recipientEmail);
      if (success) {
        toast({
          title: "Email Prepared",
          description: "Your design brief has been downloaded and an email draft has been created.",
        });
        setEmailError(null);
      } else {
        throw new Error("Failed to prepare email");
      }
    } catch (error) {
      console.error("Email preparation error:", error);
      setEmailError("We couldn't prepare your email. This could be due to browser restrictions. You can try downloading the PDF instead.");
      toast({
        title: "Email Preparation Failed",
        description: "We couldn't open your email client. Please try downloading the PDF instead.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };
  
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
        
        <div>
          <h4 className="font-medium mb-2">Send by Email</h4>
          {emailError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Email Delivery Issue</AlertTitle>
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}
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
                <span>{isEmailSending ? 'Preparing...' : 'Email PDF'}</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Download your design brief and create an email draft. A copy will also be sent to the Northstar team.
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
