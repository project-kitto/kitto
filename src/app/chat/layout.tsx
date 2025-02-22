'use client';

import SidePanel from '@/components/chat/side-panel/side-panel';
import { useLiveAPIContext } from '@contexts/LiveAPIContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { connected } = useLiveAPIContext();

    // Simplified callback
    const handleCollapse = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <motion.aside
                layout
                className={cn(
                    "h-full border-r border-border/50 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/20",
                    sidebarCollapsed ? "w-20" : "w-[400px]"
                )}
                transition={{ duration: 0.2 }}
            >
                <SidePanel onCollapse={handleCollapse} />
            </motion.aside>

            {/* Main Content Area */}
            <motion.main
                layout
                className="relative flex flex-1 h-full"
                transition={{ duration: 0.2 }}
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
