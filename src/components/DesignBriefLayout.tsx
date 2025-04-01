
import React from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';
import { ThemeToggle } from './ThemeProvider';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { AppLogo } from './AppLogo';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  const { lastSaved } = useDesignBrief();
  const { toast } = useToast();
  
  const lastSavedFormatted = lastSaved 
    ? formatDistanceToNow(new Date(lastSaved), { addSuffix: true })
    : 'Not saved yet';
  
  const showSaveConfirmation = () => {
    toast({
      title: "Progress Saved",
      description: "Your design brief is automatically saved in your browser.",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesignBriefSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10">
          <div className="flex items-center space-x-2">
            <AppLogo size="small" />
            <Button 
              variant="ghost" 
              className="flex items-center text-muted-foreground" 
              onClick={showSaveConfirmation}
            >
              <Save className="h-4 w-4 mr-2" />
              <span>Saved {lastSavedFormatted}</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        <footer className="h-12 border-t flex items-center justify-between px-4 text-xs text-muted-foreground">
          <div>© 2023 Northstar - www.nickharrison.co</div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">About Northstar</Link>
            <a href="#help" className="hover:underline">Need help?</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
