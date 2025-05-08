import * as dashboardService from '@/lib/supabase/services/dashboardService';

// Mock the Supabase client
jest.mock('@/lib/supabase/schema');

// Mock all dependent services
jest.mock('@/lib/supabase/services/statusService', () => ({
  getProjectsByStatus: jest.fn().mockResolvedValue([]),
  getProjectStatusSummary: jest.fn().mockResolvedValue({
    brief: 2,
    sent: 1,
    complete: 1,
    total: 4
  })
}));

jest.mock('@/lib/supabase/services/roleService', () => ({
  getUserRole: jest.fn().mockResolvedValue('admin'),
  isAdmin: jest.fn().mockResolvedValue(true),
  getUsersByRole: jest.fn().mockResolvedValue([])
}));

jest.mock('@/lib/supabase/services/activitiesService', () => ({
  getRecentActivities: jest.fn().mockResolvedValue([]),
  getProjectActivities: jest.fn().mockResolvedValue([])
}));

// Access the mocked dependencies
const mockStatusService = jest.requireMock('@/lib/supabase/services/statusService');
const mockRoleService = jest.requireMock('@/lib/supabase/services/roleService');
const mockActivitiesService = jest.requireMock('@/lib/supabase/services/activitiesService');

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should get dashboard stats for an admin user', async () => {
      // Arrange
      const userId = 'admin-user-id';
      mockRoleService.isAdmin.mockResolvedValue(true);
      
      const mockStatusSummary = {
        brief: 2,
        sent: 1,
        complete: 1,
        total: 4
      };
      mockStatusService.getProjectStatusSummary.mockResolvedValue(mockStatusSummary);
      
      const mockRecentActivities = [
        { id: 'activity-1', activity_type: 'status_change' },
        { id: 'activity-2', activity_type: 'comment' }
      ];
      mockActivitiesService.getRecentActivities.mockResolvedValue(mockRecentActivities);
      
      const mockUserCounts = {
        admins: 1,
        clients: 3,
        total: 4
      };
      // Mock implementation to return different user counts
      mockRoleService.getUsersByRole.mockImplementation((role) => {
        if (role === 'admin') return Array(mockUserCounts.admins);
        if (role === 'client') return Array(mockUserCounts.clients);
        return [];
      });

      // Act
      const result = await dashboardService.getDashboardStats(userId);

      // Assert
      expect(mockRoleService.isAdmin).toHaveBeenCalledWith(userId);
      expect(mockStatusService.getProjectStatusSummary).toHaveBeenCalled();
      expect(mockActivitiesService.getRecentActivities).toHaveBeenCalled();
      expect(mockRoleService.getUsersByRole).toHaveBeenCalledWith('admin');
      expect(mockRoleService.getUsersByRole).toHaveBeenCalledWith('client');
      
      expect(result).toEqual({
        projectCounts: mockStatusSummary,
        recentActivity: mockRecentActivities,
        userCounts: mockUserCounts
      });
    });

    it('should get dashboard stats for a client user', async () => {
      // Arrange
      const userId = 'client-user-id';
      mockRoleService.isAdmin.mockResolvedValue(false);
      
      const mockClientProjects = [
        { id: 'project-1', status: 'brief' },
        { id: 'project-2', status: 'sent' }
      ];
      // Mock implementation to return different projects based on status
      mockStatusService.getProjectsByStatus.mockImplementation((status) => {
        return mockClientProjects.filter(p => p.status === status);
      });
      
      const mockRecentActivities = [
        { id: 'activity-1', activity_type: 'status_change', project_id: 'project-1' }
      ];
      mockActivitiesService.getRecentActivities.mockResolvedValue(mockRecentActivities);

      // Act
      const result = await dashboardService.getDashboardStats(userId);

      // Assert
      expect(mockRoleService.isAdmin).toHaveBeenCalledWith(userId);
      expect(mockStatusService.getProjectsByStatus).toHaveBeenCalledWith('brief');
      expect(mockStatusService.getProjectsByStatus).toHaveBeenCalledWith('sent');
      expect(mockStatusService.getProjectsByStatus).toHaveBeenCalledWith('complete');
      expect(mockActivitiesService.getRecentActivities).toHaveBeenCalledWith(5, userId);
      
      // Client user should not have userCounts in the result
      expect(result.userCounts).toBeUndefined();
    });
  });

  describe('getAdminOverview', () => {
    it('should get admin overview data', async () => {
      // Arrange
      const mockStatusSummary = {
        brief: 2,
        sent: 1,
        complete: 1,
        total: 4
      };
      mockStatusService.getProjectStatusSummary.mockResolvedValue(mockStatusSummary);
      
      const mockRecentProjects = [
        { id: 'project-1', name: 'Project 1', status: 'brief' },
        { id: 'project-2', name: 'Project 2', status: 'sent' }
      ];
      mockStatusService.getProjectsByStatus.mockResolvedValue(mockRecentProjects);
      
      const mockRecentActivities = [
        { id: 'activity-1', activity_type: 'status_change' }
      ];
      mockActivitiesService.getRecentActivities.mockResolvedValue(mockRecentActivities);

      // Act
      const result = await dashboardService.getAdminOverview();

      // Assert
      expect(mockStatusService.getProjectStatusSummary).toHaveBeenCalled();
      expect(mockStatusService.getProjectsByStatus).toHaveBeenCalled();
      expect(mockActivitiesService.getRecentActivities).toHaveBeenCalled();
      
      expect(result).toHaveProperty('statusSummary');
      expect(result).toHaveProperty('recentProjects');
      expect(result).toHaveProperty('recentActivity');
    });
  });

  describe('getClientOverview', () => {
    it('should get client overview data', async () => {
      // Arrange
      const userId = 'client-user-id';
      
      const mockClientProjects = [
        { id: 'project-1', name: 'Project 1', status: 'brief' },
        { id: 'project-2', name: 'Project 2', status: 'sent' }
      ];
      mockStatusService.getProjectsByStatus.mockResolvedValue(mockClientProjects);
      
      const mockRecentActivities = [
        { id: 'activity-1', activity_type: 'status_change', project_id: 'project-1' }
      ];
      mockActivitiesService.getRecentActivities.mockResolvedValue(mockRecentActivities);

      // Act
      const result = await dashboardService.getClientOverview(userId);

      // Assert
      expect(mockStatusService.getProjectsByStatus).toHaveBeenCalled();
      expect(mockActivitiesService.getRecentActivities).toHaveBeenCalledWith(5, userId);
      
      expect(result).toHaveProperty('projects');
      expect(result).toHaveProperty('recentActivity');
    });
  });
}); 