import type { ToastState } from '../hooks/useToast';

type ToastProps = {
  id: string;
  toast: ToastState;
  variant: 'share' | 'account';
  messageId?: string;
};

export function Toast({ id, toast, variant, messageId }: ToastProps) {
  if (!toast.visible) return null;

  return (
    <div
      className="fixed left-1/2 top-1/2 z-[10000] animate-[toast-scale-in_0.3s_ease-out] rounded-[25px] bg-black/80 px-8 py-4 font-kr text-[1em] font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] [transform:translate(-50%,-50%)] backdrop-blur-[10px]"
      data-toast-variant={variant}
      id={id}
    >
      {messageId ? <span id={messageId}>{toast.message}</span> : toast.message}
    </div>
  );
}
