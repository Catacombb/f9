import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, Pie, Bar, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from 'recharts';
import { Database } from '@/lib/supabase/database.types';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

type ProjectCount = {
  brief: number;
  sent: number;
  complete: number;
  total: number;
};

interface StatusSummaryProps {
  projectCounts: ProjectCount;
  className?: string;
}

export function StatusSummary({ projectCounts, className }: StatusSummaryProps) {
  // Transform data for pie chart
  const pieData = [
    { name: 'Brief', value: projectCounts.brief, color: '#3b82f6' }, // blue-500
    { name: 'Sent', value: projectCounts.sent, color: '#f97316' },   // orange-500
    { name: 'Complete', value: projectCounts.complete, color: '#22c55e' }, // green-500
  ];

  // Transform data for bar chart
  const barData = [
    { name: 'Brief', value: projectCounts.brief, color: '#3b82f6', icon: Clock },
    { name: 'Sent', value: projectCounts.sent, color: '#f97316', icon: ArrowRight },
    { name: 'Complete', value: projectCounts.complete, color: '#22c55e', icon: CheckCircle },
  ];

  // Calculate percentages
  const getPercentage = (value: number) => {
    return projectCounts.total > 0 
      ? Math.round((value / projectCounts.total) * 100) 
      : 0;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Project Status Summary</CardTitle>
        <CardDescription>Distribution of projects by current status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart for status distribution */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} project${value !== 1 ? 's' : ''}`, 
                    'Count'
                  ]} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for status counts */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} project${value !== 1 ? 's' : ''}`, 
                    'Count'
                  ]} 
                />
                <Bar dataKey="value">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats summary with percentages */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <div className="text-blue-500 flex items-center mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-medium">Brief</span>
            </div>
            <div className="text-2xl font-bold">{projectCounts.brief}</div>
            <div className="text-sm text-muted-foreground">{getPercentage(projectCounts.brief)}%</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-orange-500 flex items-center mb-1">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span className="font-medium">Sent</span>
            </div>
            <div className="text-2xl font-bold">{projectCounts.sent}</div>
            <div className="text-sm text-muted-foreground">{getPercentage(projectCounts.sent)}%</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-green-500 flex items-center mb-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">Complete</span>
            </div>
            <div className="text-2xl font-bold">{projectCounts.complete}</div>
            <div className="text-sm text-muted-foreground">{getPercentage(projectCounts.complete)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 