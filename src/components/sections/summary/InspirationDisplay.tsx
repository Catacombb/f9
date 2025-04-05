
import React from 'react';

interface InspirationImage {
  id: string;
  src: string;
  alt: string;
}

interface InspirationDisplayProps {
  inspirationSelections: string[];
  inspirationImages: InspirationImage[];
}

export function InspirationDisplay({ inspirationSelections, inspirationImages }: InspirationDisplayProps) {
  if (inspirationSelections.length === 0) return null;
  
  return (
    <div className="pb-6 border-b">
      <h4 className="text-lg font-bold mb-4">Inspiration Selections</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {inspirationSelections.map((id) => {
          const image = inspirationImages.find(img => img.id === id);
          return image ? (
            <div key={id} className="aspect-video relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-md">
                {image.alt}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
