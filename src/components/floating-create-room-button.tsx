import { CreateRoomForm } from './create-room-form';

export function FloatingCreateRoomButton() {
  return (
    <div className="fade-in slide-in-from-bottom-4 fixed right-4 bottom-6 z-50 animate-in duration-300 md:hidden">
      <div className="transition-all duration-200 hover:scale-105 active:scale-95">
        <CreateRoomForm variant="floating" />
      </div>
    </div>
  );
}
