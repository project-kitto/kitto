'use client';

import { Button } from "@/components/ui/button";
import Logger, { LoggerFilterType } from '@/components/chat/logger/logger';
import { cn } from '@/lib/utils';
import { filterOptions } from '@/lib/constants';
import { useLiveAPIContext } from '@contexts/LiveAPIContext';
import { useLoggerStore } from '@lib/store-logger';
import { useEffect, useRef, useState, useCallback } from 'react';
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from 'react-icons/ri';
import Select from 'react-select';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { Send } from "lucide-react";

interface SidePanelProps {
  onCollapse: (collapsed: boolean) => void;
  isCollapsed: boolean;
}

// Move formatTime to a utils file to avoid hydration issues
const formatTime = (date: Date) => {
  return date.toISOString().slice(11, 16); // Use ISO format instead of locale-specific
};

export default function SidePanel({ onCollapse, isCollapsed }: SidePanelProps) {
  const { connected, client } = useLiveAPIContext();
  const loggerRef = useRef<HTMLDivElement>(null);
  const loggerLastHeightRef = useRef<number>(-1);
  const { log, logs } = useLoggerStore();

  const [textInput, setTextInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  //scroll the log to the bottom when new logs come in
  useEffect(() => {
    if (loggerRef.current) {
      const el = loggerRef.current;
      const scrollHeight = el.scrollHeight;
      if (scrollHeight !== loggerLastHeightRef.current) {
        el.scrollTop = scrollHeight;
        loggerLastHeightRef.current = scrollHeight;
      }
    }
  }, [logs]);

  // listen for log events and store them
  useEffect(() => {
    client.on('log', log);
    return () => {
      client.off('log', log);
    };
  }, [client, log]);

  const handleSubmit = () => {
    client.send([{ text: textInput }]);

    setTextInput('');
    if (inputRef.current) {
      inputRef.current.innerText = '';
    }
  };

  const handleToggle = useCallback(() => {
    if (typeof onCollapse === 'function') {
      onCollapse(!isCollapsed);
    }
  }, [onCollapse, isCollapsed]);

  return (
    <div className="flex h-full">
      {/* Navigation Bar - Always visible */}
      <nav className="w-20 shrink-0 border-r border-neutral-800 bg-neutral-900/50 flex flex-col py-6">
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            disabled={!connected}
          >
            <HiOutlineClipboardDocumentList size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="p-3" disabled={!connected}>
            <MdOutlineHistory size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="p-3" disabled={!connected}>
            <IoSettingsOutline size={24} />
          </Button>
        </div>
      </nav>

      {/* Collapsible Panel */}
      <div
        className={cn(
          "flex flex-col bg-neutral-900 overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0" : "w-[380px]"
        )}
      >
        {/* Panel Content - Hidden when collapsed */}
        <div className={cn(
          "w-[380px] flex flex-col transition-opacity duration-300",
          isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
        )}>
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-xl font-medium text-neutral-100">Console</h2>
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              onClick={handleToggle}
            >
              {!isCollapsed ? <RiSidebarFoldLine size={20} /> : <RiSidebarUnfoldLine size={20} />}
            </Button>
          </header>

          {/* Filter and Status */}
          <div className="flex items-center gap-4 p-6 border-b border-neutral-800">
            <Select
              className="flex-1"
              defaultValue={selectedOption}
              options={filterOptions}
              onChange={setSelectedOption}
              isDisabled={!connected}
              styles={{
                control: (base) => ({
                  ...base,
                  background: 'rgb(23 23 23)',
                  borderColor: 'rgb(38 38 38)',
                  minHeight: '40px',
                }),
                menu: (base) => ({
                  ...base,
                  background: 'rgb(23 23 23)',
                  borderColor: 'rgb(38 38 38)',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isFocused
                    ? 'rgb(38 38 38)'
                    : isSelected
                      ? 'rgb(64 64 64)'
                      : undefined,
                  color: 'rgb(229 229 229)',
                }),
              }}
            />
            <div className={cn(
              "px-4 py-2 rounded-lg border text-sm whitespace-nowrap",
              connected
                ? "border-blue-900/50 bg-blue-950/20 text-blue-400"
                : "border-neutral-800 bg-neutral-900 text-neutral-400"
            )}>
              {connected ? '🟢 Connected' : '⚫ Disconnected'}
            </div>
          </div>

          {/* Logger */}
          <div className="flex-1 overflow-y-auto p-6" ref={loggerRef}>
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-neutral-500">
                No logs to display
              </div>
            ) : (
                <Logger filter={(selectedOption?.value as LoggerFilterType) || 'none'} />
            )}
          </div>

          {/* Input Area */}
          <div className={cn(
            "p-6 border-t border-neutral-800",
            !connected && "opacity-50 pointer-events-none"
          )}>
            <div className="relative">
              <textarea
                className="w-full h-[120px] bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                ref={inputRef}
                placeholder="Type something..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                size="icon"
                className="absolute bottom-4 right-4"
                disabled={!connected || !textInput.trim()}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
