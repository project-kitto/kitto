'use client';

import { LiveAPIProvider } from '@contexts/LiveAPIContext';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const host = 'generativelanguage.googleapis.com';
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LiveAPIProvider url={uri} apiKey={API_KEY}>
            {children}
        </LiveAPIProvider>
    );
}
