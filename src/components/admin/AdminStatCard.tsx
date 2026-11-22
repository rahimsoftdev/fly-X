
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: "blue" | "gray";
  hint?: string;
}

const TONES = {
  blue: "bg-blue-500 text-white",
  gray: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-200",
};

export default function AdminStatCard({
  icon: Icon,
  label,
  value,
  tone = "gray",
  hint,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
          {label}
        </p>
        {hint && (
          <p className="text-[10px] font-medium uppercase tracking-wide text-teal-500">
            {hint}
          </p>
        )}
        <p className="mt-0.5 truncate text-xl font-semibold text-gray-900 dark:text-gray-50">
          {value}
        </p>
      </div>
    </div>
  );
}