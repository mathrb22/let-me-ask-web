/** biome-ignore-all lint/suspicious/noConsole: debug logging */
/** biome-ignore-all lint/style/noNestedTernary: UI state management */

import { Pause, Play, Radio, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRecordingContext } from '@/hooks/use-recording-context';

interface AudioRecorderModalProps {
  roomId: string;
}

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

export function AudioRecorderModal({ roomId }: AudioRecorderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isRecording,
    isPaused,
    recordingTime,
    setIsRecording,
    setIsPaused,
    setRecordingTime,
  } = useRecordingContext();

  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  // Format time in HH:MM:SS format
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  const cleanupRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop();
    }
    if (mediaStream.current) {
      for (const track of mediaStream.current.getTracks()) {
        track.stop();
      }
      mediaStream.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(recordingTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused, recordingTime, setRecordingTime]);

  useEffect(() => {
    return cleanupRecording;
  }, [cleanupRecording]);

  function stopRecording() {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    cleanupRecording();
  }

  function pauseRecording() {
    if (recorder.current && recorder.current.state === 'recording') {
      recorder.current.pause();
      setIsPaused(true);
    }
  }

  function resumeRecording() {
    if (recorder.current && recorder.current.state === 'paused') {
      recorder.current.resume();
      setIsPaused(false);
    }
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data);
      }
    };

    recorder.current.onstart = () => {
      console.log('Gravação iniciada!');
    };

    recorder.current.onstop = () => {
      console.log('Gravação encerrada');
    };

    recorder.current.onpause = () => {
      console.log('Gravação pausada');
    };

    recorder.current.onresume = () => {
      console.log('Gravação retomada');
    };

    recorder.current.start();
  }

  async function uploadAudio(audio: Blob) {
    try {
      const formData = new FormData();
      formData.append('file', audio, 'audio.webm');

      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/audio`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Erro ao fazer upload do áudio:', error);
    }
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('O seu navegador não suporta gravação');
      return;
    }

    try {
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44_100,
        },
      });

      mediaStream.current = audio;
      createRecorder(audio);

      // Upload audio chunks every 10 seconds
      intervalRef.current = setInterval(() => {
        if (recorder.current && recorder.current.state === 'recording') {
          recorder.current.stop();
          createRecorder(audio);
        }
      }, 10_000);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setIsRecording(false);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex min-w-[232px] items-center gap-2"
          variant="secondary"
        >
          {isRecording ? (
            <>
              <div
                className={`h-3 w-3 rounded-full ${isPaused ? 'bg-amber-500' : 'animate-pulse bg-red-500'}`}
              />
              {isPaused ? 'Gravação pausada' : 'Gravação em segundo plano'}
            </>
          ) : (
            <>
              <Radio className="size-4 text-primary" />
              Gravar áudio
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-fit flex-col gap-6 py-8 sm:max-w-[450px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-left">
          <DialogTitle>Gravação de áudio</DialogTitle>
          <DialogDescription>
            Grave o áudio da sua transmissão para que a IA possa transcrever em
            tempo real e responder perguntas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="font-medium font-sans text-4xl">
              {formatTime(recordingTime)}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              {isRecording && (
                <div
                  className={`h-3 w-3 rounded-full ${
                    isPaused ? 'bg-amber-500' : 'animate-pulse bg-red-500'
                  }`}
                />
              )}
              <span>
                {isRecording
                  ? isPaused
                    ? 'Gravação pausada'
                    : 'Gravando...'
                  : 'Aguardando para iniciar'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            {isRecording ? (
              <>
                {isPaused ? (
                  <Button
                    className="flex items-center gap-2"
                    onClick={resumeRecording}
                    variant="outline"
                  >
                    <Play className="size-4" />
                    Continuar
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-2"
                    onClick={pauseRecording}
                    variant="outline"
                  >
                    <Pause className="size-4" />
                    Pausar
                  </Button>
                )}

                <Button
                  className="flex items-center gap-2"
                  onClick={stopRecording}
                  variant="destructive"
                >
                  <Square className="size-4" />
                  Finalizar gravação
                </Button>
              </>
            ) : (
              <Button
                className="flex items-center gap-2"
                disabled={!isRecordingSupported}
                onClick={startRecording}
              >
                <Radio className="size-4" />
                Iniciar nova gravação
              </Button>
            )}
          </div>

          {!isRecordingSupported && (
            <p className="text-center text-destructive text-sm">
              Seu navegador não suporta gravação de áudio.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
