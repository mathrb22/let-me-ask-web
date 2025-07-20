import { Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface ShareRoomButtonProps {
  roomName?: string;
}

export function ShareRoomButton({ roomName }: ShareRoomButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    const title = roomName ? `Sala: ${roomName}` : 'Sala de Perguntas';
    const text = 'Participe desta sala de perguntas com IA!';

    // Check if the browser supports the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          await fallbackCopyToClipboard(url);
        }
      }
    } else {
      await fallbackCopyToClipboard(url);
    }
  };

  const fallbackCopyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <Button onClick={handleShare} variant="outline">
      <Share2 className="mr-1 size-4" />
      <span className="hidden sm:block md:block lg:block min-[425px]:block">
        Compartilhar sala
      </span>
    </Button>
  );
}
