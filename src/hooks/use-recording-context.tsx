import { createContext, type ReactNode, useContext, useState } from 'react';

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  setIsRecording: (recording: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setRecordingTime: (time: number) => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export function RecordingProvider({ children }: { children: ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        setIsRecording,
        setIsPaused,
        setRecordingTime,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecordingContext() {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error(
      'useRecordingContext must be used within a RecordingProvider'
    );
  }
  return context;
}
