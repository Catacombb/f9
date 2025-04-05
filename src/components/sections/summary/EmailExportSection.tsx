
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailExportSectionProps {
  onExportPDF: () => Promise<Blob>;
  clientName: string;
}

export function EmailExportSection({ 
  onExportPDF, 
  clientName 
}: EmailExportSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
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
      </div>
    </div>
  );
}

