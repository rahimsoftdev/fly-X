import type { CustomTravelStatus } from "@/types/custom-travel.type";

const STATUS_STYLES: Record<
  CustomTravelStatus,
  { label: string; badge: string; dot: string }
> = {
  interested: {
    label: "Interested",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-green-500/10 text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
};

export default function StatusBadge({ status }: { status: CustomTravelStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.interested;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}