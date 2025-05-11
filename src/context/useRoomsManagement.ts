import { useCallback } from 'react';
import { ProjectData, SpaceRoom } from '@/types';

// Simple random ID generator function compatible with all browsers
const generateUniqueId = () => {
  return 'room-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useRoomsManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const addRoom = useCallback((room: Omit<SpaceRoom, 'id'>) => {
    setProjectData(draft => {
      const newRoom = {
        ...room,
        id: generateUniqueId(),
      };
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms = [...updatedDraft.formData.spaces.rooms, newRoom];
      return updatedDraft;
    });
  }, [setProjectData]);

  const updateRoom = useCallback((updatedRoom: SpaceRoom) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const roomIndex = updatedDraft.formData.spaces.rooms.findIndex(r => r.id === updatedRoom.id);
      if (roomIndex !== -1) {
        updatedDraft.formData.spaces.rooms[roomIndex] = updatedRoom;
      }
      return updatedDraft;
    });
  }, [setProjectData]);

  const removeRoom = useCallback((roomId: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms = updatedDraft.formData.spaces.rooms.filter(room => room.id !== roomId);
      return updatedDraft;
    });
  }, [setProjectData]);

  return { addRoom, updateRoom, removeRoom };
};
