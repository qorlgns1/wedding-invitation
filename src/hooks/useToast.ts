import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastState = {
  message: string;
  visible: boolean;
};

export function useToast(timeoutMs = 3000): [ToastState, (message: string) => void] {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const timeoutRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (message: string) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setToast({ message, visible: true });
      timeoutRef.current = window.setTimeout(() => {
        setToast((current) => ({ ...current, visible: false }));
      }, timeoutMs);
    },
    [timeoutMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return [toast, showToast];
}
