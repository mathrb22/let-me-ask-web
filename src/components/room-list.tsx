import { useRooms } from '@/http/use-rooms';
import { RoomCard } from './room-card';
import { Skeleton } from './ui/skeleton';

interface RoomListProps {
  searchQuery?: string;
}

export function RoomList({ searchQuery }: RoomListProps) {
  const { data, isLoading, error } = useRooms(searchQuery);

  return (
    <div className="mb-12">
      <div>
        {isLoading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                className="rounded-lg border bg-card p-4 shadow-sm"
                key={`skeleton-room-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't need stable keys
                  index
                }`}
              >
                <div className="flex h-full min-h-[88px] flex-col justify-between gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-4" />
                  </div>

                  <div className="flex h-full flex-col justify-between gap-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="mb-4 h-32 w-32 bg-center bg-contain bg-no-repeat"
              role="img"
              style={{ backgroundImage: 'url(/search-empty.svg)' }}
            />
            <h3 className="font-medium text-foreground text-lg">
              {searchQuery
                ? 'Nenhuma sala encontrada'
                : 'Nenhuma sala encontrada'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? 'Tente alterar os termos da busca'
                : 'Crie sua primeira sala para começar a receber perguntas'}
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="mb-4 h-32 w-32 bg-center bg-contain bg-no-repeat"
              role="img"
              style={{ backgroundImage: 'url(/search-empty.svg)' }}
            />
            <h3 className="font-medium text-foreground text-lg">
              Erro ao carregar salas
            </h3>
            <p className="text-muted-foreground text-sm">
              Não foi possível carregar as salas recentes. Tente novamente mais
              tarde.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.map((room) => (
              <RoomCard
                createdAt={room.createdAt}
                description={room.description}
                id={room.id}
                key={room.id}
                name={room.name}
                questionsCount={room.questionsCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
