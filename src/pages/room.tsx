import { ArrowLeft } from 'lucide-react';

import { Link, Navigate, useParams } from 'react-router-dom';
import { AudioRecorderModal } from '@/components/audio-recorder-modal';
import { FloatingQuestionButton } from '@/components/floating-question-button';
import { Footer } from '@/components/footer';
import { QuestionForm } from '@/components/question-form';
import { QuestionList } from '@/components/question-list';
import { FloatingScrollToTop } from '@/components/scroll-to-top';
import { ShareRoomButton } from '@/components/share-room-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoom } from '@/http/use-room';
import { scrollToQuestions } from '@/lib/utils';

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
    <div className="flex min-h-screen flex-col bg-background px-4">
      <div className="container mx-auto w-full max-w-[1000px] flex-1 py-12">
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 size-4" />
                  Voltar ao Início
                </Button>
              </Link>
              <ShareRoomButton roomName={room?.name} />
            </div>
            <AudioRecorderModal roomId={params.roomId} />
          </div>
          <h1 className="mb-3 font-bold text-2xl text-foreground md:text-3xl">
            {isLoadingRoom ? (
              <Skeleton className="h-8 w-10/12" />
            ) : (
              room?.name || 'Sala de Perguntas'
            )}
          </h1>
          <p className="text-muted-foreground">
            {isLoadingRoom ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ) : (
              room?.description || 'Faça perguntas e receba respostas com IA'
            )}
          </p>
        </div>

        <div className="mb-8 hidden md:block">
          <QuestionForm
            onQuestionSubmit={scrollToQuestions}
            roomId={params.roomId}
          />
        </div>

        <div className="flex-1 pb-8">
          <QuestionList roomId={params.roomId} />
        </div>
      </div>

      <FloatingScrollToTop />
      <FloatingQuestionButton roomId={params.roomId} />

      <Footer />
    </div>
  );
}
