import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type GetRoomsAPIResponse = Array<{
  id: string;
  name: string;
  description: string;
}>;

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms');
      const result: GetRoomsAPIResponse = await response.json();
      return result;
    },
  });

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col items-center justify-center gap-4">
      {isLoading && <div>loading...</div>}

      <ul className="flex flex-wrap items-center justify-center gap-2">
        {data?.map((room) => (
          <li key={room.id}>
            <Link to={`/room/${room.id}`}>
              <Button className="cursor-pointer" variant={'outline'}>
                {room.name}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
