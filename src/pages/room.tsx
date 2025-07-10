import { Home } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type RoomParams = {
  roomId: string;
};

export function Room() {
  const params = useParams<RoomParams>();

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div>
      <div>Room {params.roomId} details</div>

      <Link to="/">
        <Button>
          <Home />
          Home
        </Button>
      </Link>
    </div>
  );
}
