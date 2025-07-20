import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { CreateRoomForm } from '@/components/create-room-form';
import { FloatingCreateRoomButton } from '@/components/floating-create-room-button';
import { Footer } from '@/components/footer';
import { RoomList } from '@/components/room-list';
import { FloatingScrollToTop } from '@/components/scroll-to-top';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export function CreateRoom() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex min-h-screen flex-col px-4 pt-6">
      <div className="mx-auto w-full max-w-[1000px] flex-1">
        <div className="z-40 mb-5 bg-background py-4 md:sticky md:top-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-foreground">
                Salas de perguntas
              </h1>
              <p className="text-muted-foreground text-sm">
                Gerencie suas salas e receba respostas inteligentes por IA
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-shrink-0">
              <div className="relative w-full md:w-80">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  className="w-full pr-10 pl-10"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar sala..."
                  value={searchQuery}
                />
                {searchQuery && (
                  <button
                    className="-translate-y-1/2 absolute top-1/2 right-3 p-1 text-muted-foreground transition-colors hover:text-foreground"
                    onClick={clearSearch}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="hidden md:block">
                <CreateRoomForm />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 pb-8">
          <RoomList searchQuery={debouncedSearchQuery} />
        </div>
        <FloatingScrollToTop />
        <FloatingCreateRoomButton />
      </div>

      <Footer />
    </div>
  );
}
