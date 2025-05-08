import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { getRoleDisplayName } from '@/lib/supabase/services/roleService';
import { AppLogo } from '@/components/AppLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

type UserRole = 'admin' | 'client' | null;

interface DashboardHeaderProps {
  userRole: UserRole;
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const { user, signOut } = useSupabase();
  const [initials, setInitials] = useState('');
  
  // Prepare user initials for avatar fallback
  useEffect(() => {
    if (user?.email) {
      // Use first letter of email or if possible, first letter of each part of the name
      const email = user.email;
      const atIndex = email.indexOf('@');
      const username = atIndex !== -1 ? email.substring(0, atIndex) : email;
      
      // Check if username has parts separated by dots, hyphens, or underscores
      const parts = username.split(/[._-]/);
      if (parts.length > 1) {
        setInitials(parts.map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2));
      } else {
        setInitials(username.substring(0, 2).toUpperCase());
      }
    } else {
      setInitials('U');
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
      <div className="md:hidden">
        <AppLogo size="small" />
      </div>
      
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* User role badge */}
        {userRole && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            userRole === 'admin' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-gray-200 text-gray-700'
          }`}>
            {getRoleDisplayName(userRole)}
          </span>
        )}
        
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email}</p>
                {userRole && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {getRoleDisplayName(userRole)}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 