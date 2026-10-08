"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  info: "border-slate-600/50 bg-slate-800/90 text-slate-100",
};

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const remove = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ title, description, variant = "info" }) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, title, description, variant }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md",
              "animate-[toast-in_0.25s_ease-out]",
              VARIANT_STYLES[t.variant]
            )}
          >
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description ? (
              <p className="mt-0.5 text-xs opacity-80">{t.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}