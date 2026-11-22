const Box = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700 ${className}`}
  />
);

export default function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Box className="h-28" />
        <Box className="h-28" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Box className="h-80" />
        <Box className="h-80" />
      </div>
    </div>
  );
}