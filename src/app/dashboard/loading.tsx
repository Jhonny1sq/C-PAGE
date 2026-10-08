import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}