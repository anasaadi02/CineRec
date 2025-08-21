'use client';

import { useEffect } from 'react';

export function HydrationSuppressor() {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('hydration')) {
        // Check if it's a browser extension related hydration warning
        if (message.includes('data-extension') || 
            message.includes('cz-shortcut-listen') ||
            message.includes('browser extension') ||
            message.includes('Encountered two children with the same key') ||
            message.includes('A tree hydrated but some attributes')) {
          return; // Suppress the warning
        }
      }
      // Log other errors normally
      originalConsoleError.apply(console, args);
    };

    // Also suppress React warnings about hydration mismatches
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('hydration')) {
        // Suppress hydration warnings
        return;
      }
      // Log other warnings normally
      originalConsoleWarn.apply(console, args);
    };

    // Restore original console methods on cleanup
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null; // This component doesn't render anything
}
