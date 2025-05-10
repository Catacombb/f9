# Duplicate Project Creation Fixes

This document explains the fixes implemented to address the issue where creating one design brief resulted in three briefs appearing in the admin dashboard.

## Root Causes

The investigation identified multiple sources causing duplicate project creation:

1. **Multiple Creation Points**:
   - Registration trigger auto-creating projects when users register
   - `getOrCreateProject` function creating projects even when not needed
   - Direct SQL project creation in database calls

2. **Missing Role Validation**:
   - Admin users were incorrectly allowed to have projects
   - URL parameter not properly checked in DesignBriefContext

3. **Race Conditions**:
   - Multiple async calls creating duplicate projects
   - No protection against React strict mode double-renders

## Implemented Fixes

### 1. Database Fixes

- **Remove Auto Project Trigger** (`fix_duplicate_briefs.sql`, `remove_auto_project_trigger.sql`):
  - Disabled automatic project creation in the registration trigger
  - Modified user registration handler to only create user profile without project

- **Fix Duplicate Projects** (`fix_duplicate_briefs.sql`):
  - Added cleanup function to keep only the oldest project for each user
  - Removed duplicate projects from the database

- **Fix Admin Project Handling** (`fix_admin_project_handling.sql`):
  - Updated database functions to prevent admin users from having projects
  - Added validation to check user role before creating projects

- **Fix RLS Policies** (`fix_rls_policies.sql`):
  - Updated Row Level Security policies to prevent admins from creating projects for themselves
  - Added role validation to project creation policies

### 2. Frontend Fixes

- **Enhanced DesignBriefContext** (`DesignBriefContext.tsx`):
  - Added project creation tracking to prevent duplicates
  - Improved URL parameter validation
  - Added more explicit error logging
  - Added checks to prevent admin users from creating projects

- **New Validation Hook** (`use-project-params.ts`):
  - Created a dedicated hook to validate URL parameters
  - Added role-based validation for project creation
  - Prioritized projectId parameter over create parameter

- **Fix File Loading Bug** (`projectService.ts`):
  - Fixed the bug in `loadProject` that wasn't properly mapping file metadata
  - Added better error handling and logging for file processing
  - Improved file category detection and mapping

## Testing the Fixes

To verify the fixes are working correctly:

1. **User Registration**:
   - Register a new user and verify only one project is created (not automatic)
   - Check admin dashboard to confirm no duplicate projects

2. **Create Brief Button**:
   - Click "Create Brief" button from client dashboard
   - Verify that only one project is created
   - Check admin dashboard to confirm no duplicates

3. **Admin Users**:
   - Log in as admin user
   - Verify admin cannot create projects for themselves
   - Verify admin can view all client projects

4. **File Loading**:
   - Upload files to a project
   - Refresh the page or navigate away and back
   - Verify all uploaded files are still visible

## Future Considerations

1. **Monitoring**: Continue monitoring for any duplicate projects
2. **Database Cleanup**: Run periodic checks for orphaned records
3. **Transaction Handling**: Consider further improvements to transaction handling in database functions
4. **Error Reporting**: Enhance error reporting for better diagnostics 