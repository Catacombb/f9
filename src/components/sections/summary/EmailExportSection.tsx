import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDesignBrief } from '@/context/DesignBriefContext';

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { saveProjectData, isLoading, currentBriefId, isNewProject } = useDesignBrief();
  
  // Save brief to Supabase first
  const saveBriefFirst = async () => {
    // If already saving, avoid duplicate saves
    if (isSaving || isLoading) {
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('[EmailExportSection] Saving brief to database first...');
      toast({
        title: "Saving",
        description: "Saving your brief data..."
      });
      
      const result = await saveProjectData();
      
      if (!result.success) {
        throw new Error(result.error ? result.error.message : 'Failed to save brief');
      }
      
      console.log('[EmailExportSection] Brief saved successfully with ID:', result.projectId);
      
      toast({
        title: "Saved",
        description: isNewProject 
          ? "Your brief has been created successfully!" 
          : "Your brief has been updated successfully!"
      });
      
      return result.projectId;
    } catch (error) {
      console.error('[EmailExportSection] Error saving brief:', error);
      toast({
        title: "Error Saving",
        description: `Could not save your brief: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      // First save the brief to Supabase
      const briefId = await saveBriefFirst();
      if (!briefId) {
        throw new Error("Failed to save brief before downloading");
      }
      
      const pdfBlob = await onExportPDF();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `F9-Design-Brief-${clientName.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Your design brief has been downloaded."
      });
    } catch (error) {
      console.error("[EmailExportSection] Error downloading brief:", error);
      toast({
        title: "Error",
        description: "There was a problem downloading the brief. Please try again.",
        variant: "destructive"
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
                Your design brief will be saved to your account and can be sent directly to the F9 Productions team.
              </p>
              <p className="text-xs text-muted-foreground">
                {currentBriefId 
                  ? `Brief ID: ${currentBriefId} (${isNewProject ? 'New' : 'Existing'})` 
                  : 'New brief - will be saved when you submit or download'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownload}
                disabled={isSaving || isLoading}
                variant="outline"
                className="w-full min-w-[200px]"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center w-full">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Save & Download</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
