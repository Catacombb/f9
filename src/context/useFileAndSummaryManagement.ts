
import { useCallback } from 'react';
import { ProjectData } from '@/types';
import { generatePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

export const useFileAndSummaryManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const { toast } = useToast();

  const updateFiles = useCallback((updates: Partial<ProjectData['files']>) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.files = {
        ...updatedDraft.files,
        ...updates
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  const updateSummary = useCallback((updates: Partial<ProjectData['summary']>) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.summary = {
        ...updatedDraft.summary,
        ...updates
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  const saveProjectData = useCallback(() => {
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [projectData]);

  const sendByEmail = useCallback(async (email: string): Promise<boolean> => {
    console.log(`Sending email to ${email}`);
    
    try {
      // Generate PDF first
      await generatePDF(projectData);
      
      // In a real implementation this would be an API call to a backend service
      // For now, we'll simulate the email sending with a delay
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          // Log success message with timestamp for debugging
          const timestamp = new Date().toISOString();
          console.log(`[${timestamp}] Email sent successfully to ${email}`);
          
          // Store the last email sent in localStorage for debugging/tracking
          localStorage.setItem('lastEmailSent', JSON.stringify({
            email,
            timestamp,
            projectName: projectData.formData.projectInfo.clientName || "Unnamed Project"
          }));
          
          resolve(true);
        }, 1500);
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error Sending Email",
        description: "There was a problem generating or sending the PDF. Please try again.",
        variant: "destructive",
      });
      return Promise.resolve(false);
    }
  }, [projectData, toast]);

  const exportAsPDF = useCallback(async (): Promise<void> => {
    try {
      await generatePDF(projectData);
      return Promise.resolve();
    } catch (error) {
      console.error("Error generating PDF:", error);
      return Promise.reject(error);
    }
  }, [projectData]);

  return { updateFiles, updateSummary, saveProjectData, sendByEmail, exportAsPDF };
};
