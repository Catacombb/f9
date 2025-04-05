import { useCallback } from 'react';
import { ProjectData } from '@/types';
import { generatePDF } from '@/utils/pdfGenerator/index';

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
      
      // Create a FormData object to send the PDF and email details
      const formData = new FormData();
      formData.append('email', email);
      formData.append('client_name', projectData.formData.projectInfo.clientName || 'Client');
      formData.append('project_address', projectData.formData.projectInfo.projectAddress || 'Project Address');
      formData.append('attachment', pdfBlob, `Northstar_Brief_${projectData.formData.projectInfo.clientName || "Client"}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Send the email using the EmailJS service
      const emailApiUrl = 'https://api.emailjs.com/api/v1.0/email/send-form';
      
      // Add your EmailJS service credentials
      formData.append('service_id', 'service_opdkitc');
      formData.append('template_id', 'template_r3dcgye');
      formData.append('user_id', '4MY7hfZH94KlILN09eiC6');
      
      // Make the API call to send the email
      const response = await fetch(emailApiUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Email API responded with status ${response.status}`);
      }
      
      // Log successful email attempt
      console.log(`Successfully sent design brief to ${email}`);
      
      return true;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Failed to send email:", error);
      
      // Implement fallback mechanism if needed
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
      // Using the updated generatePDF function that properly returns a Blob
      const pdfBlob = await generatePDF(projectData);
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Create a simple error PDF as fallback that returns a Blob
      const { jsPDF } = await import('jspdf');
      const errorPdf = new jsPDF();
      errorPdf.text("Error generating PDF. Please try again.", 10, 10);
      return errorPdf.output('blob');
    }
  }, [projectData]);

  return { updateFiles, updateSummary, saveProjectData, sendByEmail, exportAsPDF };
};
