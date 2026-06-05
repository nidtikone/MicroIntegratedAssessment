import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { Spinner } from '../StateViews';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
}

/** Accessible confirm dialog (Radix) with a fade/scale animation. */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className="card fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md p-6"
                style={{ x: '-50%', y: '-50%' }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <Dialog.Title className="text-lg font-semibold text-slate-900">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-2 text-sm text-slate-500">
                    {description}
                  </Dialog.Description>
                )}
                <div className="mt-6 flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button className="btn-ghost" disabled={loading}>
                      {cancelLabel}
                    </button>
                  </Dialog.Close>
                  <button
                    className={destructive ? 'btn bg-red-600 text-white hover:bg-red-700' : 'btn-primary'}
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
                    {confirmLabel}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
