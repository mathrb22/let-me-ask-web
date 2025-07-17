import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRooms } from '@/http/use-rooms';
import { dayjs } from '@/lib/dayjs';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Skeleton } from './ui/skeleton';

export function RoomList() {
  const { data, isLoading, error } = useRooms();

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>Salas recentes</CardTitle>
        <CardDescription>
          Acesso rápido para as salas criadas recentemente
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
              key={`skeleton-room-${
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't need stable keys
                index
              }`}
            >
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}

        {!isLoading && data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="mb-4 h-32 w-32 bg-center bg-contain bg-no-repeat"
              role="img"
              style={{ backgroundImage: 'url(/search-empty.svg)' }}
            />
            <h3 className="font-medium text-foreground text-lg">
              Nenhuma sala encontrada
            </h3>
            <p className="text-muted-foreground text-sm">
              Crie sua primeira sala para começar a receber perguntas
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

        {data?.map((room) => {
          return (
            <Link
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 hover:bg-accent/50"
              key={room.id}
              to={`/room/${room.id}`}
            >
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-medium">{room.name}</h3>

                <div className="flex items-center gap-2">
                  <Badge className="text-xs" variant="secondary">
                    {dayjs(room.createdAt).fromNow()}
                  </Badge>
                  <Badge className="text-xs" variant="secondary">
                    {room.questionsCount} pergunta(s)
                  </Badge>
                </div>
              </div>

              <span className="flex items-center gap-2 text-sm">
                Entrar
                <ArrowRight className="size-4" />
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
