import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };