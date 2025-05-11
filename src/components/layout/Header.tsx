import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../auth/UserProfile';
import { useStableAuth } from '@/hooks/useStableAuth';

export const Header: React.FC = () => {
  const { user } = useStableAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl px-4 md:px-8">
        <Link to="/dashboard" className="flex items-center space-x-2">
          {/* You can replace this with an SVG logo or an Image component */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="font-bold text-xl hidden sm:inline-block">F9 Onboarding</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Add other nav items here if needed */}
          {user && <UserProfile />}
        </div>
      </div>
    </header>
  );
}; 