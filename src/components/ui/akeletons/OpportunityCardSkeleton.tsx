const OpportunityCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-(--border-color) bg-(--background) p-4 sm:p-5">
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-lg bg-(--border-color)" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-(--border-color)" />
        <div className="h-3 w-24 rounded bg-(--border-color)" />
      </div>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <div className="h-10 rounded bg-(--border-color)" />
      <div className="h-10 rounded bg-(--border-color)" />
      <div className="h-10 rounded bg-(--border-color)" />
    </div>
  </div>
);

export default OpportunityCardSkeleton;