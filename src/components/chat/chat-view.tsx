'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Logger from '@/components/chat/logger/logger';
import ControlTray from '@/components/chat/control-tray/control-tray';
import { VisualizerPanel } from './visualizer-panel';

export default function ChatView() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [connected, setConnected] = useState(false);

    return (
        <div className="flex h-full w-full">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-3xl mx-auto">
                        {!connected ? (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                                <p>Connect to start chatting</p>
                                <p className="text-sm">Click the connect button to begin</p>
                            </div>
                        ) : (
                                <Logger filter="conversations" />
                        )}
                    </div>
                </div>

                {/* Control Area */}
                <div className="flex-none border-t border-border/50 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/20">
                    <div className="max-w-3xl mx-auto p-6">
                        <ControlTray
                            videoRef={videoRef}
                            supportsVideo={true}
                            onVideoStreamChange={setVideoStream}
                        />
                    </div>
                </div>
            </div>

            {/* Visualizer Panel */}
            <VisualizerPanel videoRef={videoRef} videoStream={videoStream} />
        </div>
    );
}
