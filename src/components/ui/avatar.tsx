"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback: string;
}

function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = src && !errored;

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-emerald-300",
        className
      )}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? "avatar"}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}

export { Avatar };