import { supabase } from '@/lib/supabase/schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Diagnostic service for tracking and debugging application operations
 * Particularly useful for complex flows like project creation
 */

// Generate a unique request ID for tracking related operations
export function generateRequestId(): string {
  return uuidv4();
}

/**
 * Log a diagnostic entry for tracking operations
 * @param userId User ID performing the operation
 * @param operation Operation name (e.g., 'project_creation')
 * @param status Status of the operation ('started', 'info', 'success', 'error', 'warning')
 * @param step Specific step in the operation
 * @param details Additional details as JSON object
 * @param errorMessage Optional error message
 * @param errorDetails Optional detailed error information
 * @param requestId Optional request ID to link related operations (will be generated if not provided)
 * @param executionTimeMs Optional execution time in milliseconds
 * @returns The log entry ID
 */
export async function logDiagnostic(
  userId: string,
  operation: string,
  status: 'started' | 'info' | 'success' | 'error' | 'warning',
  step?: string,
  details?: Record<string, any>,
  errorMessage?: string,
  errorDetails?: string,
  requestId?: string,
  executionTimeMs?: number
): Promise<string | null> {
  try {
    // Generate request ID if not provided
    const effectiveRequestId = requestId || generateRequestId();
    
    console.log(`[DIAGNOSTIC] ${operation} - ${status} - ${step || 'N/A'}`);
    
    if (errorMessage) {
      console.error(`[DIAGNOSTIC ERROR] ${errorMessage}`);
    }
    
    // Log to database
    const { data, error } = await supabase.rpc('log_project_diagnostic', {
      p_user_id: userId,
      p_operation: operation,
      p_status: status,
      p_step: step || null,
      p_details: details ? details : {},
      p_error_message: errorMessage || null,
      p_error_details: errorDetails || null,
      p_request_id: effectiveRequestId,
      p_execution_time_ms: executionTimeMs || null
    });
    
    if (error) {
      console.error('Error logging diagnostic:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in logDiagnostic:', error);
    return null;
  }
}

/**
 * Get all diagnostic logs for a specific request ID
 * @param requestId The request ID to fetch logs for
 * @returns Array of diagnostic logs
 */
export async function getDiagnosticLogs(requestId: string) {
  try {
    const { data, error } = await supabase
      .from('project_creation_diagnostics')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching diagnostic logs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getDiagnosticLogs:', error);
    return [];
  }
}

/**
 * Wrapper to time and log the execution of an async function
 * @param userId User ID
 * @param operation Operation name
 * @param step Step name
 * @param fn Async function to execute and time
 * @param requestId Optional request ID
 * @returns Result of the function execution
 */
export async function timeAndLogOperation<T>(
  userId: string,
  operation: string,
  step: string,
  fn: () => Promise<T>,
  requestId?: string
): Promise<T> {
  const startTime = performance.now();
  const effectiveRequestId = requestId || generateRequestId();
  
  try {
    // Log operation start
    await logDiagnostic(
      userId,
      operation,
      'started',
      step,
      { timestamp: new Date().toISOString() },
      undefined,
      undefined,
      effectiveRequestId
    );
    
    // Execute the function
    const result = await fn();
    
    // Calculate execution time
    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);
    
    // Log successful completion
    await logDiagnostic(
      userId,
      operation,
      'success',
      step,
      { 
        timestamp: new Date().toISOString(),
        result: typeof result === 'object' ? result : { value: result }
      },
      undefined,
      undefined,
      effectiveRequestId,
      executionTimeMs
    );
    
    return result;
  } catch (error) {
    // Calculate execution time for error case
    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);
    
    // Log error
    await logDiagnostic(
      userId,
      operation,
      'error',
      step,
      { timestamp: new Date().toISOString() },
      error instanceof Error ? error.message : 'Unknown error',
      error instanceof Error ? error.stack : String(error),
      effectiveRequestId,
      executionTimeMs
    );
    
    throw error;
  }
}

/**
 * Create a diagnostic session for tracking a sequence of related operations
 * @param userId User ID
 * @param operation Main operation name
 * @returns Object with methods for logging within this session
 */
export function createDiagnosticSession(userId: string, operation: string) {
  const requestId = generateRequestId();
  
  // Log session start
  logDiagnostic(
    userId,
    operation,
    'started',
    'session_start',
    {
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent
    },
    undefined,
    undefined,
    requestId
  );
  
  return {
    requestId,
    
    log: (
      status: 'info' | 'success' | 'error' | 'warning',
      step: string,
      details?: Record<string, any>,
      errorMessage?: string,
      errorDetails?: string,
      executionTimeMs?: number
    ) => logDiagnostic(
      userId,
      operation,
      status,
      step,
      details,
      errorMessage,
      errorDetails,
      requestId,
      executionTimeMs
    ),
    
    timeAndLog: <T>(
      step: string,
      fn: () => Promise<T>
    ) => timeAndLogOperation<T>(
      userId,
      operation,
      step,
      fn,
      requestId
    ),
    
    end: async (success: boolean, details?: Record<string, any>) => {
      return logDiagnostic(
        userId,
        operation,
        success ? 'success' : 'error',
        'session_end',
        {
          timestamp: new Date().toISOString(),
          ...details
        },
        undefined,
        undefined,
        requestId
      );
    },
    
    getSessionLogs: async () => {
      return getDiagnosticLogs(requestId);
    }
  };
} 