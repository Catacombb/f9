
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Using the same inspiration images data from InspirationSection
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
    src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
    alt: 'House with ocean view',
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
];

export function InspirationGallery() {
  const { files, updateFiles } = useDesignBrief();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  
  const toggleImageSelection = (imageId: string) => {
    const updatedSelections = files.inspirationSelections.includes(imageId)
      ? files.inspirationSelections.filter(id => id !== imageId)
      : [...files.inspirationSelections, imageId];
    
    updateFiles({ inspirationSelections: updatedSelections });
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    // Check file types (only images)
    const imageFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== fileList.length) {
      toast({
        title: "Invalid files",
        description: "Only image files are allowed in the Inspiration section.",
        variant: "destructive",
      });
    }
    
    // Check if adding these files would exceed the 10-file limit
    if (files.uploadedInspirationImages.length + imageFiles.length > 10) {
      toast.error("You can upload a maximum of 10 inspiration images.");
      return;
    }
    
    // Add the new files to the uploaded files array
    updateFiles({ 
      uploadedInspirationImages: [...files.uploadedInspirationImages, ...imageFiles] 
    });
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };
  
  const handleRemoveInspirationImage = (index: number) => {
    const updatedFiles = [...files.uploadedInspirationImages];
    updatedFiles.splice(index, 1);
    updateFiles({ uploadedInspirationImages: updatedFiles });
  };
  
  return (
    <div className="space-y-8">
      {/* Upload your own inspiration images */}
      <div>
        <h3 className="text-lg font-medium mb-3">Upload Your Own Inspiration</h3>
        <Card className="p-6">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 mb-4 text-center">
            <div className="flex flex-col items-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Upload inspiration images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop images here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Accepted file types: JPG, PNG, GIF (Max 5MB per file)
              </p>
              <label htmlFor="inspiration-upload">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Images
                  </span>
                </Button>
              </label>
              <input
                id="inspiration-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
              />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            {files.uploadedInspirationImages.length} of 10 inspiration images uploaded
          </p>

          {files.uploadedInspirationImages.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-3">Your Uploaded Inspiration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.uploadedInspirationImages.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className="relative aspect-video group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded inspiration ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveInspirationImage(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Gallery of pre-selected images */}
      <div>
        <h3 className="text-lg font-medium mb-3">Select from our gallery</h3>
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
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Selected {files.inspirationSelections.length} of {inspirationImages.length} gallery images
        </p>
        <p className="text-muted-foreground mt-2">
          {files.uploadedInspirationImages.length > 0 
            ? `You've uploaded ${files.uploadedInspirationImages.length} custom inspiration images`
            : "Upload your own inspiration images using the form above"}
        </p>
      </div>
    </div>
  );
}
