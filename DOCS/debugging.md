# Design Brief Application: Debugging & Issue Resolution Plan

## Overview of Issues

Based on a comprehensive analysis of the Design Brief application, we've identified several critical issues that need to be addressed:

1. **File Deletion Implementation Flaw**: Files removed through the UI aren't properly deleted from storage and database.
2. **Project Creation Reliability Issues**: Race conditions in project creation can lead to duplicates.
3. **Optimistic Locking Conflicts**: Insufficient UI handling of version conflicts.
4. **Inconsistent Error Handling**: Scattered error handling without a unified approach.

This document outlines a phased approach to effectively diagnose and resolve these issues while minimizing disruption to users and avoiding additional technical debt.

## Diagnostics Phase

Before implementing fixes, we need to confirm and measure the extent of each issue:

### File Deletion Issue Diagnosis

1. **Confirmed bug characteristics**:
   - Several uploaders (SiteDocumentsUploader, InspirationsUploader) only remove files from local state without calling the proper deletion function
   - Only SupportingDocumentsUploader properly calls deleteFile() which removes files from both storage and database
   - When files are removed only from local state, they remain in Supabase Storage and in the project_files table
   - Upon project reload, these "ghost files" reappear in the UI
   - This causes storage waste and confusion for users who thought they deleted files

2. **Implementation inconsistencies**:
   - The deleteFile function in DesignBriefContext is correctly implemented
   - The deleteProjectFile service function properly removes files from both storage and database
   - However, not all uploader components use these functions consistently
   - Some components like SiteDocumentsUploader and InspirationsUploader only call updateFiles() with a filtered array
   - Inconsistent handling pattern across different file category uploaders

3. **Established metrics**:
   - SQL queries show orphaned file records in project_files table
   - Storage bucket likely contains unused files that have been "removed" from UI but not properly deleted
   - Estimated storage usage by these orphaned files needs assessment
   - Impact on users is significant as files appear to be deleted but reappear later

### Project Creation Diagnosis

1. **Identified race condition sources**:
   - The `getOrCreateProject` client function has multiple points where race conditions can occur
   - Although PostgreSQL function includes a transaction, front-end implementation can still create duplicates
   - No unique constraint exists on `user_id` column in projects table to prevent duplicates
   - Multiple concurrent requests from the same user can create multiple projects
   - Front-end attempts retry logic (up to 3 times) but doesn't properly handle all race conditions

2. **Multi-layered creation approach issues**:
   - Front-end first checks for projects, then calls RPC function, then falls back to direct creation
   - Each layer introduces potential race conditions between checks and creation
   - Multiple code paths can lead to project creation (URL parameters, force creation, session storage)
   - The database function `get_or_create_project` contains a transaction but lacks a serializable isolation level
   - Complex fallback system can exacerbate race conditions rather than prevent them

3. **Implementation deficiencies**:
   - Missing unique constraint on `user_id` (one project per user rule not enforced at DB level)
   - Missing proper isolation level on PostgreSQL transaction
   - Inadequate locking strategy for concurrent operations
   - Lack of idempotency in creation operations
   - Force creation flags can bypass duplicate prevention

4. **Current mitigation measures**:
   - Client has retry mechanism (up to 3 attempts)
   - The system includes a `clean_duplicate_projects()` function, but it must be manually run
   - Session storage tracking helps reduce duplicate creation
   - Fallback to most recent project if creation fails

### Conflict Resolution Diagnosis

1. **Simulate concurrent edits**:
   - Open same project in multiple browsers/sessions
   - Make conflicting changes and observe behavior
   - Track user-reported conflict issues

### Error Handling Diagnosis

1. **Catalog error scenarios**:
   - Inventory all error handlers in the codebase
   - Document inconsistencies in approaches
   - Create a matrix of error types and current handling methods

## Phase 1: File Deletion Fix

This is our highest priority as it directly impacts user experience and wastes storage resources.

### Step 1: Enhance Uploader Components

1. **Modify file removal functions**:
   - Update all uploader components (`InspirationsUploader.tsx`, `SiteDocumentsUploader.tsx`, etc.)
   - Check if file objects have properties indicating persistence (`id`, `path`, etc.)
   - Call appropriate deletion method based on file status
   - Add loading state during deletion

### Step 2: Implement Backend Reconciliation

1. **Add reconciliation to save process**:
   - Enhance `saveProject()` to compare client-side files with database records
   - Generate delete operations for missing files
   - Create transaction to ensure atomicity

### Step 3: Cleanup Existing Files

**Status: Implemented**

Implementation details:
1. Created a file cleanup service (`fileCleanupService.ts`) to identify and clean up orphaned files
2. Implemented three types of orphaned file detection:
   - Files in storage but missing from database records
   - Files in database but missing from storage
   - Files with missing project references
3. Developed an admin interface for reviewing and confirming file deletions
4. Added dry-run capability to simulate cleanup without actual deletion
5. Created proper activity logging for all cleanup actions
6. Added a SQL migration for the necessary RPC function

The utility can be accessed by administrators via the dashboard sidebar under "File Cleanup".

### Testing for Phase 1

1. **Functional tests**:
   - Upload, delete, refresh cycle in different browsers
   - Verify storage and database state after operations
   - Test reconciliation with various file states

2. **Performance tests**:
   - Measure impact on save times with reconciliation
   - Test with large file counts
   - Verify behavior under network interruptions

### Success Criteria for Phase 1

- Files deleted from UI are permanently removed from storage and database
- No "ghost files" reappear on project reload
- Storage usage decreases as orphaned files are cleaned up

## Phase 2: Unified Error Handling

Improving error handling creates a foundation for other phases.

### Step 1: Error Categorization

1. **Define error taxonomy**:
   - Network errors
   - Validation errors
   - Permission errors
   - Conflict errors
   - System errors

2. **Create error handling service**:
   - Central handler for converting raw errors to categorized errors
   - Consistent error object structure
   - Correlation ID generation

### Step 2: Context and UI Integration

1. **Enhance DesignBriefContext**:
   - Update error state to use categorized errors
   - Add error dismissal methods
   - Implement retry capabilities for recoverable errors

2. **Create error UI components**:
   - Standardized toast notifications
   - Section-specific error displays
   - Global error boundary

### Step 3: Retrofit Existing Code

1. **Update service functions**:
   - Modify key functions (`saveProject`, `loadProject`, etc.) to use the new error system
   - Improve error detail quality
   - Add context to error objects

### Testing for Phase 2

1. **Simulated error testing**:
   - Force various error types and verify handling
   - Test recovery paths
   - Verify error information quality

2. **User experience testing**:
   - Evaluate clarity of error messages
   - Test comprehension of error resolution steps
   - Measure time to recovery from errors

### Success Criteria for Phase 2

- All errors are categorized consistently
- Users receive clear, actionable error messages
- Error states are visually indicated in appropriate UI components
- Retry mechanisms exist for recoverable errors

## Phase 3: Conflict Resolution Enhancement

With better error handling in place, we can now tackle version conflicts.

### Step 1: Conflict Detection Improvements

1. **Enhance optimistic locking**:
   - Add more granular version tracking (section-level versions)
   - Improve detection of what specifically changed
   - Track last editor information

### Step 2: Conflict UI Development

1. **Create conflict resolution interface**:
   - Modal/overlay showing conflicting changes
   - Options to keep local changes, use remote changes, or merge
   - Visual diff for conflicting sections

2. **Realtime notifications**:
   - Implement concurrent editing warnings using Supabase Realtime
   - Add presence indicators showing who's editing

### Step 3: Merging Capability

1. **Develop merge strategies**:
   - Automatic merging for non-conflicting changes
   - Conflict resolution for specific data types (arrays, objects, etc.)
   - History tracking for resolved conflicts

### Testing for Phase 3

1. **Concurrent editing tests**:
   - Multiple users/sessions editing same project
   - Various conflict scenarios
   - Resolution path testing

2. **Edge case testing**:
   - Network interruptions during conflict resolution
   - Rapid sequential edits
   - Large change sets

### Success Criteria for Phase 3

- Users are notified of potential conflicts before they occur
- When conflicts happen, clear resolution options are presented
- Non-conflicting changes can be automatically merged
- Version history is maintained for audit purposes

## Phase 4: Project Creation Reliability

Finally, we address the project creation reliability issues.

### Step 1: Database Constraints

1. **Implement proper constraints**:
   - Review and update unique constraints
   - Add appropriate indexes for performance
   - Modify RLS policies if needed

### Step 2: Transaction Handling

1. **Improve database functions**:
   - Rewrite `get_or_create_project` RPC function
   - Use proper transactions with isolation levels
   - Implement idempotent operations

### Step 3: Frontend Integration

1. **Enhance creation flow**:
   - Add proper loading states during creation
   - Improve retry mechanism with exponential backoff
   - Better user feedback during process

### Step 4: Monitoring

1. **Add telemetry**:
   - Track creation attempts, success, and failure
   - Measure timing of creation steps
   - Alert on anomalies

### Testing for Phase 4

1. **Load testing**:
   - Concurrent creation attempts
   - Simulated network instability
   - Database connection limits

2. **Recovery testing**:
   - Test partial failure scenarios
   - Verify cleanup of incomplete projects
   - Validate retry effectiveness

### Success Criteria for Phase 4

- No duplicate projects are created
- Creation success rate approaches 100%
- Average creation time is reduced
- Users receive clear feedback during creation process

## Implementation Timeline

| Phase | Estimated Effort | Suggested Timeline |
|-------|------------------|-------------------|
| Diagnostics | 1-2 days | Week 1 |
| Phase 1: File Deletion | 3-5 days | Week 1-2 |
| Phase 2: Error Handling | 5-7 days | Week 2-3 |
| Phase 3: Conflict Resolution | 7-10 days | Week 4-5 |
| Phase 4: Project Creation | 5-7 days | Week 6-7 |

## Rollback Strategies

For each phase, we should prepare rollback strategies:

1. **File Deletion Fix**:
   - Deploy changes to file delete functions separately from reconciliation
   - Monitor for unexpected deletions
   - Maintain backup of file metadata for recovery

2. **Error Handling**:
   - Implement in parallel with existing system
   - Feature flag new error handling
   - Document conversion between systems

3. **Conflict Resolution**:
   - Deploy conflict detection before resolution UI
   - Allow bypassing of conflict resolution initially
   - Maintain compatibility with simpler version conflict detection

4. **Project Creation**:
   - Deploy constraints and monitoring before function changes
   - Implement database-level changes incrementally
   - Maintain existing creation path until new path is proven

## Final Validation

After all phases are complete:

1. **Full regression testing**:
   - End-to-end scenarios covering all fixed areas
   - Performance testing compared to baseline
   - Security review of changes

2. **User experience validation**:
   - Gather feedback on error messages and conflict resolution
   - Monitor support tickets related to fixed issues
   - Track metrics for file operations and project creation

3. **Technical debt review**:
   - Ensure documentation is complete
   - Verify test coverage of new code
   - Remove any temporary compatibility code

This phased approach allows for incremental improvement while managing risk and ensuring each change builds on a more stable foundation from the previous phase. 

### Step 2: Implement Backend Reconciliation

1. **Enhanced `saveProject()` Function**:
   - Added file reconciliation to the saveProject process
   - Implemented comparison between client-side files and database records
   - Automated deletion of files that exist in the database but not in client state
   - Created transaction-like operation sequence to ensure atomicity

2. **Implementation Details**:
   - Fetch current files from database at the start of save operation
   - Create mapping of client-side files with valid IDs
   - Identify "orphaned" files (exist in DB but not in client state)
   - Execute deleteProjectFile on orphaned files
   - Enhanced logging for better debugging and monitoring
   - Improved error handling for file reconciliation failures 