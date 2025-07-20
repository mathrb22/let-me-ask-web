import { useRoomQuestions } from '@/http/use-room-questions';
import { QuestionItem } from './question-item';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface QuestionListProps {
  roomId: string;
}

export function QuestionList(props: QuestionListProps) {
  const { data, isLoading } = useRoomQuestions(props.roomId);

  return (
    <div className="space-y-6" id="questions-section">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-xl md:text-2xl">
          Perguntas & Respostas
        </h2>
      </div>

      {isLoading &&
        Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={`question-skeleton-${
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't need stable keys
              index
            }`}
          >
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      {!isLoading && data && data.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="mb-6 h-40 w-40 bg-center bg-contain bg-no-repeat"
              role="img"
              style={{ backgroundImage: 'url(/questions.svg)' }}
            />
            <h3 className="mb-2 font-semibold text-foreground text-xl">
              Nenhuma pergunta encontrada
            </h3>
            <p className="text-muted-foreground">
              Seja o primeiro a fazer uma pergunta nesta sala
            </p>
          </CardContent>
        </Card>
      )}

      {data?.map((question) => {
        return <QuestionItem key={question.id} question={question} />;
      })}
    </div>
  );
}
