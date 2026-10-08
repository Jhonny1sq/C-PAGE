import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-6 h-24 w-full" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}