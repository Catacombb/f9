
import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  isBold?: boolean;
}

export function SectionHeader({ title, description, isBold = true }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className={`text-2xl ${isBold ? 'font-bold' : 'font-semibold'} mb-2`}>{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
