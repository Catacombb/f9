
import React from 'react';
import { Upload, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProjectFiles } from '@/types';

// Architecture inspiration images from ArchiPro
const inspirationImages = [
  { id: 'modern-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', label: 'Modern Villa' },
  { id: 'scandinavian-1', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f', label: 'Scandinavian Home' },
  { id: 'industrial-1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', label: 'Industrial Loft' },
  { id: 'minimalist-1', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457', label: 'Minimalist Design' },
  { id: 'traditional-1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0', label: 'Traditional Home' },
  { id: 'contemporary-1', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92', label: 'Contemporary Space' },
  { id: 'mid-century-1', url: 'https://images.unsplash.com/photo-1556702571-3e11dd2b1a92', label: 'Mid-Century Modern' },
  { id: 'farmhouse-1', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', label: 'Farmhouse Style' },
];

interface InspirationImagesProps {
  selectedImages: string[];
  files: ProjectFiles;
  onImageSelect: (imageId: string) => void;
  onFileUpload: (files: FileList | null) => void;
}

export function InspirationImages({
  selectedImages,
  files,
  onImageSelect,
  onFileUpload
}: InspirationImagesProps) {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event.target.files);
    // Clear the input
    event.target.value = '';
  };

  return (
    <div className="design-brief-form-group">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inspiration Images</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select images that represent your design preferences and inspirations.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inspirationImages.map((image) => (
            <div 
              key={image.id}
              className={`relative overflow-hidden rounded-md transition-all cursor-pointer aspect-video ${
                selectedImages.includes(image.id) ? 'ring-4 ring-primary' : 'hover:opacity-90'
              }`}
              onClick={() => onImageSelect(image.id)}
            >
              <img 
                src={image.url} 
                alt={image.label} 
                className="object-cover w-full h-full"
              />
              {selectedImages.includes(image.id) && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                {image.label}
              </div>
            </div>
          ))}
        </div>

        {/* Display uploaded images */}
        {files?.uploadedInspirationImages && files.uploadedInspirationImages.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Your Uploaded Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.uploadedInspirationImages.map((image, index) => (
                <div key={index} className="relative overflow-hidden rounded-md aspect-video">
                  {image.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Uploaded Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-muted w-full h-full">
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-xs">{image.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload your own images with consistent styling */}
        <div className="mt-6">
          <Card className="p-6 border border-primary/20 bg-primary/5">
            <div className="text-center">
              <Upload className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h4 className="text-md font-medium mb-2">Upload Your Own Inspiration</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your own inspiration images, mood boards, or sketches (JPG, PNG, PDF accepted, max 5MB)
              </p>
              <div className="flex justify-center">
                <div className="relative">
                  <input 
                    type="file" 
                    id="inspirationUpload" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                    multiple
                    onChange={handleFileInputChange}
                  />
                  <Button type="button" variant="outline" className="relative bg-primary text-primary-foreground hover:bg-primary/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
