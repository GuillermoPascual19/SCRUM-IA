export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--accent)] ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-1 w-full rounded-full" />
      <div className="flex justify-between pt-2 border-t border-[var(--border)]">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
