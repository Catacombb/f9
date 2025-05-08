import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { searchProjects } from '@/lib/supabase/services/dashboardService';
import { getAllStatusValues, getStatusDisplayName } from '@/lib/supabase/services/statusService';
import { ProjectCard } from './ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectListProps {
  initialProjects?: Project[];
  isAdmin?: boolean;
}

export function ProjectList({ initialProjects, isAdmin = false }: ProjectListProps) {
  const { user } = useSupabase();
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(!initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'updated_at' | 'client_name'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load projects if not provided as props
  useEffect(() => {
    async function loadProjects() {
      if (initialProjects || !user) return;
      
      try {
        setLoading(true);
        const fetchedProjects = await searchProjects('', user.id);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [initialProjects, user]);

  // Apply filters and sorting whenever relevant state changes
  useEffect(() => {
    if (loading) return;

    let result = [...projects];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        (project.client_name?.toLowerCase().includes(term)) ||
        (project.project_description?.toLowerCase().includes(term)) ||
        (project.project_address?.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      // Handle nulls/undefined for the sort field
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      // Perform the actual comparison
      const comparison = sortField === 'updated_at'
        ? new Date(bVal).getTime() - new Date(aVal).getTime() // For dates
        : String(aVal).localeCompare(String(bVal));           // For strings
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, sortField, sortDirection, loading]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Handle sort field change
  const handleSortFieldChange = (value: string) => {
    setSortField(value as 'updated_at' | 'client_name');
  };

  if (loading) {
    return <ProjectListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {getAllStatusValues().map(status => (
                <SelectItem key={status} value={status}>
                  {getStatusDisplayName(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Last Updated</SelectItem>
              <SelectItem value="client_name">Client Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={toggleSortDirection}>
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-lg font-semibold">No projects found</p>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filters"
              : "Create a new project to get started"}
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Skeleton for projects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    </div>
  );
} 