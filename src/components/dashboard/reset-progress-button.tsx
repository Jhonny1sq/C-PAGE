"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ResetProgressButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function reset() {
    setLoading(true);
    const response = await fetch("/api/progress/reset?confirm=reset", {
      method: "POST",
    });
    setLoading(false);

    if (!response.ok) {
      toast({ title: "Reset failed", variant: "error" });
      return;
    }

    toast({
      title: "Progress reset",
      description: "Clean slate. Go get it.",
      variant: "success",
    });
    setConfirming(false);
    router.push("/learn");
    router.refresh();
  }

  if (!confirming) {
    return (
      <Button variant="outline" onClick={() => setConfirming(true)}>
        <Trash2 className="h-4 w-4" /> Reset progress
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={reset} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Yes, wipe it
      </Button>
    </div>
  );
}