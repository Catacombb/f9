# Project Creation Diagnostic System

## Overview

The Project Creation Diagnostic System is a comprehensive monitoring and debugging tool designed to identify, track, and resolve issues with project creation in the Design Brief application. This system provides detailed insights into each step of the project creation process, enabling administrators to quickly diagnose and fix problems.

## Key Components

### 1. Database Layer

- **Diagnostic Tables**: A dedicated `project_creation_diagnostics` table to store detailed logs of every project creation attempt.
- **RPC Functions**: Secure database functions for retrieving and analyzing diagnostic data.
- **Security Controls**: RLS policies ensure diagnostic data is only accessible to administrators.

### 2. Service Layer

- **Diagnostic Service**: A client-side service providing methods to log diagnostic information and track operation sequences.
- **Request Tracing**: Consistent request IDs to link related operations across the system.
- **Performance Tracking**: Timing measurements for identifying bottlenecks.

### 3. UI Components

- **Diagnostics Dashboard**: An admin-only interface for browsing and analyzing diagnostic data.
- **Session Viewer**: Detailed view of individual diagnostic sessions with full event timeline.
- **Error Analysis**: Visual presentation of errors with context and details.

## Using the Diagnostics System

### For Administrators

1. Navigate to the **Diagnostics** page from the dashboard sidebar.
2. Browse recent diagnostic sessions, filter by user, operation, or status.
3. Click "View Details" to see the complete timeline of any session.
4. Analyze errors, execution times, and detailed logs for troubleshooting.

### In Code

The diagnostic system is integrated into key functions like `getOrCreateProject`. You can also use it in your own code:

```typescript
// Create a diagnostic session
const diagnostic = createDiagnosticSession(userId, 'my_operation');

// Log events
await diagnostic.log('info', 'step_name', { key: 'value' });

// Time operations
const result = await diagnostic.timeAndLog('database_query', async () => {
  return myDatabaseQuery();
});

// Mark completion
await diagnostic.end(true, { result: 'success' });
```

## Enhanced Project Creation Flow

The project creation process has been enhanced with comprehensive diagnostics:

1. **Creation Initiation**: 
   - Logs user ID, target user (if admin), and operation context
   - Generates a unique request ID for tracking

2. **Multiple Attempt Strategy**:
   - Logs each attempt separately
   - Tracks success/failure with detailed error information
   - Records execution times for performance analysis

3. **Project Loading**:
   - Tracks project data loading after creation
   - Records any errors during post-creation operations

4. **Error Reporting**:
   - Enhanced toast notifications with diagnostic IDs
   - Standardized error structure with context

## Analyzing Common Issues

### Database Issues

When a database-related error appears:
1. Check the "Error Details" section for the complete error message
2. Look for previous steps in the sequence that might have led to the failure
3. Verify RLS policies if permission errors are occurring

### Race Conditions

For potential race conditions:
1. Look for multiple nearly-simultaneous sessions from the same user
2. Check for duplicate project IDs in the details
3. Verify the timing of database operations

### Frontend Issues

For client-side errors:
1. Examine the operation sequence for missing or failed steps
2. Check browser details included in session logs
3. Verify network request timing for potential timeouts

## Maintenance

The diagnostic system is designed for minimal maintenance:

- Logs are automatically pruned after 30 days
- Performance impact is negligible under normal operation
- Security is maintained through RLS policies and secure RPC functions

## Extending the System

To add diagnostics to new areas:

1. Import the diagnostic service:
   ```typescript
   import { createDiagnosticSession } from '@/lib/supabase/services/diagnosticService';
   ```

2. Create a session for your operation:
   ```typescript
   const diagnostic = createDiagnosticSession(userId, 'operation_name');
   ```

3. Log events throughout your code:
   ```typescript
   await diagnostic.log('info', 'step_name', { context: 'data' });
   ```

4. Wrap operations for timing:
   ```typescript
   await diagnostic.timeAndLog('step_name', async () => { 
     // Your operation here
   });
   ```

5. Mark completion:
   ```typescript
   await diagnostic.end(success, { result: 'details' });
   ``` 