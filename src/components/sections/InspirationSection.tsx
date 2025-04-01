
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// New Zealand architectural homes for inspiration gallery
const inspirationImages = [
  {
    id: 'img1',
    src: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop',
    alt: 'Modern New Zealand house with glass facade',
    category: 'Exterior',
  },
  {
    id: 'img2',
    src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop',
    alt: 'Contemporary coastal New Zealand home',
    category: 'Exterior',
  },
  {
    id: 'img3',
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
    alt: 'Minimalist New Zealand living space with mountain views',
    category: 'Interior',
  },
  {
    id: 'img4',
    src: 'https://images.unsplash.com/photo-1600566752355-09c79c71a7b0?w=800&auto=format&fit=crop',
    alt: 'Open plan New Zealand kitchen and dining',
    category: 'Interior',
  },
  {
    id: 'img5',
    src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
    alt: 'Auckland modern house with outdoor deck',
    category: 'Exterior',
  },
  {
    id: 'img6',
    src: 'https://images.unsplash.com/photo-1575403071235-5dcd06cbf169?w=800&auto=format&fit=crop',
    alt: 'Queenstown cabin with lake views',
    category: 'Exterior',
  },
  {
    id: 'img7',
    src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
    alt: 'Sustainable timber New Zealand home',
    category: 'Exterior',
  },
  {
    id: 'img8',
    src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop',
    alt: 'Modern New Zealand bathroom with freestanding bath',
    category: 'Interior',
  },
  {
    id: 'img9',
    src: 'https://images.unsplash.com/photo-1600607687644-c7f34a94d0b0?w=800&auto=format&fit=crop',
    alt: 'New Zealand beachfront home with indoor-outdoor flow',
    category: 'Interior',
  },
  {
    id: 'img10',
    src: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=800&auto=format&fit=crop',
    alt: 'Wellington eco-home with native garden',
    category: 'Exterior',
  },
];

export function InspirationSection() {
  const { files, updateFiles, setCurrentSection } = useDesignBrief();
  const [filter, setFilter] = useState<string | null>(null);
  
  const toggleImageSelection = (imageId: string) => {
    const updatedSelections = files.inspirationSelections.includes(imageId)
      ? files.inspirationSelections.filter(id => id !== imageId)
      : [...files.inspirationSelections, imageId];
    
    updateFiles({ inspirationSelections: updatedSelections });
  };
  
  const filteredImages = filter 
    ? inspirationImages.filter(img => img.category === filter)
    : inspirationImages;
  
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
          Select images of New Zealand architectural homes that inspire you or reflect your design preferences. Your selections will help us understand your aesthetic tastes.
        </p>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'Interior' ? "default" : "outline"}
            onClick={() => setFilter('Interior')}
            size="sm"
          >
            Interiors
          </Button>
          <Button
            variant={filter === 'Exterior' ? "default" : "outline"}
            onClick={() => setFilter('Exterior')}
            size="sm"
          >
            Exteriors
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
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
              <CardContent className="p-3">
                <p className="text-sm">{image.alt}</p>
                <p className="text-xs text-muted-foreground">{image.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Selected {files.inspirationSelections.length} of {inspirationImages.length} images
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
