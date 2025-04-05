
import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from './SectionHeader';
import { SummarySectionActions } from './summary/SummarySectionActions';
import { SummaryTabContent } from './summary/SummaryTabContent';
import { EmailExportSection } from './summary/EmailExportSection';

// Define inspiration images array
const inspirationImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop', alt: 'Modern New Zealand house with glass facade' },
  { id: '2', src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop', alt: 'Contemporary coastal New Zealand home' },
  { id: '3', src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop', alt: 'Minimalist New Zealand living space with mountain views' },
  { id: '4', src: 'https://images.unsplash.com/photo-1600566752355-09c79c71a7b0?w=800&auto=format&fit=crop', alt: 'Open plan New Zealand kitchen and dining' },
  { id: '5', src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', alt: 'Auckland modern house with outdoor deck' },
  { id: '6', src: 'https://images.unsplash.com/photo-1575403071235-5dcd06cbf169?w=800&auto=format&fit=crop', alt: 'Queenstown cabin with lake views' },
];

export function SummarySection() {
  const { formData, files, sendByEmail, exportAsPDF, setCurrentSection } = useDesignBrief();
  
  const formatSpacesData = () => {
    if (!formData.spaces.rooms || formData.spaces.rooms.length === 0) {
      return <p className="text-sm text-muted-foreground">No spaces defined</p>;
    }
    
    const groupedRooms = formData.spaces.rooms.reduce((acc, room) => {
      const type = room.isCustom && room.customName ? room.customName : room.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(room);
      return acc;
    }, {} as Record<string, typeof formData.spaces.rooms>);
    
    return (
      <div className="space-y-4">
        {Object.entries(groupedRooms).map(([type, rooms]) => (
          <div key={type}>
            <p className="text-sm font-medium">
              {type} ({rooms.length})
            </p>
            <ul className="list-disc pl-5 text-sm">
              {rooms.map((room, index) => (
                <li key={index}>
                  {room.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  const formatOccupantsData = () => {
    try {
      if (!formData.lifestyle.occupants) return "None specified";
      
      const occupantsData = JSON.parse(formData.lifestyle.occupants);
      let totalOccupants = 0;
      const parts = [];
      
      if (occupantsData.adults && occupantsData.adults > 0) {
        totalOccupants += occupantsData.adults;
        parts.push(`${occupantsData.adults} adult${occupantsData.adults !== 1 ? 's' : ''}`);
      }
      
      if (occupantsData.children && occupantsData.children > 0) {
        totalOccupants += occupantsData.children;
        parts.push(`${occupantsData.children} child${occupantsData.children !== 1 ? 'ren' : ''}`);
      }
      
      if (occupantsData.dogs && occupantsData.dogs > 0) {
        parts.push(`${occupantsData.dogs} dog${occupantsData.dogs !== 1 ? 's' : ''}`);
      }
      
      if (occupantsData.cats && occupantsData.cats > 0) {
        parts.push(`${occupantsData.cats} cat${occupantsData.cats !== 1 ? 's' : ''}`);
      }
      
      const totalSpaces = formData.spaces.rooms.length;
      
      return `${totalOccupants} occupant${totalOccupants !== 1 ? 's' : ''} / ${totalSpaces} space${totalSpaces !== 1 ? 's' : ''} selected (${parts.join(', ')})`;
    } catch (e) {
      return "Data format error";
    }
  };

  // Handle PDF export with proper return type
  const handleExportPDF = async (): Promise<void> => {
    try {
      const pdfBlob = await exportAsPDF();
      
      if (pdfBlob) {
        // Create a download link and trigger it
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Northstar_Brief_${formData.projectInfo.clientName || "Client"}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      throw error;
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection('communication');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Design Brief Summary"
          description="Review your design brief information before finalizing."
        />
        
        <Tabs defaultValue="preview">
          <TabsList className="mb-6">
            <TabsTrigger value="preview">Design Brief Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <SummaryTabContent 
              formData={formData}
              files={files}
              formatSpacesData={formatSpacesData}
              formatOccupantsData={formatOccupantsData}
              inspirationImages={inspirationImages}
            />
            
            {/* Email and Export Section */}
            <EmailExportSection 
              defaultEmail={formData.projectInfo.contactEmail || ''}
              onSendEmail={sendByEmail}
              onExportPDF={handleExportPDF}
              clientName={formData.projectInfo.clientName}
            />
          </TabsContent>
        </Tabs>
        
        <SummarySectionActions onPrevious={handlePrevious} />
      </div>
    </div>
  );
}
