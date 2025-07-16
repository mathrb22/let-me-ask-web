import { CreateRoomForm } from '@/components/create-room-form';
import { RoomList } from '@/components/room-list';
import { FloatingScrollToTop } from '@/components/scroll-to-top';

export function CreateRoom() {
  return (
    <div className="min-h-screen px-4">
      <div className="mx-auto max-w-[1000px]">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <div className="sticky top-24">
            <CreateRoomForm />
          </div>
          <RoomList />
          <FloatingScrollToTop />
        </div>
      </div>
    </div>
  );
}
