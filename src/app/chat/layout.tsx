'use client';

import SidePanel from '@/components/chat/side-panel/side-panel';
import { useLiveAPIContext } from '@contexts/LiveAPIContext';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { connected } = useLiveAPIContext();

    // Memoize the callback to ensure stability
    const handleCollapse = useCallback((collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <div className="flex-none">
                <motion.aside
                    layout="position"
                    className={cn(
                        "h-full transition-all duration-300 ease-in-out",
                        sidebarCollapsed ? "w-20" : "w-[400px]"
                    )}
                >
                    <SidePanel
                        onCollapse={handleCollapse}
                        isCollapsed={sidebarCollapsed}
                    />
                </motion.aside>
            </div>

            <motion.main
                layout="position"
                className="relative flex-1 h-full"
            >
                {!connected && (
                    <Alert variant="destructive" className="absolute top-4 left-4 right-4 z-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please connect to start using the application
                        </AlertDescription>
                    </Alert>
                )}
                {children}
            </motion.main>
        </div>
    );
}
