import { ArrowLeft } from 'lucide-react';

import { Link, Navigate, useParams } from 'react-router-dom';
import { AudioRecorderModal } from '@/components/audio-recorder-modal';
import { QuestionForm } from '@/components/question-form';
import { QuestionList } from '@/components/question-list';
import { FloatingScrollToTop } from '@/components/scroll-to-top';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoom } from '@/http/use-room';

type RoomParams = {
  roomId: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const { data: room, isLoading: isLoadingRoom } = useRoom(params.roomId || '');

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="min-h-screen bg-background px-4">
      <div className="container mx-auto max-w-[1000px] py-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Voltar ao Início
              </Button>
            </Link>
            <AudioRecorderModal roomId={params.roomId} />
          </div>
          <h1 className="mb-2 font-bold text-3xl text-foreground">
            {isLoadingRoom ? (
              <Skeleton className="h-8 w-2/3" />
            ) : (
              room?.name || 'Sala de Perguntas'
            )}
          </h1>
          <p className="text-muted-foreground">
            {isLoadingRoom ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              room?.description || 'Faça perguntas e receba respostas com IA'
            )}
          </p>
        </div>

        <div className="mb-8">
          <QuestionForm roomId={params.roomId} />
        </div>

        <QuestionList roomId={params.roomId} />
      </div>

      <FloatingScrollToTop />
    </div>
  );
}
