'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      themes={['system', 'light', 'dark']}
      enableColorScheme={false}
      enableSystem
    >
      {children}
    </NextThemeProvider>
  );
}
