import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dayjs } from '@/lib/dayjs';
import { Badge } from './ui/badge';

interface RoomCardProps {
  id: string;
  name: string;
  description?: string;
  questionsCount: number;
  createdAt: string;
}

export function RoomCard({
  id,
  name,
  description = 'Sem descrição',
  questionsCount,
  createdAt,
}: RoomCardProps) {
  return (
    <Link
      className="group block rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 hover:shadow-md"
      to={`/room/${id}`}
    >
      <div className="flex h-full min-h-[88px] flex-col justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 font-medium text-card-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
          <ArrowRight className="size-4 min-w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <p className="line-clamp-1 text-muted-foreground text-sm">
            {description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <Badge
              className="px-3 py-1 font-medium text-xs dark:bg-zinc-800"
              variant="outline"
            >
              {questionsCount} pergunta(s)
            </Badge>
            <Badge
              className="rounded-none border-none bg-transparent p-0 text-xs text-zinc-400"
              variant="outline"
            >
              {dayjs(createdAt).fromNow()}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
