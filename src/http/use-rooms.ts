import { useQuery } from '@tanstack/react-query';
import type { GetRoomsResponse } from './types/get-rooms-response';

export function useRooms() {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      // Artificial delay to show skeleton loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await fetch('http://localhost:3333/rooms');
      const result: GetRoomsResponse = await response.json();

      return result;
    },
  });
}
