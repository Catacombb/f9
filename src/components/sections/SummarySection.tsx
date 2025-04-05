import React from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    
    const roomsByLevel = formData.spaces.rooms.reduce((acc, room) => {
      try {
        const descriptionObj = JSON.parse(room.description);
        const level = descriptionObj.level || 'Unspecified';
        
        if (!acc[level]) {
          acc[level] = [];
        }
        
        acc[level].push(room);
        return acc;
      } catch (e) {
        if (!acc['Unspecified']) {
          acc['Unspecified'] = [];
        }
        acc['Unspecified'].push(room);
        return acc;
      }
    }, {} as Record<string, typeof formData.spaces.rooms>);
    
    const orderedLevels = Object.keys(roomsByLevel).sort((a, b) => {
      const levelOrder = {
        'Basement': 0,
        'Ground': 1,
        'Ground Floor': 1,
        'First': 2,
        'First Floor': 2,
        'Second': 3,
        'Second Floor': 3,
        'Third': 4,
        'Third Floor': 4,
        'Unspecified': 999,
      };
      
      const orderA = levelOrder[a] !== undefined ? levelOrder[a] : a.toLowerCase().includes('basement') ? 0 : 998;
      const orderB = levelOrder[b] !== undefined ? levelOrder[b] : b.toLowerCase().includes('basement') ? 0 : 998;
      return orderA - orderB;
    });
    
    const formatRoomDescription = (description: string) => {
      try {
        const descriptionObj = JSON.parse(description);
        
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
        
        return descriptionItems.length > 0 
          ? descriptionItems.join(". ") 
          : "No specific details";
      } catch (e) {
        return description;
      }
    };
    
    return (
      <div className="space-y-6">
        {orderedLevels.map(level => (
          <div key={level} className="space-y-4">
            <h5 className="font-medium text-base border-b pb-1">{level}</h5>
            
            {(() => {
              const roomsByType = roomsByLevel[level].reduce((acc, room) => {
                const type = room.isCustom && room.customName ? room.customName : room.type;
                if (!acc[type]) {
                  acc[type] = [];
                }
                acc[type].push(room);
                return acc;
              }, {} as Record<string, typeof formData.spaces.rooms>);
              
              return Object.entries(roomsByType).map(([type, rooms]) => (
                <div key={`${level}-${type}`}>
                  <p className="text-sm font-medium">
                    {type} ({rooms.length})
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {rooms.map((room, index) => (
                      <li key={index}>
                        {formatRoomDescription(room.description)}
                      </li>
                    ))}
                  </ul>
                </div>
              ));
            })()}
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
            
            <EmailExportSection 
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
