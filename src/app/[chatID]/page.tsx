'use client';

import { Altair } from '@/components/chat/altair/component';
import ControlTray from '@/components/chat/control-tray/control-tray';
import Logger from '@/components/chat/logger/logger';
import SidePanel from '@/components/chat/side-panel/side-panel';
import { cn } from '@/lib/utils';
import { LiveAPIProvider } from '@contexts/LiveAPIContext';
import { useEffect, useRef, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

if (!API_KEY) {
  throw new Error('set NEXT_GEMINI_API_KEY in .env');
}

const host = 'generativelanguage.googleapis.com';
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [initialized, setInitialized] = useState(false);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return (
    <LiveAPIProvider url={uri} apiKey={API_KEY}>
      <div className="flex h-screen bg-neutral-950">
        {/* Left Sidebar */}
        {initialized && (
          <aside className="overflow-hidden border-r border-neutral-800 bg-neutral-900">
            <SidePanel
              onCollapse={setSidebarCollapsed}
              isCollapsed={sidebarCollapsed}
            />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex flex-1 bg-neutral-900">
          {/* Chat Area */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl">
                <Logger filter="conversations" />
              </div>
            </div>

            {/* Control Tray - Fixed at bottom */}
            {initialized && (
              <div className="flex-none border-t border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur">
                <div className="mx-auto max-w-3xl">
                  <ControlTray
                    videoRef={videoRef}
                    supportsVideo={true}
                    onVideoStreamChange={setVideoStream}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Visualization & Video */}
          <div className="flex w-[480px] flex-col border-l border-neutral-800">
            <div className="flex-1 space-y-6 p-6">
              {/* Visualization */}
              <div className="flex-1 rounded-2xl bg-neutral-800/50 p-4">
                <Altair />
              </div>

              {/* Video */}
              <video
                className={cn(
                  'aspect-video w-full rounded-2xl bg-neutral-800/50 object-cover',
                  !videoStream && 'hidden'
                )}
                ref={videoRef}
                autoPlay
                playsInline
              />
            </div>
          </div>
        </main>
      </div>
    </LiveAPIProvider>
  );
}

export default App;
