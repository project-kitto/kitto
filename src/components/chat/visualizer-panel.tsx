'use client';

import { Altair } from '@/components/chat/altair/component';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject } from 'react';

interface VisualizerPanelProps {
    videoRef: RefObject<HTMLVideoElement | null> | RefObject<HTMLVideoElement>;
    videoStream: MediaStream | null;
}

export function VisualizerPanel({ videoRef, videoStream }: VisualizerPanelProps) {
    return (
        <motion.div
            className="w-[480px] h-full border-l border-border/50 bg-muted/10 backdrop-blur"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
                {/* Visualization */}
                <div className="flex-1 bg-muted/20 rounded-2xl p-4 backdrop-blur ring-1 ring-border/10">
                    {!videoStream ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            <p className="text-sm">No visualization data</p>
                        </div>
                    ) : (
                            <Altair />
                    )}
                </div>

                {/* Video */}
                <AnimatePresence>
                    {videoStream ? (
                        <motion.video
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full aspect-video rounded-2xl bg-muted/20 object-cover ring-1 ring-border/10"
                            ref={videoRef}
                            autoPlay
                            playsInline
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="aspect-video rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground"
                        >
                            <p className="text-sm">No video input</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
