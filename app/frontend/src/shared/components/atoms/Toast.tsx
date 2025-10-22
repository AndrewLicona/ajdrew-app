import React from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg transition-all
        ${type === "success" ? "bg-[var(--color-success)] text-[var(--color-on-success)]" : ""}
        ${type === "error" ? "bg-[var(--color-danger)] text-[var(--color-on-danger)]" : ""}
        ${type === "info" ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]" : ""}
      `}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-sm font-bold px-2 py-1 rounded hover:bg-black/10"
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
