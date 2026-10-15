// Minimal toast hook — replace with full shadcn/ui toast implementation as needed
import { useState, useCallback } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple in-memory store (no Radix portal for brevity; swap in full shadcn toast when ready)
let _toastFn: ((t: Toast) => void) | null = null;

export function toast(t: Toast) {
  if (_toastFn) {
    _toastFn(t);
  } else {
    // Fallback: browser alert in development
    console.warn('[toast]', t.title, t.description);
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    _toastFn = addToast;
    // Auto-dismiss after 4s
    setTimeout(() => setToasts((prev) => prev.slice(1)), 4000);
  }, []);

  // Register handler on first use
  _toastFn = addToast;

  return { toasts, toast: addToast };
}
