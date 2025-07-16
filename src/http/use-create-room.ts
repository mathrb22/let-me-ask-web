import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRoomRequest } from './types/create-room-request';
import type { CreateRoomResponse } from './types/create-room-response';

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      // Artificial delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch('http://localhost:3333/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: CreateRoomResponse = await response.json();

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-rooms'] });
    },
  });
}
