'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Logger from '@/components/chat/logger/logger';
import ControlTray from '@/components/chat/control-tray/control-tray';
import { VisualizerPanel } from './visualizer-panel';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useLoggerStore } from '@/lib/store-logger';

export default function ChatView() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const { connected } = useLiveAPIContext();
    const { logs } = useLoggerStore();

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-3xl mx-auto min-h-full relative">
                        {!connected ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <div className="w-3 h-3 bg-red-500/50 rounded-full animate-pulse" />
                                    <p className="text-sm font-medium">Disconnected</p>
                                </div>
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>Start a conversation</p>
                            </div>
                        ) : (
                                    <Logger filter="conversations" />
                        )}
                    </div>
                </div>

                {/* Control Area */}
                <div className="flex-none border-t border-border/50 backdrop-blur-md bg-background/95">
                    <div className="max-w-3xl mx-auto p-6">
                        <ControlTray
                            videoRef={videoRef}
                            supportsVideo={true}
                            onVideoStreamChange={setVideoStream}
                        />
                    </div>
                </div>
            </div>

            <VisualizerPanel videoRef={videoRef} videoStream={videoStream} />
        </div>
    );
}
