import { useQuery } from '@tanstack/react-query';
import type { GetRoomResponse } from './types/get-room-response';

export function useRoom(roomId: string) {
  return useQuery({
    queryKey: ['get-room', roomId],
    queryFn: async (): Promise<GetRoomResponse> => {
      // Artificial delay to show skeleton loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await fetch(`http://localhost:3333/rooms/${roomId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch room details');
      }

      const result: GetRoomResponse = await response.json();
      return result;
    },
  });
}
