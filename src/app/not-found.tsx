import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-black text-emerald-500">404</p>
      <h1 className="mt-4 text-2xl font-black text-slate-50">
        Undefined behavior.
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        That page does not exist — segfaulted somewhere between the fridge and
        the stack. Head back to something that compiles.
      </p>
      <Button asChild className="mt-6">
        <Link href="/learn">Back to the learning path</Link>
      </Button>
    </div>
  );
}