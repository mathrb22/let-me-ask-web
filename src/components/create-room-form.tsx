import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod/v4';
import { useCreateRoom } from '@/http/use-create-room';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const createRoomSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

interface CreateRoomFormProps {
  variant?: 'default' | 'floating';
}

export function CreateRoomForm({ variant = 'default' }: CreateRoomFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  const navigate = useNavigate();

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const watchedValues = createRoomForm.watch();
  const hasFormData =
    watchedValues.name.trim() !== '' || watchedValues.description.trim() !== '';

  async function handleCreateRoom({ name, description }: CreateRoomFormData) {
    const result = await createRoom({ name, description });

    createRoomForm.reset();
    setIsOpen(false);

    if (result.roomId) {
      navigate(`/room/${result.roomId}`);
    } else {
      alert('Não foi possível criar a sala. Tente novamente.');
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      createRoomForm.reset();
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        {variant === 'floating' ? (
          <Button className="h-12 w-12 rounded-full shadow-xl" size="lg">
            <Plus className="size-5" />
          </Button>
        ) : (
          <Button className="flex w-full items-center gap-2 sm:w-48">
            <Plus className="size-4" />
            Criar sala
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="flex h-fit flex-col gap-6 py-8 sm:max-w-[500px]"
        onEscapeKeyDown={hasFormData ? (e) => e.preventDefault() : undefined}
        onInteractOutside={hasFormData ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader className="flex h-max flex-col text-left">
          <DialogTitle>Criar sala</DialogTitle>
          <DialogDescription>
            Crie uma nova sala para começar a fazer perguntas e receber
            respostas da I.A.
          </DialogDescription>
        </DialogHeader>

        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Digite o nome da sala..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Digite a descrição da sala..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Criando sala...
                </>
              ) : (
                'Criar sala'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
