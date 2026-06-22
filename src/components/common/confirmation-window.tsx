"use client";
import React from "react";
import { createPortal } from "react-dom";

interface ConfirmationWindowProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationWindow({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, delete it",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationWindowProps) {
  if (!open) return null;

  // Modal content to be portalled to document.body so it is not affected
  // by hover/focus handlers in parent components and to avoid layout
  // shifts that could remount the modal.
  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.4)",
      }}
      // Prevent pointer events from reaching underlying UI which can
      // sometimes trigger hover/focus handlers that mutate parent state.
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <div
        className="bg-card border-2 border-accent/30 rounded-xl shadow-2xl p-7 w-full max-w-sm"
        // Also stop propagation inside the dialog so clicks don't bubble
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-accent">{title}</h2>
        <p className="mb-5 text-base text-ink-900">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border border-accent/30 bg-card text-ink-900 hover:bg-accent/10 transition"
            onClick={onCancel}
            type="button"
            data-dismissible={"false"}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-accent/10 hover:bg-accent/20 text-accent font-semibold border border-accent/40 transition"
            onClick={onConfirm}
            type="button"
            data-dismissible={"false"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
