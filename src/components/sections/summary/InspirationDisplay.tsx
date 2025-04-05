
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
    <div>
      <h4 className="text-lg font-bold mb-4">Inspiration Selections</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {inspirationSelections.map((id) => {
          const image = inspirationImages.find(img => img.id === id);
          return image ? (
            <div key={id} className="aspect-w-4 aspect-h-3 h-24">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover rounded-md"
              />
              <p className="text-xs mt-1">{image.alt}</p>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
