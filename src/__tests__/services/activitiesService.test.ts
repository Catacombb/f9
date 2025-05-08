import * as activitiesService from '@/lib/supabase/services/activitiesService';

// Mock the roleService
jest.mock('@/lib/supabase/services/roleService', () => ({
  getUserRole: jest.fn().mockResolvedValue('client')
}));

// Mock the Supabase client
jest.mock('@/lib/supabase/schema');

// Access the mocked modules
const mockSupabase = jest.requireMock('@/lib/supabase/schema').supabase;
const mockRoleService = jest.requireMock('@/lib/supabase/services/roleService');

describe('ActivitiesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logActivity', () => {
    it('should successfully log an activity', async () => {
      // Arrange
      const activityParams = {
        projectId: 'project-123',
        userId: 'user-123',
        activityType: 'status_change' as const,
        details: { status: 'sent' }
      };
      
      const expectedActivity = {
        id: 'activity-123',
        project_id: activityParams.projectId,
        user_id: activityParams.userId,
        activity_type: activityParams.activityType,
        details: activityParams.details
      };
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: expectedActivity, error: null });

      // Act
      const result = await activitiesService.logActivity(activityParams);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('activities');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        project_id: activityParams.projectId,
        user_id: activityParams.userId,
        activity_type: activityParams.activityType,
        details: activityParams.details,
        is_system_generated: false
      });
      expect(result).toEqual(expectedActivity);
    });

    it('should throw error when activity logging fails', async () => {
      // Arrange
      const activityParams = {
        projectId: 'project-123',
        userId: 'user-123',
        activityType: 'status_change' as const
      };
      
      const mockError = new Error('Insert failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(activitiesService.logActivity(activityParams)).rejects.toThrow('Failed to log activity');
    });
  });

  describe('getProjectActivities', () => {
    it('should get activities for a specific project', async () => {
      // Arrange
      const projectId = 'project-123';
      const mockActivities = [
        { id: 'activity-1', project_id: projectId, activity_type: 'status_change' },
        { id: 'activity-2', project_id: projectId, activity_type: 'comment' }
      ];
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockReturnValue({ data: mockActivities, error: null });

      // Act
      const result = await activitiesService.getProjectActivities(projectId, 10);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('activities');
      expect(mockSupabase.select).toHaveBeenCalledWith('*, user_profiles(*)');
      expect(mockSupabase.eq).toHaveBeenCalledWith('project_id', projectId);
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockSupabase.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockActivities);
    });

    it('should throw error when fetching activities fails', async () => {
      // Arrange
      const projectId = 'project-123';
      const mockError = new Error('Query failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(activitiesService.getProjectActivities(projectId)).rejects.toThrow('Error fetching project activities');
    });
  });

  describe('getRecentActivities', () => {
    it('should get recent activities across all projects', async () => {
      // Arrange
      const userId = 'user-123';
      const limit = 10;
      const mockActivities = [
        { id: 'activity-1', project_id: 'project-1', activity_type: 'status_change' },
        { id: 'activity-2', project_id: 'project-2', activity_type: 'comment' }
      ];
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockReturnValue({ data: mockActivities, error: null });

      // Act - Need to cast userId to number if that's what the actual implementation expects
      const result = await activitiesService.getRecentActivities(limit, parseInt(userId.replace(/\D/g, ''), 10));

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('activities');
      expect(mockSupabase.select).toHaveBeenCalledWith('*, user_profiles(role), projects!inner(*)');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockSupabase.limit).toHaveBeenCalledWith(limit);
      expect(result).toEqual(mockActivities);
    });

    it('should throw error when fetching recent activities fails', async () => {
      // Arrange
      const userId = 'user-123';
      const limit = 10;
      const mockError = new Error('Query failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockReturnValue({ data: null, error: mockError });

      // Act & Assert - Need to cast userId to number if that's what the actual implementation expects
      await expect(activitiesService.getRecentActivities(limit, parseInt(userId.replace(/\D/g, ''), 10))).rejects.toThrow('Error fetching recent activities');
    });
  });
}); 