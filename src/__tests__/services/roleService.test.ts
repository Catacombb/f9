import * as roleService from '@/lib/supabase/services/roleService';

// Mock the Supabase client
jest.mock('@/lib/supabase/schema');

// Access the mocked supabase client
const mockSupabase = jest.requireMock('@/lib/supabase/schema').supabase;

describe('RoleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRole', () => {
    it('should return user role when found', async () => {
      // Arrange
      const userId = 'test-user-id';
      const expectedRole = 'admin';
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({
        data: { role: expectedRole },
        error: null
      });

      // Act
      const result = await roleService.getUserRole(userId);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('role');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', userId);
      expect(result).toBe(expectedRole);
    });

    it('should return null when user role not found', async () => {
      // Arrange
      const userId = 'test-user-id';
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({
        data: null,
        error: new Error('User profile not found')
      });

      // Act
      const result = await roleService.getUserRole(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', async () => {
      // Arrange
      const userId = 'admin-user-id';
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({
        data: { role: 'admin' },
        error: null
      });

      // Act
      const result = await roleService.isAdmin(userId);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(result).toBe(true);
    });

    it('should return false when user is not admin', async () => {
      // Arrange
      const userId = 'client-user-id';
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({
        data: { role: 'client' },
        error: null
      });

      // Act
      const result = await roleService.isAdmin(userId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      // Arrange
      const userId = 'test-user-id';
      const newRole = 'admin';
      const updatedProfile = { id: userId, role: newRole };
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: updatedProfile, error: null });

      // Act
      const result = await roleService.updateUserRole(userId, newRole);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSupabase.update).toHaveBeenCalledWith({ role: newRole });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', userId);
      expect(result).toEqual(updatedProfile);
    });

    it('should throw error when update fails', async () => {
      // Arrange
      const userId = 'test-user-id';
      const newRole = 'admin';
      const mockError = new Error('Update failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(roleService.updateUserRole(userId, newRole)).rejects.toThrow('Failed to update user role');
    });
  });

  describe('getUsersByRole', () => {
    it('should return users with specified role', async () => {
      // Arrange
      const role = 'client';
      const mockUsers = [
        { id: 'user1', role: 'client' },
        { id: 'user2', role: 'client' }
      ];
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnValue({ data: mockUsers, error: null });

      // Act
      const result = await roleService.getUsersByRole(role);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('role', role);
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when query fails', async () => {
      // Arrange
      const role = 'client';
      const mockError = new Error('Query failed');
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnValue({ data: null, error: mockError });

      // Act & Assert
      await expect(roleService.getUsersByRole(role)).rejects.toThrow('Error fetching users by role');
    });
  });
}); 