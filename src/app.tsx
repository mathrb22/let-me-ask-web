import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { RecordingStatusBar } from './components/recording-status-bar';
import { ScrollToTop } from './components/scroll-to-top';
import { RecordingProvider } from './hooks/use-recording-context';
import { CreateRoom } from './pages/create-room';
import { Room } from './pages/room';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecordingProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <RecordingStatusBar />
          <main className="pt-16">
            <Routes>
              <Route element={<CreateRoom />} index />
              <Route element={<Room />} path="/room/:roomId" />
            </Routes>
          </main>
        </BrowserRouter>
      </RecordingProvider>
    </QueryClientProvider>
  );
}
