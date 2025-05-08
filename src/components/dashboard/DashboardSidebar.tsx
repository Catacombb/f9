import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSupabase } from '@/hooks/useSupabase';
import { AppLogo } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  CheckSquare,
  User,
  Activity
} from 'lucide-react';

type UserRole = 'admin' | 'client' | null;

interface DashboardSidebarProps {
  userRole: UserRole;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const { signOut } = useSupabase();

  // Define navigation links based on user role
  const navLinks = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      roles: ['admin', 'client']
    },
    {
      title: 'Projects',
      href: '/dashboard/projects',
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      roles: ['admin', 'client']
    },
    {
      title: 'Recent Activity',
      href: '/dashboard/activity',
      icon: <Activity className="mr-2 h-4 w-4" />,
      roles: ['admin', 'client']
    }
  ];

  // Admin-only links
  const adminLinks = [
    {
      title: 'Clients',
      href: '/dashboard/clients',
      icon: <Users className="mr-2 h-4 w-4" />,
      roles: ['admin']
    },
    {
      title: 'Completed Projects',
      href: '/dashboard/completed',
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
      roles: ['admin']
    }
  ];

  // Settings and profile links
  const settingsLinks = [
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: <User className="mr-2 h-4 w-4" />,
      roles: ['admin', 'client']
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      roles: ['admin', 'client']
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter links based on user role
  const filteredNavLinks = navLinks.filter(
    link => !link.roles || link.roles.includes(userRole as string)
  );

  const filteredAdminLinks = adminLinks.filter(
    link => !link.roles || link.roles.includes(userRole as string)
  );

  const filteredSettingsLinks = settingsLinks.filter(
    link => !link.roles || link.roles.includes(userRole as string)
  );

  return (
    <div className="h-full flex flex-col border-r bg-background">
      {/* Logo Section */}
      <div className="p-6">
        <AppLogo size="small" />
      </div>
      
      <Separator />
      
      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
            <div className="space-y-1">
              {filteredNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                  end={link.href === '/dashboard'}
                >
                  {link.icon}
                  {link.title}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Admin-only section */}
          {userRole === 'admin' && filteredAdminLinks.length > 0 && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Administration
              </h2>
              <div className="space-y-1">
                {filteredAdminLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    {link.icon}
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
          
          {/* Settings Section */}
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Settings
            </h2>
            <div className="space-y-1">
              {filteredSettingsLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  {link.icon}
                  {link.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      {/* Logout Button */}
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
} 