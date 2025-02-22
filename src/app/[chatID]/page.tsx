'use client';

import { Altair } from '@/components/chat/altair/component';
import ControlTray from '@/components/chat/control-tray/control-tray';
import Logger from '@/components/chat/logger/logger';
import SidePanel from '@/components/chat/side-panel/side-panel';
import { cn } from '@/lib/utils';
import { LiveAPIProvider } from '@contexts/LiveAPIContext';
import { useRef, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

if (!API_KEY) {
  throw new Error('set NEXT_GEMINI_API_KEY in .env');
}

const host = 'generativelanguage.googleapis.com';
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LiveAPIProvider url={uri} apiKey={API_KEY}>
      <div className="flex h-screen bg-neutral-950">
        {/* Left Sidebar */}
        <aside className="border-r border-neutral-800 bg-neutral-900 overflow-hidden">
          <SidePanel
            onCollapse={setSidebarCollapsed}
            isCollapsed={sidebarCollapsed}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex bg-neutral-900">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <Logger filter="conversations" />
              </div>
            </div>

            {/* Control Tray - Fixed at bottom */}
            <div className="flex-none border-t border-neutral-800 bg-neutral-900/80 backdrop-blur p-6">
              <div className="max-w-3xl mx-auto">
                <ControlTray
                  videoRef={videoRef}
                  supportsVideo={true}
                  onVideoStreamChange={setVideoStream}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Visualization & Video */}
          <div className="w-[480px] border-l border-neutral-800 flex flex-col">
            <div className="flex-1 p-6 space-y-6">
              {/* Visualization */}
              <div className="flex-1 bg-neutral-800/50 rounded-2xl p-4">
                <Altair />
              </div>

              {/* Video */}
              <video
                className={cn(
                  "w-full aspect-video rounded-2xl bg-neutral-800/50 object-cover",
                  !videoStream && "hidden"
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
