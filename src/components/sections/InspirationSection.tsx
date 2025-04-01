
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// 20 New Zealand exterior architectural homes from archipro.co.nz for inspiration gallery
const inspirationImages = [
  {
    id: 'img1',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-1-Architect-Designed-Home-Waiheke-Island-2.jpg',
    alt: 'Modern New Zealand house with glass facade',
  },
  {
    id: 'img2',
    src: 'https://archipro.co.nz/assets/Uploads/the-pavilion-house-cove-construction-1.jpg',
    alt: 'Contemporary coastal New Zealand home',
  },
  {
    id: 'img3',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Queenstown-luxury-architects-2.jpg',
    alt: 'Queenstown luxury home with mountain views',
  },
  {
    id: 'img4',
    src: 'https://archipro.co.nz/assets/Uploads/rjqyuOr.jpg',
    alt: 'Auckland modern house with clean lines',
  },
  {
    id: 'img5',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Pakiri-Beach-House-1.jpg',
    alt: 'Beachfront home with outdoor deck',
  },
  {
    id: 'img6',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-lake-hayes-2.jpg',
    alt: 'Lake Hayes residence with panoramic views',
  },
  {
    id: 'img7',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Mt-Maunganui-House-01.jpg',
    alt: 'Mt Maunganui modern home',
  },
  {
    id: 'img8',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Omaha-Beach-House-exterior.jpg',
    alt: 'Omaha Beach House exterior',
  },
  {
    id: 'img9',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Te-Arai-Luxury-Holiday-Home-1.jpg',
    alt: 'Te Arai Luxury Holiday Home',
  },
  {
    id: 'img10',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Piha-House-1.jpg',
    alt: 'Piha House with ocean view',
  },
  {
    id: 'img11',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-DJI-0322.jpg',
    alt: 'Aerial view of modern beachfront home',
  },
  {
    id: 'img12',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-DYP-Photography-4.jpg',
    alt: 'Luxury home with infinity pool',
  },
  {
    id: 'img13',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Coastal-House-1.jpg',
    alt: 'Modern coastal residence',
  },
  {
    id: 'img14',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Kapiti-Beach-house-1.jpg',
    alt: 'Kapiti Beach house',
  },
  {
    id: 'img15',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Marlborough-Sounds-Bach-1.jpg',
    alt: 'Marlborough Sounds Bach',
  },
  {
    id: 'img16',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Waimarama-Beach-House-exterior.jpg',
    alt: 'Waimarama Beach House exterior',
  },
  {
    id: 'img17',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Kaipara-Harbour-House-exterior.jpg',
    alt: 'Kaipara Harbour House exterior',
  },
  {
    id: 'img18',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Wanaka-Lakehouse-1.jpg',
    alt: 'Wanaka Lakehouse',
  },
  {
    id: 'img19',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Matakana-House-exterior.jpg',
    alt: 'Matakana House exterior',
  },
  {
    id: 'img20',
    src: 'https://archipro.co.nz/assets/Uploads/_resampled/x2medium-Bay-of-Islands-Holiday-Home-exterior.jpg',
    alt: 'Bay of Islands Holiday Home exterior',
  },
];

export function InspirationSection() {
  const { files, updateFiles, setCurrentSection } = useDesignBrief();
  
  const toggleImageSelection = (imageId: string) => {
    const updatedSelections = files.inspirationSelections.includes(imageId)
      ? files.inspirationSelections.filter(id => id !== imageId)
      : [...files.inspirationSelections, imageId];
    
    updateFiles({ inspirationSelections: updatedSelections });
  };
  
  const handlePrevious = () => {
    setCurrentSection('architecture');
  };
  
  const handleNext = () => {
    setCurrentSection('uploads');
  };
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <h1 className="design-brief-section-title">Inspiration Gallery</h1>
        <p className="design-brief-section-description">
          Select exterior images of New Zealand architectural homes that inspire you or reflect your design preferences. 
          Your selections will help us understand your aesthetic tastes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {inspirationImages.map((image) => (
            <Card 
              key={image.id} 
              className={cn(
                "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md",
                files.inspirationSelections.includes(image.id) 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : ""
              )}
              onClick={() => toggleImageSelection(image.id)}
            >
              <div className="relative aspect-video">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Fallback for broken images
                    target.src = "/placeholder.svg";
                    target.alt = "Image unavailable";
                    // Add a retry mechanism
                    setTimeout(() => {
                      target.src = image.src;
                    }, 1500);
                  }}
                  loading="lazy"
                />
                {files.inspirationSelections.includes(image.id) && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Selected {files.inspirationSelections.length} of {inspirationImages.length} images
          </p>
          <p className="text-muted-foreground mt-2">
            You can upload your own inspiration images in the next section
          </p>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Architecture</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: File Uploads</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
