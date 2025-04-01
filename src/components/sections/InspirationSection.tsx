
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock inspiration gallery images
const inspirationImages = [
  {
    id: 'img1',
    src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop',
    alt: 'Modern living room with large windows',
    category: 'Interior',
  },
  {
    id: 'img2',
    src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop',
    alt: 'Contemporary kitchen with island',
    category: 'Interior',
  },
  {
    id: 'img3',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
    alt: 'Minimalist bedroom design',
    category: 'Interior',
  },
  {
    id: 'img4',
    src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop',
    alt: 'Industrial style home office',
    category: 'Interior',
  },
  {
    id: 'img5',
    src: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&auto=format&fit=crop',
    alt: 'Modern house exterior with garden',
    category: 'Exterior',
  },
  {
    id: 'img6',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    alt: 'Minimalist facade with large windows',
    category: 'Exterior',
  },
  {
    id: 'img7',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
    alt: 'Wooden deck with outdoor furniture',
    category: 'Exterior',
  },
  {
    id: 'img8',
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop',
    alt: 'Contemporary bathroom with freestanding bath',
    category: 'Interior',
  },
  {
    id: 'img9',
    src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop',
    alt: 'Open plan kitchen and dining area',
    category: 'Interior',
  },
  {
    id: 'img10',
    src: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800&auto=format&fit=crop',
    alt: 'Scandinavian style living room',
    category: 'Interior',
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
          Select images that inspire you or reflect your design preferences. Your selections will help us understand your aesthetic tastes.
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
