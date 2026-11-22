const Box = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700 ${className}`}
  />
);

export default function AdminOverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Box className="h-20" />
        <Box className="h-20" />
        <Box className="h-20" />
        <Box className="h-20" />
      </div>
      <Box className="h-80" />
      <Box className="h-80" />
      <div className="grid gap-4 md:grid-cols-2">
        <Box className="h-96" />
        <Box className="h-40" />
      </div>
    </div>
  );
}