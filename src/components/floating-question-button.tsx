import { MessageCircleMore } from 'lucide-react';
import { useState } from 'react';
import { scrollToQuestions } from '@/lib/utils';
import { QuestionForm } from './question-form';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface FloatingQuestionButtonProps {
  roomId: string;
}

export function FloatingQuestionButton({
  roomId,
}: FloatingQuestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFormData, setHasFormData] = useState(false);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setHasFormData(false);
    }
  }

  function handleQuestionChange(hasData: boolean) {
    setHasFormData(hasData);
  }

  function handleQuestionSubmit() {
    setIsOpen(false);
    setHasFormData(false);
    scrollToQuestions();
  }

  return (
    <div className="fade-in slide-in-from-bottom-4 fixed right-4 bottom-6 z-50 animate-in duration-300 md:hidden">
      <Dialog onOpenChange={handleOpenChange} open={isOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-12 w-12 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            size="lg"
          >
            <MessageCircleMore className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex flex-col gap-6 sm:max-w-[500px]"
          onEscapeKeyDown={hasFormData ? (e) => e.preventDefault() : undefined}
          onInteractOutside={
            hasFormData ? (e) => e.preventDefault() : undefined
          }
        >
          <DialogHeader className="flex flex-col text-left">
            <DialogTitle>Fazer pergunta</DialogTitle>
            <DialogDescription>
              Digite sua pergunta e receba uma resposta gerada por IA com base
              na gravação
            </DialogDescription>
          </DialogHeader>
          <QuestionForm
            onQuestionChange={handleQuestionChange}
            onQuestionSubmit={handleQuestionSubmit}
            roomId={roomId}
            variant="modal"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
