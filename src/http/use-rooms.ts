import { useQuery } from '@tanstack/react-query';
import type { GetRoomsResponse } from './types/get-rooms-response';

export function useRooms(searchQuery?: string) {
  return useQuery({
    queryKey: ['get-rooms', searchQuery],
    queryFn: async () => {
      // Artificial delay to show skeleton loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      const url = new URL('http://localhost:3333/rooms');
      if (searchQuery) {
        url.searchParams.set('search', searchQuery);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const result: GetRoomsResponse = await response.json();

      return result;
    },
  });
}
