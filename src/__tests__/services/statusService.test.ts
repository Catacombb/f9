import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as statusService from '@/lib/supabase/services/statusService';

// Mock the entire schema module
vi.mock('@/lib/supabase/schema', () => {
  // Create a mock Supabase object
  const mockFrom = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis()
  };
  
  return {
    supabase: {
      from: vi.fn().mockReturnValue(mockFrom)
    }
  };
});

// Access the mocked supabase client
const mockSupabase = vi.mocked(await import('@/lib/supabase/schema')).supabase;

describe('StatusService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjectsByStatus', () => {
    it('should get projects with the specified status', async () => {
      // Arrange
      const mockProjects = [
        { id: '1', status: 'brief', name: 'Project 1' },
        { id: '2', status: 'brief', name: 'Project 2' }
      ];
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnValue({ data: mockProjects, error: null })
      });

      // Act
      const result = await statusService.getProjectsByStatus('brief', 10);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(result).toEqual(mockProjects);
    });

    it('should handle errors when fetching projects by status', async () => {
      // Arrange
      const mockError = new Error('Database error');
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnValue({ data: null, error: mockError })
      });

      // Act & Assert
      await expect(statusService.getProjectsByStatus('brief')).rejects.toThrow();
    });
  });

  describe('changeProjectStatus', () => {
    it('should change a project status successfully', async () => {
      // Arrange
      const projectId = '123';
      const newStatus = 'sent';
      const userId = 'test-user-id';
      const mockProject = { id: projectId, status: newStatus, updated_at: new Date().toISOString() };
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: mockProject, error: null });

      // Act
      const result = await statusService.changeProjectStatus(projectId, newStatus, userId);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: newStatus,
        updated_at: expect.any(String)
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', projectId);
      expect(result).toEqual(mockProject);
    });

    it('should throw error when project status change fails', async () => {
      // Arrange
      const projectId = '123';
      const newStatus = 'sent';
      const userId = 'test-user-id';
      const mockError = new Error('Update failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(statusService.changeProjectStatus(projectId, newStatus, userId)).rejects.toThrow('Failed to change project status');
    });
  });

  describe('isValidStatusTransition', () => {
    it('should validate a correct status transition', () => {
      // Arrange & Act
      const result = statusService.isValidStatusTransition('brief', 'sent');

      // Assert
      expect(result).toBe(true);
    });

    it('should reject an invalid status transition', () => {
      // Arrange & Act
      const result = statusService.isValidStatusTransition('complete', 'brief');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getProjectStatusSummary', () => {
    it('should return status counts correctly', async () => {
      // Arrange
      const mockProjects = [
        { status: 'brief' },
        { status: 'brief' },
        { status: 'sent' },
        { status: 'complete' }
      ];
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.not.mockReturnValue({ data: mockProjects, error: null });

      // Act
      const result = await statusService.getProjectStatusSummary();

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(mockSupabase.select).toHaveBeenCalledWith('status');
      expect(mockSupabase.not).toHaveBeenCalledWith('status', 'is', null);
      expect(result).toEqual({
        brief: 2,
        sent: 1,
        complete: 1,
        total: 4
      });
    });

    it('should handle errors when fetching status summary', async () => {
      // Arrange
      const mockError = new Error('Database error');
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.not.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(statusService.getProjectStatusSummary()).rejects.toThrow('Error fetching project status summary');
    });
  });
}); 