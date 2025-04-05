
import React from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-64 mb-6 lg:mb-0">
          <div className="lg:fixed lg:top-20 lg:w-64">
            <DesignBriefSidebar />
          </div>
        </div>
        <div className="flex-1 lg:pl-8">
          <div className="max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
