import { Activity } from 'lucide-react';

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <aside className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* Existing navigation links */}
            
            {/* Projects link */}
            <Link
              to="/dashboard/projects"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/projects" && "bg-accent text-primary"
              )}
            >
              <Users className="h-4 w-4" />
              <span>{isAdmin ? 'All Projects' : 'My Projects'}</span>
            </Link>
            
            {/* File Cleanup link for admin users */}
            {isAdmin && (
              <Link
                to="/dashboard/file-cleanup"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === "/dashboard/file-cleanup" && "bg-accent text-primary"
                )}
              >
                <Trash2 className="h-4 w-4" />
                <span>File Cleanup</span>
              </Link>
            )}
            
            {/* Diagnostics link for admin users */}
            {isAdmin && (
              <Link
                to="/dashboard/diagnostics"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === "/dashboard/diagnostics" && "bg-accent text-primary"
                )}
              >
                <Activity className="h-4 w-4" />
                <span>Diagnostics</span>
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </aside>
  );
} 