"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
  dismissable?: boolean;
  large?: boolean;
}

export default function Modal({
  open,
  onClose,
  children,
  className = "",
  label = "Dialog",
  dismissable = true,
  large = false,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && dismissable) onClose();
      }}
      disablePointerDismissal={!dismissable}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[1000] bg-black/60 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          aria-label={label}
          className={`fixed left-1/2 top-1/2 z-[1001] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-2xl outline-none transition-[opacity,transform] duration-200 dark:bg-[#0f1724] dark:text-white data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 ${large ? "max-w-4xl" : "max-w-xl"} ${className}`}
        >
          {dismissable && (
            <Dialog.Close
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </Dialog.Close>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
