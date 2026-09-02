export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 skeleton-box"></div>
        <div className="h-4 w-4 skeleton-box rounded-full"></div>
      </div>
      <div className="mt-4">
        <div className="h-7 w-12 skeleton-box"></div>
        <div className="mt-2 h-3 w-20 skeleton-box"></div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 skeleton-box rounded-lg"></div>
        <div className="h-5 w-16 skeleton-box rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 skeleton-box"></div>
        <div className="h-3 w-full skeleton-box"></div>
      </div>
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <div className="h-3 w-20 skeleton-box"></div>
        <div className="h-3 w-12 skeleton-box"></div>
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 w-2/3">
          <div className="h-3 w-16 skeleton-box"></div>
          <div className="h-5 w-full skeleton-box"></div>
        </div>
        <div className="h-5 w-14 skeleton-box rounded"></div>
      </div>
      <div className="h-3 w-full skeleton-box"></div>
      <div className="flex gap-2">
        <div className="h-5 w-16 skeleton-box rounded"></div>
        <div className="h-5 w-20 skeleton-box rounded"></div>
      </div>
    </div>
  );
}
