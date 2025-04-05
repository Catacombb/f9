
import React from 'react';
import { cn } from '@/lib/utils';
import { useDesignBrief } from '@/context/DesignBriefContext';

interface DesignBriefSidebarProps {
  className?: string;
}

export function DesignBriefSidebar({ className }: DesignBriefSidebarProps) {
  const { currentSection, setCurrentSection } = useDesignBrief();
  
  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'projectInfo', label: 'Project Info' },
    { id: 'contractors', label: 'Project Team' },
    { id: 'budget', label: 'Budget' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'site', label: 'Site' },
    { id: 'spaces', label: 'Spaces' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'uploads', label: 'Uploads' },
    { id: 'communication', label: 'Communication' },
    { id: 'summary', label: 'Summary' },
  ];

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId as any);
    window.scrollTo(0, 0);
  };

  return (
    <div className={cn('py-4', className)}>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            className={cn(
              'flex w-full items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'hover:bg-muted/80',
              currentSection === section.id 
                ? 'bg-muted text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handleSectionClick(section.id)}
          >
            <span>{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
