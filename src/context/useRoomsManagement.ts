
import { useState, useCallback } from 'react';
import { ProjectData, SpaceRoom } from '@/types';

export const useRoomsManagement = (
  projectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
) => {
  const addRoom = useCallback((room: Omit<SpaceRoom, 'id'>) => {
    setProjectData(draft => {
      const newRoom = {
        ...room,
        id: crypto.randomUUID(),
      };
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms.push(newRoom);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  const updateRoom = useCallback((room: ProjectData['formData']['spaces']['rooms'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const roomIndex = updatedDraft.formData.spaces.rooms.findIndex(r => r.id === room.id);
      if (roomIndex !== -1) {
        updatedDraft.formData.spaces.rooms[roomIndex] = room;
      }
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  const removeRoom = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms = updatedDraft.formData.spaces.rooms.filter(room => room.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, [setProjectData]);

  return { addRoom, updateRoom, removeRoom };
};
