
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Inspiration gallery with reliable image sources
const inspirationImages = [
  {
    id: 'img1',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    alt: 'Modern New Zealand style home with wood facade',
  },
  {
    id: 'img2',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    alt: 'Contemporary coastal style home',
  },
  {
    id: 'img3',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    alt: 'Luxury home with mountain views',
  },
  {
    id: 'img4',
    src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern house with clean lines',
  },
  {
    id: 'img5',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    alt: 'Beachfront home with outdoor deck',
  },
  {
    id: 'img6',
    src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1992&auto=format&fit=crop',
    alt: 'Lake view residence with panoramic windows',
  },
  {
    id: 'img7',
    src: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern beach home',
  },
  {
    id: 'img8',
    src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop',
    alt: 'Beach House exterior',
  },
  {
    id: 'img9',
    src: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=2070&auto=format&fit=crop',
    alt: 'Luxury Holiday Home',
  },
  {
    id: 'img10',
    src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
    alt: 'House with ocean view',
  },
  {
    id: 'img11',
    src: 'https://images.unsplash.com/photo-1501876725168-00c445821c9e?q=80&w=2070&auto=format&fit=crop',
    alt: 'Aerial view of modern beachfront home',
  },
  {
    id: 'img12',
    src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    alt: 'Luxury home with infinity pool',
  },
  {
    id: 'img13',
    src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    alt: 'Modern coastal residence',
  },
  {
    id: 'img14',
    src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    alt: 'Beach house',
  },
  {
    id: 'img15',
    src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern waterfront home',
  },
  {
    id: 'img16',
    src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern beach house exterior',
  },
  {
    id: 'img17',
    src: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop',
    alt: 'Harbour view house exterior',
  },
  {
    id: 'img18',
    src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop',
    alt: 'Lakehouse with mountain views',
  },
  {
    id: 'img19',
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern house exterior',
  },
  {
    id: 'img20',
    src: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?q=80&w=2071&auto=format&fit=crop',
    alt: 'Holiday Home exterior',
  },
];

export function InspirationSection() {
  const { files, updateFiles, setCurrentSection } = useDesignBrief();
  const [loadingImages, setLoadingImages] = React.useState<{ [key: string]: boolean }>({});
  
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

  const handleImageLoad = (imageId: string) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string, src: string) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: true }));
    // Try to reload the image after a delay
    setTimeout(() => {
      const img = document.getElementById(`img-${imageId}`) as HTMLImageElement;
      if (img) {
        img.src = src;
      }
    }, 2000);
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
                {loadingImages[image.id] && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                  id={`img-${image.id}`}
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id, image.src)}
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
