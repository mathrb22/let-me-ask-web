import { Radio } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AudioRecorderModal } from '@/components/audio-recorder-modal';
import { useRecordingContext } from '@/hooks/use-recording-context';
import { cn } from '@/lib/utils';

export function RecordingStatusBar() {
  const { isRecording, isPaused, recordingTime } = useRecordingContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const urlRoomId = window.location.pathname.split('/room/')[1];

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const isVisible = !!(urlRoomId && isScrolled);

  if (!urlRoomId) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-20 right-0 left-0 z-40 border-border border-b bg-background/95 backdrop-blur-sm transition-all duration-300 md:hidden',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : '-translate-y-full pointer-events-none opacity-0'
      )}
    >
      <div className="container relative mx-auto flex h-14 max-w-[1000px] items-center justify-between px-4 transition-colors hover:bg-background/50">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <>
              <div
                className={cn(
                  'h-3 w-3 rounded-full transition-colors duration-200',
                  isPaused ? 'bg-amber-500' : 'animate-pulse bg-red-500'
                )}
              />
              <span className="font-medium text-foreground text-sm">
                {isPaused ? 'Gravação Pausada' : 'Gravando...'}
              </span>
            </>
          ) : (
            <>
              {/* <div className="h-3 w-3 rounded-full bg-green-500" /> */}
              <span className="flex items-center gap-2 font-medium text-foreground text-sm">
                <Radio className="size-4 text-primary" />
                Toque para gravar aúdio
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRecording && (
            <span className="font-mono text-muted-foreground text-sm tabular-nums">
              {formatTime(recordingTime)}
            </span>
          )}

          <div className="absolute inset-0 opacity-0">
            <AudioRecorderModal roomId={urlRoomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
