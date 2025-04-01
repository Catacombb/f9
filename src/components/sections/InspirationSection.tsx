
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// New Zealand architectural homes from archipro.co.nz for inspiration gallery
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
          Select images of New Zealand architectural homes that inspire you or reflect your design preferences. 
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
              <div className="relative aspect-w-4 aspect-h-3 h-48">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
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
            You can also upload your own inspiration images in the next section
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
