import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  variant?: 'default' | 'modal';
  onQuestionChange?: (hasData: boolean) => void;
  onQuestionSubmit?: () => void;
}

export function QuestionForm({
  roomId,
  variant = 'default',
  onQuestionChange,
  onQuestionSubmit,
}: QuestionFormProps) {
  const { mutateAsync: createQuestion } = useCreateQuestion(roomId);

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: '',
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (onQuestionChange) {
      const hasData = watchedValues.question.trim() !== '';
      onQuestionChange(hasData);
    }
  }, [watchedValues.question, onQuestionChange]);

  async function handleCreateQuestion(data: CreateQuestionFormData) {
    if (onQuestionSubmit) {
      onQuestionSubmit();
    }

    await createQuestion({
      ...data,
      question: data.question.trim(),
    });

    form.reset();
  }

  const { isSubmitting } = form.formState;

  const formContent = (
    <Form {...form}>
      <form
        className="flex flex-col items-start gap-5"
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
                  placeholder="Digite sua pergunta aqui..."
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
          {/* {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando pergunta...
            </>
          ) : (
            <> */}
          <Sparkles />
          Enviar pergunta
          {/* </>
          )} */}
        </Button>
      </form>
    </Form>
  );

  if (variant === 'modal') {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fazer pergunta</CardTitle>
        <CardDescription>
          Digite sua pergunta e receba uma resposta gerada por IA com base na
          gravação
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
