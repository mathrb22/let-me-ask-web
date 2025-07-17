import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCreateQuestion } from '@/http/use-create-question';

const MAX_QUESTION_LENGTH = 500;

const createQuestionSchema = z.object({
  question: z
    .string()
    .min(1, 'Digite sua pergunta')
    .min(10, 'Pergunta deve ter pelo menos 10 caracteres')
    .max(
      MAX_QUESTION_LENGTH,
      `Pergunta deve ter menos de ${MAX_QUESTION_LENGTH} caracteres`
    ),
});

type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;

interface QuestionFormProps {
  roomId: string;
}

export function QuestionForm({ roomId }: QuestionFormProps) {
  const { mutateAsync: createQuestion } = useCreateQuestion(roomId);

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: '',
    },
  });

  async function handleCreateQuestion(data: CreateQuestionFormData) {
    await createQuestion({
      ...data,
      question: data.question.trim(),
    });

    form.reset();
  }

  const { isSubmitting } = form.formState;

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col items-start gap-4"
            onSubmit={form.handleSubmit(handleCreateQuestion)}
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>O que você gostaria de saber?</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                      placeholder="Digite sua pergunta para receber uma resposta gerada por IA com base na gravação..."
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm">
                    <div className="flex-1">
                      <FormMessage />
                    </div>
                    <span
                      className={`text-muted-foreground ${field.value.length > MAX_QUESTION_LENGTH ? 'text-destructive' : ''}`}
                    >
                      {field.value.length}/{MAX_QUESTION_LENGTH}
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button
              className="w-full md:w-54"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando pergunta...
                </>
              ) : (
                <>
                  <Sparkles />
                  Enviar pergunta
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
