"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { HEARTS_PER_LESSON } from "@/lib/gamification";

export function Hearts({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} hearts left`}>
      {Array.from({ length: HEARTS_PER_LESSON }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            "h-4 w-4 transition-colors",
            i < value ? "fill-rose-500 text-rose-500" : "text-slate-700"
          )}
        />
      ))}
    </div>
  );
}