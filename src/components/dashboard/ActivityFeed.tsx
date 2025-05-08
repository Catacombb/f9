import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/lib/supabase/database.types';
import { getActivityDescription } from '@/lib/supabase/services/activitiesService';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Calendar
} from 'lucide-react';

type Activity = Database['public']['Tables']['activities']['Row'] & {
  projects?: {
    client_name: string;
  } | null;
};

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

export function ActivityFeed({ 
  activities, 
  className, 
  maxItems = 5,
  showHeader = true 
}: ActivityFeedProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  // Get icon based on activity type
  const getActivityIcon = (activity: Activity) => {
    const type = activity.activity_type as string;
    
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'document_upload':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'status_change':
        const details = activity.details as Record<string, any>;
        const newStatus = details?.new_status as string;
        
        if (newStatus === 'brief') return <Clock className="h-4 w-4 text-blue-500" />;
        if (newStatus === 'sent') return <ArrowRight className="h-4 w-4 text-orange-500" />;
        if (newStatus === 'complete') return <CheckCircle className="h-4 w-4 text-green-500" />;
        
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Group activities by date
  const groupedActivities = displayActivities.reduce((acc, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (activities.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>No recent activity to display</CardDescription>
          </CardHeader>
        )}
        <CardContent className="text-center py-6 text-muted-foreground">
          No activities recorded yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest project and client activities</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="font-medium text-sm">{date}</h4>
              </div>
              <div className="space-y-3">
                {groupedActivities[date].map(activity => {
                  const details = activity.details as Record<string, any>;
                  // Get project name from joined projects data if available, or from details, or default to "Unnamed Project"
                  const projectName = activity.projects?.client_name || details?.project_name || 'Unnamed Project';
                  // Get client name from details or default
                  const clientName = details?.client_name || 'Unknown Client';
                  
                  return (
                    <div key={activity.id} className="flex gap-2 bg-accent/50 p-3 rounded-lg">
                      <div className="mt-0.5">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {projectName}
                          <span className="text-muted-foreground mx-1">•</span>
                          <span className="text-muted-foreground text-xs font-normal">
                            {clientName}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getActivityDescription(activity)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 