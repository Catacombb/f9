import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SectionHeader } from './SectionHeader';
import { SummarySectionActions } from './summary/SummarySectionActions';
import { SummaryTabContent } from './summary/SummaryTabContent';
import { EmailExportSection } from './summary/EmailExportSection';

// Define inspiration images array - this matches the ones selected in InspirationSection
const inspirationImages = [
  { id: 'img1', src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', alt: 'Modern New Zealand style home with wood facade' },
  { id: 'img2', src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', alt: 'Contemporary coastal style home' },
  { id: 'img3', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', alt: 'Luxury home with mountain views' },
  { id: 'img4', src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop', alt: 'Modern house with clean lines' },
  { id: 'img5', src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop', alt: 'House with ocean view' },
  { id: 'img6', src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1992&auto=format&fit=crop', alt: 'Lake view residence with panoramic windows' },
  { id: 'img7', src: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop', alt: 'Modern beach home' },
  { id: 'img8', src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop', alt: 'Beach House exterior' },
  { id: 'img9', src: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=2070&auto=format&fit=crop', alt: 'Luxury Holiday Home' },
  { id: 'img10', src: 'https://images.unsplash.com/photo-1501876725168-00c445821c9e?q=80&w=2070&auto=format&fit=crop', alt: 'Aerial view of modern beachfront home' },
  { id: 'img11', src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', alt: 'Luxury home with infinity pool' },
  { id: 'img12', src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', alt: 'Modern coastal residence' },
  { id: 'img13', src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', alt: 'Beach house' },
  { id: 'img14', src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=2070&auto=format&fit=crop', alt: 'Modern waterfront home' },
  { id: 'img15', src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop', alt: 'Modern beach house exterior' },
  { id: 'img16', src: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop', alt: 'Harbour view house exterior' },
  { id: 'img17', src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop', alt: 'Lakehouse with mountain views' },
  { id: 'img18', src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', alt: 'Modern house exterior' },
  { id: 'img19', src: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?q=80&w=2071&auto=format&fit=crop', alt: 'Holiday Home exterior' },
  { id: 'img20', src: 'https://images.unsplash.com/photo-1593604572578-3431a5f2f442?q=80&w=2070&auto=format&fit=crop', alt: 'Modern minimalist home' },
  { id: 'img21', src: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2187&auto=format&fit=crop', alt: 'Luxury white villa with pool' },
  { id: 'img22', src: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?q=80&w=2574&auto=format&fit=crop', alt: 'Modern black box house in forest' },
  { id: 'img23', src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop', alt: 'Modern home with large windows' },
  { id: 'img24', src: 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=2081&auto=format&fit=crop', alt: 'Contemporary house with courtyard' },
  { id: 'img25', src: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop', alt: 'House with unique architecture' },
  { id: 'img26', src: 'https://images.unsplash.com/photo-1602075432748-82d264e2b463?q=80&w=2070&auto=format&fit=crop', alt: 'Coastal house with modern design' },
  { id: 'img27', src: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2025&auto=format&fit=crop', alt: 'Modern eco-friendly house' },
  { id: 'img28', src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', alt: 'Contemporary hillside home' },
  { id: 'img29', src: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?q=80&w=2074&auto=format&fit=crop', alt: 'Luxury glass house in nature' },
  { id: 'img30', src: 'https://images.unsplash.com/photo-1542889601-399c4f3a8402?q=80&w=2070&auto=format&fit=crop', alt: 'Modern wooden cabin home' },
];

export function SummarySection() {
  const { formData, files, exportAsPDF, setCurrentSection } = useDesignBrief();
  
  const formatSpacesData = () => {
    if (!formData.spaces.rooms || formData.spaces.rooms.length === 0) {
      return <p className="text-sm text-muted-foreground">No spaces defined</p>;
    }
    
    const roomsByType = formData.spaces.rooms.reduce((acc, room) => {
      const type = room.isCustom && room.customName ? room.customName : room.type;
      
      if (!acc[type]) {
        acc[type] = [];
      }
      
      acc[type].push(room);
      return acc;
    }, {} as Record<string, typeof formData.spaces.rooms>);
    
    const roomTypeCounts: Record<string, number> = {};
    let totalSpaces = 0;
    const keyLivingSpaces = ['Living Room', 'Kitchen', 'Dining'];
    let keyLivingSpacesCount = 0;
    
    Object.entries(roomsByType).forEach(([type, rooms]) => {
      roomTypeCounts[type] = rooms.length;
      totalSpaces += rooms.length;
      
      if (keyLivingSpaces.includes(type)) {
        keyLivingSpacesCount++;
      }
    });
    
    let summaryLine = `Total Spaces: ${totalSpaces}`;
    
    const bedroomCount = roomTypeCounts['Bedroom'] || 0;
    const bathroomCount = roomTypeCounts['Bathroom'] || 0;
    
    if (bedroomCount > 0 || bathroomCount > 0) {
      summaryLine += ' — including ';
      
      if (bedroomCount > 0) {
        summaryLine += `${bedroomCount} Bedroom${bedroomCount !== 1 ? 's' : ''}`;
      }
      
      if (bedroomCount > 0 && bathroomCount > 0) {
        summaryLine += ', ';
      }
      
      if (bathroomCount > 0) {
        summaryLine += `${bathroomCount} Bathroom${bathroomCount !== 1 ? 's' : ''}`;
      }
      
      if (keyLivingSpacesCount > 0) {
        summaryLine += `, and ${keyLivingSpacesCount} of each key living space`;
      }
      
      summaryLine += '.';
    }
    
    const formatRoomDescription = (room, index) => {
      try {
        const descriptionObj = JSON.parse(room.description);
        const displayName = room.displayName || room.customName || `${room.type} ${index + 1}`;
        
        let levelInfo = '';
        if (descriptionObj.level) {
          levelInfo = `(${descriptionObj.level.toUpperCase()}) `;
        }
        
        const descriptionItems = [];
        
        if (descriptionObj.kitchenType) {
          descriptionItems.push(`${descriptionObj.kitchenType} kitchen`);
        }
        
        if (descriptionObj.kitchenLayout) {
          descriptionItems.push(`${descriptionObj.kitchenLayout}`);
        }
        
        if (descriptionObj.kitchenUse) {
          descriptionItems.push(`${descriptionObj.kitchenUse}`);
        }
        
        if (descriptionObj.entertainmentFocus) {
          descriptionItems.push("Entertainment focused");
        }
        
        if (descriptionObj.entertainmentSpace) {
          descriptionItems.push(`${descriptionObj.entertainmentSpace}`);
        }
        
        if (descriptionObj.workFromHome) {
          descriptionItems.push("Work from home ready");
        }
        
        if (descriptionObj.officeType) {
          descriptionItems.push(`${descriptionObj.officeType}`);
        }
        
        if (descriptionObj.notes) {
          descriptionItems.push(descriptionObj.notes);
        }
        
        const description = descriptionItems.length > 0 
          ? descriptionItems.join(". ") 
          : "No specific details";
          
        return (
          <li key={room.id} className="mb-2">
            <span className="font-medium">{displayName}</span> – {levelInfo}{description}
          </li>
        );
      } catch (e) {
        const displayName = room.displayName || room.customName || `${room.type} ${index + 1}`;
        return (
          <li key={room.id} className="mb-2">
            <span className="font-medium">{displayName}</span> – {room.description || "No description"}
          </li>
        );
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="text-sm font-medium border-b pb-2">
          {summaryLine}
        </div>
        
        {Object.entries(roomsByType).map(([type, rooms]) => (
          <div key={type} className="space-y-2">
            <h5 className="font-medium text-base">
              {rooms.length} {type}{rooms.length !== 1 ? 's' : ''}:
            </h5>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {rooms.map((room, index) => formatRoomDescription(room, index))}
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
      
      return `${totalOccupants} occupant${totalOccupants !== 1 ? 's' : ''} (${parts.join(', ')})`;
    } catch (e) {
      return "Data format error";
    }
  };

  const handleExportPDF = async (): Promise<Blob> => {
    try {
      return await exportAsPDF();
    } catch (error) {
      console.error("PDF export error:", error);
      throw error;
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection('feedback');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Design Brief Summary"
          description="We'll generate a summary of your brief, which you can review and edit."
        />
        
        <Tabs defaultValue="preview">
          <TabsContent value="preview">
            <SummaryTabContent 
              formData={formData}
              files={files}
              formatSpacesData={formatSpacesData}
              formatOccupantsData={formatOccupantsData}
              inspirationImages={inspirationImages}
            />
            
            <EmailExportSection 
              onExportPDF={handleExportPDF}
              clientName={formData.projectInfo.clientName || 'Untitled'}
              projectAddress={formData.projectInfo.projectAddress || undefined}
            />
          </TabsContent>
        </Tabs>
        
        <SummarySectionActions onPrevious={handlePrevious} />
      </div>
    </div>
  );
}
