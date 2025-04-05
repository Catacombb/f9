
import { useCallback } from 'react';
import { ProjectData } from '@/types';
import { generatePDF } from '@/utils/pdfGenerator';

export const useFileAndSummaryManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
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
      // Generate the PDF first
      const pdfBlob = await generatePDF(projectData);
      
      // In a real-world scenario, we would upload this PDF to a server
      // and then trigger an email sending process
      
      // Mock API call to email service
      const formData = new FormData();
      formData.append('email', email);
      formData.append('clientName', projectData.formData.projectInfo.clientName || 'Client');
      formData.append('projectAddress', projectData.formData.projectInfo.projectAddress || 'Project Address');
      formData.append('attachment', pdfBlob, `Northstar_Brief_${projectData.formData.projectInfo.clientName || "Client"}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log successful email attempt
      console.log(`Successfully sent design brief to ${email}`);
      
      // In a production environment, this would be an actual API call:
      // const response = await fetch('https://api.example.com/send-email', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Email API responded with status ${response.status}`);
      // }
      // 
      // const result = await response.json();
      // if (!result.success) {
      //   throw new Error(result.message || 'Failed to send email');
      // }
      
      return true;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Failed to send email:", error);
      
      // Implement fallback mechanism if needed
      // e.g., store the failed email request in local storage for retry
      try {
        const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
        failedEmails.push({
          email,
          timestamp: new Date().toISOString(),
          projectData: projectData.formData.projectInfo.clientName || 'Unknown Project'
        });
        localStorage.setItem('failedEmails', JSON.stringify(failedEmails));
        console.log('Email delivery failed, saved to retry queue');
      } catch (storageError) {
        console.error("Failed to save failed email to local storage:", storageError);
      }
      
      return false;
    }
  }, [projectData]);

  const exportAsPDF = useCallback(async (): Promise<Blob> => {
    try {
      const pdfBlob = await generatePDF(projectData);
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }, [projectData]);

  return { updateFiles, updateSummary, saveProjectData, sendByEmail, exportAsPDF };
};
