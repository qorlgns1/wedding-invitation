import type { ToastState } from '../hooks/useToast';

type ToastProps = {
  id: string;
  className: string;
  toast: ToastState;
  messageId?: string;
};

export function Toast({ id, className, toast, messageId }: ToastProps) {
  return (
    <div className={className} id={id} style={{ display: toast.visible ? 'block' : 'none' }}>
      {messageId ? <span id={messageId}>{toast.message}</span> : toast.message}
    </div>
  );
}
