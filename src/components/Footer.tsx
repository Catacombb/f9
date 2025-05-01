
import React from 'react';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-4 border-t bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600 gap-4">
          <div className="flex items-center">
            <span className="font-medium mr-1">Email:</span>
            <a 
              href="mailto:LMC@F9Productions.com"
              className="hover:text-gray-900 transition-colors"
            >
              LMC@F9Productions.com
            </a>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <span className="font-medium mr-1">Phone:</span>
            <a 
              href="tel:3037757406"
              className="hover:text-gray-900 transition-colors"
            >
              303.775.7406
            </a>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <span className="font-medium mr-1">Website:</span>
            <a 
              href="https://f9productions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors flex items-center"
            >
              www.f9productions.com
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
