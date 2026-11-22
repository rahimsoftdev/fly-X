import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
}

export default function SummaryCard({ icon: Icon, label, value }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-2xl font-medium leading-none text-gray-900 dark:text-gray-50">
          {value}
        </p>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}