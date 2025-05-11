import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { briefService, BriefDataType } from '@/lib/supabase/services/briefService';
import { useToast } from '@/hooks/use-toast';

interface AutosaveOptions {
  briefId: string | null;
  debounceMs?: number;
  onSaveSuccess?: (data: any) => void;
  onSaveError?: (error: any) => void;
}

export function useAutosave<T extends BriefDataType>(
  formData: T,
  options: AutosaveOptions
) {
  const { briefId, debounceMs = 7000, onSaveSuccess, onSaveError } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mutation = useMutation({
    mutationFn: (dataToSave: T) => {
      if (!briefId) {
        console.warn('[useAutosave] No briefId provided, skipping save.');
        return Promise.resolve(null); // Or reject, depending on desired behavior
      }
      console.log('[useAutosave] Saving data for brief:', briefId, dataToSave);
      return briefService.updateBriefData(briefId, dataToSave);
    },
    onSuccess: (data) => {
      console.log('[useAutosave] Data saved successfully for brief:', briefId, data);
      // Toast notification removed to prevent distraction
      queryClient.invalidateQueries({ queryKey: ['brief', briefId] });
      if (onSaveSuccess) onSaveSuccess(data);
    },
    onError: (error) => {
      console.error('[useAutosave] Error saving data for brief:', briefId, error);
      toast({
        title: "Autosave Failed",
        description: "Could not automatically save your changes. Please save manually.",
        variant: "destructive",
      });
      if (onSaveError) onSaveError(error);
    },
  });

  const debouncedSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (formData && briefId) {
        console.log('[useAutosave] Debounce triggered for brief:', briefId);
        mutation.mutate(formData);
      }
    }, debounceMs);
  }, [formData, briefId, debounceMs, mutation]);

  useEffect(() => {
    // Trigger save when formData changes, after debounce
    if (briefId && formData) { // Only attempt to save if there's a briefId and data
      debouncedSave();
    }

    return () => {
      // Clear timeout on unmount or when dependencies change
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [formData, briefId, debouncedSave]); // Add debouncedSave as a dependency

  return {
    isSaving: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    saveManually: () => { // Allow manual trigger if needed
      if (briefId && formData) {
         console.log('[useAutosave] Manual save triggered for brief:', briefId);
        mutation.mutate(formData);
      }
    }
  };
} 