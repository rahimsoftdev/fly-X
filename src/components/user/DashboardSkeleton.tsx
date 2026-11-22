const Box = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700 ${className}`}
  />
);

export default function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Box className="h-24" />
        <Box className="h-24" />
        <Box className="h-24" />
      </div>
      <Box className="h-28" />
      <Box className="h-72" />
      <Box className="h-64" />
    </div>
  );
}