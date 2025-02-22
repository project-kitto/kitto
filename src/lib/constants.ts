import { LoggerFilterType } from '@/components/chat/logger/logger';

export const filterOptions: { value: LoggerFilterType; label: string }[] = [
    { value: 'conversations', label: 'Conversations' },
    { value: 'tools', label: 'Tool Use' },
    { value: 'none', label: 'All' },
];
