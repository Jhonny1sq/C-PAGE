"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-2xl font-black text-slate-50">
        Something threw an exception.
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        A runtime error stopped this page. Try again — most of these are
        transient database or network hiccups.
      </p>
      <Button className="mt-6" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}