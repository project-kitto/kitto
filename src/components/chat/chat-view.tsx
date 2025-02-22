'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Logger from '@/components/chat/logger/logger';
import ControlTray from '@/components/chat/control-tray/control-tray';
import { VisualizerPanel } from './visualizer-panel';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useLoggerStore } from '@/lib/store-logger';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function ChatView() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const { connected, client } = useLiveAPIContext();
    const { logs } = useLoggerStore();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        client.send([{ text: message }]);
        setMessage('');
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Messages Area - Reduce bottom padding to make room for controls */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                    <div className="max-w-3xl mx-auto">
                        {!connected ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500/50 rounded-full animate-pulse" />
                                    <p className="text-sm">Disconnected</p>
                                </div>
                            </div>
                        ) : (
                                <Logger filter="conversations" />
                        )}
                    </div>
                </div>

                {/* Fixed Bottom Section */}
                <div className="flex-none border-t border-border/50 bg-background/95 backdrop-blur-md">
                    {/* Control Tray */}
                    <div className="border-b border-border/50 py-4">
                        <div className="max-w-3xl mx-auto px-6">
                            <ControlTray
                                videoRef={videoRef}
                                supportsVideo={true}
                                onVideoStreamChange={setVideoStream}
                            />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="py-4">
                        <div className="max-w-3xl mx-auto px-6">
                            <div className="relative">
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="min-h-[120px] w-full resize-none bg-muted/20 pr-12 rounded-xl focus:ring-1 ring-blue-500/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    disabled={!connected}
                                />
                                <Button
                                    size="icon"
                                    className="absolute bottom-3 right-3 h-9 w-9"
                                    onClick={handleSend}
                                    disabled={!connected || !message.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualizer Panel */}
            <VisualizerPanel videoRef={videoRef} videoStream={videoStream} />
        </div>
    );
}
