import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/lib/supabase/database.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'] & {
  projects_count?: number;
  last_activity?: string;
  email?: string;
};

interface RecentClientsProps {
  clients: UserProfile[];
  className?: string;
  maxItems?: number;
}

export function RecentClients({ clients, className, maxItems = 5 }: RecentClientsProps) {
  const displayClients = maxItems ? clients.slice(0, maxItems) : clients;

  // Function to get initials from email or id
  const getInitials = (client: UserProfile) => {
    if (client.email) {
      const parts = client.email.split('@')[0].split(/[._-]/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return client.id.substring(0, 2).toUpperCase();
  };

  // Function to get avatar color based on user id
  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-teal-100 text-teal-800'
    ];
    
    // Simple hash function to pick a color
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  if (clients.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Clients
          </CardTitle>
          <CardDescription>No clients to display</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          No clients registered yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Recent Clients
        </CardTitle>
        <CardDescription>Recently active client accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayClients.map(client => (
            <div key={client.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className={getAvatarColor(client.id)}>
                  <AvatarFallback>{getInitials(client)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{client.email || `Client ${client.id.substring(0, 8)}`}</div>
                  <div className="text-sm text-muted-foreground">
                    {client.projects_count || 0} project{client.projects_count !== 1 ? 's' : ''}
                    {client.last_activity && (
                      <span className="text-xs ml-2">
                        • Last active {formatDistanceToNow(new Date(client.last_activity), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/dashboard/clients/${client.id}`}>
                  <span className="sr-only">View client</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 