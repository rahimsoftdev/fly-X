import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  year: number;
  onYearChange: (year: number) => void;
  legend?: ReactNode;
  children: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  year,
  onYearChange,
  legend,
  children,
}: Props) {
  const current = new Date().getFullYear();
  const years = [current, current - 1, current - 2];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
            {subtitle}
          </p>
          {legend && <div className="mt-2">{legend}</div>}
        </div>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y === current ? "This year" : y}
            </option>
          ))}
        </select>
      </div>

      {children}
    </div>
  );
}