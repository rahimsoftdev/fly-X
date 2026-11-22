import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone: "blue" | "purple";
}

const TONES = {
  blue: { icon: "bg-blue-500", glow: "bg-blue-400/20" },
  purple: { icon: "bg-purple-500", glow: "bg-purple-400/20" },
};

export default function StatCard({ icon: Icon, label, value, tone }: Props) {
  const t = TONES[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* হালকা blur glow */}
      <div
        className={`pointer-events-none absolute left-10 top-2 h-24 w-24 rounded-full blur-3xl ${t.glow}`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${t.icon}`}
        >
          <Icon size={20} />
        </div>
        <span className="text-xs text-gray-600 dark:text-slate-300">
          {label}
        </span>
      </div>

      <p className="relative mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
        {value}
      </p>
    </div>
  );
}