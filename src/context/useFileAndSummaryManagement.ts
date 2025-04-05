
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
      
      // Create a temporary URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Format the client name for the file name
      const clientName = projectData.formData.projectInfo.clientName || "Client";
      const projectAddress = projectData.formData.projectInfo.projectAddress || "Project Address";
      const dateStamp = new Date().toISOString().split('T')[0];
      
      // Create an email subject
      const emailSubject = `Northstar Design Brief - ${clientName} - ${dateStamp}`;
      
      // Create the email body with download instructions
      const emailBody = `Dear ${clientName},

Thank you for using Northstar to create your design brief for ${projectAddress}.

To view your design brief, please click on the link below to download the PDF:

${window.location.origin}/download/${encodeURIComponent(clientName)}_${dateStamp}.pdf

This link is temporary and will expire once you close your browser.

Best regards,
The Northstar Team`;
      
      // Encode the subject and body for mailto
      const encodedSubject = encodeURIComponent(emailSubject);
      const encodedBody = encodeURIComponent(emailBody);
      
      // Create a mailto link with CC to nick@nickharrison.co
      const mailtoLink = `mailto:${email}?cc=nick@nickharrison.co&subject=${encodedSubject}&body=${encodedBody}`;
      
      // Create a hidden anchor element for the mailto link
      const mailtoAnchor = document.createElement('a');
      mailtoAnchor.href = mailtoLink;
      
      // Create a hidden anchor element for the PDF download
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = pdfUrl;
      downloadAnchor.download = `Northstar_Brief_${clientName}_${dateStamp}.pdf`;
      
      // Append to document, trigger clicks, and remove
      document.body.appendChild(mailtoAnchor);
      document.body.appendChild(downloadAnchor);
      
      // First trigger the download
      downloadAnchor.click();
      
      // Wait a short delay then open the email client
      setTimeout(() => {
        mailtoAnchor.click();
        
        // Clean up
        document.body.removeChild(mailtoAnchor);
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(pdfUrl);
      }, 500); // Short delay to ensure download starts first
      
      return true;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Failed to send email:", error);
      
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
