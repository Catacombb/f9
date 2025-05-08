# Data Model Migration and Repository Cleanup

This document outlines a comprehensive plan for cleaning up the current Design Brief application codebase and transitioning to a Supabase-only architecture. These preparation steps are essential before implementing the client onboarding dashboard functionality.

## Current Issues Analysis

### 1. Problematic Storage Approach

1. **Local Storage Dependency**: 
   - `DesignBriefContext` (via `useFileAndSummaryManagement`) saves the entire `projectData` object to local storage using localStorage.
   - All components read state from `DesignBriefContext`, which is initialized from the default state or local storage.

2. **Incomplete Supabase Integration**:
   - `projectService.ts` contains functions (`saveProject`, `loadProject`) that map `projectData` to Supabase tables.
   - The service also uses local storage for tracking `current_project_id`, which adds unnecessary complexity.
   - The `loadProject` function is a placeholder that returns "Not implemented yet."
   - This functionality exists but is not integrated into the main UI flow.

### 2. Redundant Components

1. **Duplicate Map Implementations**:
   - `MapLocation.tsx` (using Mapbox GL)
   - `LeafletMapLocation.tsx` (using React Leaflet)
   - Both provide similar functionality with different libraries, creating maintenance overhead and inconsistent UX.

2. **Abandoned Refactoring**:
   - Parallel sidebar implementations:
     - `DesignBriefSidebar.tsx`
     - `DesignBriefSidebar.refactored.tsx`
   - These components have different section ordering and styling approaches.

### 3. Incomplete Authentication System

1. **Disconnected Authentication Flow**:
   - `useSupabase.tsx` hook has authentication functionality but isn't used in the UI.
   - Sign-in, sign-up, and sign-out functions redirect to non-existent routes (e.g., `/login`).
   - No corresponding UI components in the auth directory.

### 4. Mixed Data Structure Approaches

1. **Inconsistent Storage Keys**:
   - `design_brief_data` vs. `projectData` in localStorage.
   - Separate `current_project_id` tracking in localStorage.

2. **Inconsistent File Handling**:
   - Some components expect File objects, while others handle file metadata differently.

## Cleanup Strategy

### Phase 1: Component Rationalization (1-2 Weeks)

1. **Consolidate Map Components**:
   - Evaluate both map implementations and select one (LeafletMapLocation is recommended as it's open-source)
   - Delete the unused implementation
   - Update all references throughout the application to use the chosen implementation
   - Ensure any component-specific functionality is properly migrated

2. **Resolve Sidebar Duplication**:
   - Compare both sidebar implementations and select the best one based on features and code quality
   - Update all references to use the chosen implementation
   - Delete the unused implementation
   - Ensure consistent navigation and section ordering

3. **Create Empty Authentication Components Structure**:
   - Create basic file structure for Login and Registration components in src/components/auth/
   - Set up route definitions in App.tsx for authentication flows
   - Plan integration points between authentication and the existing application flow

### Phase 2: Supabase Integration (2-3 Weeks)

1. **Complete the `loadProject` Function**:
   - Implement proper error handling and data loading from Supabase
   - Create functions to fetch all related data (settings, rooms, etc.)
   - Build comprehensive data mapping between database tables and in-memory structures
   - Add error recovery mechanisms for partial data loading

2. **Remove Local Storage ID Tracking**:
   - Refactor projectService.ts to not rely on localStorage for ID management
   - Accept projectId as a parameter from the calling context instead
   - Update existing implementations to handle this architectural change
   - Add fallback mechanisms for backward compatibility during transition

3. **Create Authentication State Management**:
   - Design a proper AuthContext to replace the current useSupabase hook
   - Implement session persistence and token refresh
   - Add role-based access control structures
   - Set up authentication state observers for reactive UI updates

### Phase 3: DesignBriefContext Refactoring (2-3 Weeks)

1. **Create Supabase-First State Logic**:
   - Refactor DesignBriefContext to be authentication-aware
   - Implement initialization logic that prioritizes loading from Supabase
   - Add proper loading states, error handling, and retry mechanisms
   - Create clean APIs for components to interact with authenticated data

2. **Replace Local Storage Operations**:
   - Update useFileAndSummaryManagement.ts to use Supabase instead of localStorage
   - Modify state update methods to properly handle authenticated vs. guest states
   - Implement optimistic UI updates with rollback capabilities
   - Add syncing mechanisms for handling offline/online transitions

3. **Direct Supabase Storage Approach**:
   - Implement a direct Supabase-only storage approach
   - Skip migration of localStorage data to reduce complexity
   - Accept the trade-off of losing existing user data in localStorage
   - Focus on creating a clean, authentication-first implementation

### Phase 4: Authentication-Aware UI (1-2 Weeks)

1. **Implement Protected Routes**:
   - Create a ProtectedRoute component to handle authentication checks
   - Update App.tsx to use protected routes for appropriate content
   - Add authentication state loading indicators
   - Create redirect logic for unauthenticated access attempts

2. **Build Authentication UI Components**:
   - Implement Login component with email/password authentication
   - Create Registration flow with email verification
   - Add password recovery mechanisms with magic links
   - Style components to match the existing design system

### Phase 5: Database Schema Setup (1 Week)

1. **Update Database Schema**:
   - Create SQL migrations to add required tables and columns
   - Set up user_profiles table for role-based access control
   - Add status column to projects table for workflow tracking
   - Create activities table for logging all interactions and status changes

2. **Configure Security Policies**:
   - Set up Row Level Security policies for all tables
   - Create appropriate user role checks in database functions
   - Implement security for file access in Storage buckets
   - Add validation rules for data integrity

## Implementation Phases

### Phase 1: Foundation (2 Weeks)

1. **Clean Up Redundant Components**:
   - Select and consolidate duplicate components
   - Remove unused implementations
   - Clean up imports and references
   - Document architecture decisions

2. **Complete Authentication Flow**:
   - Create AuthContext provider
   - Implement Login/Register components
   - Set up protected routes
   - Test authentication flow end-to-end

3. **Complete Supabase Integration**:
   - Finish the loadProject implementation
   - Update projectService to not use localStorage
   - Create data mappers for all entity types
   - Test data loading and saving operations

### Phase 2: Storage Transition (2 Weeks)

1. **Refactor DesignBriefContext**:
   - Make it authentication-aware
   - Implement Supabase-first initialization logic
   - Add proper error states and recovery mechanisms

2. **Update File Management**:
   - Implement Supabase Storage for file uploads
   - Create mappings between file metadata and database records
   - Add file versioning capabilities
   - Implement secure file access controls

3. **Implement Save/Load Operations**:
   - Replace localStorage operations with Supabase calls
   - Add optimistic UI updates for better UX
   - Implement comprehensive error handling
   - Create data synchronization mechanisms

### Phase 3: Database Setup (1 Week)

1. **Execute Schema Migrations**:
   - Add required tables for the client onboarding dashboard
   - Set up user profiles and roles
   - Configure RLS policies
   - Create necessary indexes for performance

2. **Implement Database Triggers**:
   - Set up new user registration workflow
   - Configure automatic project creation
   - Implement activity logging
   - Create status change validation rules

### Phase 4: Testing & Validation (1 Week)

1. **Create Test Plan**:
   - Define test scenarios for authentication flows
   - Set up test cases for data persistence
   - Design migration testing procedures
   - Create test data for all entity types

2. **Validation Procedures**:
   - Implement validation for data model consistency
   - Test access controls and permissions
   - Verify performance under load
   - Validate error handling edge cases

## Migration Workflow for Existing Users

**Note on Migration Strategy Change**: The project has been simplified to use a direct Supabase-only approach rather than implementing a migration pathway for existing localStorage data. This decision prioritizes a clean implementation over data migration, with the understanding that this will result in users needing to re-enter any data they had previously stored locally. The benefit is a more straightforward codebase with fewer potential edge cases and failure modes.

## Conclusion

This comprehensive cleanup and migration plan prepares the codebase for implementing the client onboarding dashboard described in the implementation document. By addressing all the problematic patterns and establishing a clean, Supabase-first architecture, we lay the foundation for a robust multi-user system.

Key outcomes of this preparation phase:

1. **Clean Component Structure**: Removing redundancies and duplicated code
2. **Supabase-Only Storage**: Eliminating local storage dependencies
3. **Proper Authentication Flow**: Setting up a complete auth system with roles
4. **Direct Supabase Implementation**: Implementing a clean, authentication-first approach
5. **Schema Setup**: Preparing the database for the client onboarding dashboard

Once these preparation steps are complete, the implementation of the client onboarding dashboard as outlined in the implementation document can proceed on a solid foundation. 