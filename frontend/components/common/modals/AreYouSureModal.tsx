"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import Modal from "./Modal";

interface AreYouSureModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  header?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export default function AreYouSureModal({
  open,
  onClose,
  onConfirm,
  header = "",
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: AreYouSureModalProps) {
  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={title}
      className="modal-open"
    >
      <div className="mb-5 flex flex-col items-start justify-between border-b-2 border-black/10 dark:border-white/10">
        <div className="mb-5 flex flex-col">
          {variant === "danger" && <TriangleAlert size={16} className="text-slate-400" />}
          <p className="text-xs font-bold tracking-widest text-slate-400">
            {variant === "danger" ? "WARNING —" : "PLEASE CONFIRM —"}
          </p>
          <h2 className="text-md font-extrabold">{header}</h2>
        </div>
      </div>

      <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">{description}</p>

      <div className="flex flex-col justify-end gap-2 border-t-2 border-black/10 pt-4 dark:border-white/10 sm:flex-row">
        <Button type="button" variant="outline" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="button" onClick={() => void handleConfirm()}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
