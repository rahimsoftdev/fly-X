export interface ProgressItem {
  key: string;
  label: string;
  rightLabel: string;
  percent: number; // 0 - 100
}

interface Props {
  items: ProgressItem[];
  // "mixed" = একটা নীল, একটা বেগুনি (Popular Routes এর মতো)
  variant?: "gradient" | "mixed";
}

const MIXED = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
];

export default function ProgressBarList({ items, variant = "gradient" }: Props) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => {
        const color =
          variant === "mixed"
            ? MIXED[i % MIXED.length]
            : "from-blue-500 to-purple-600";
        const width = Math.min(Math.max(item.percent, 0), 100);

        return (
          <li key={item.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {item.label}
              </span>
              <span className="text-gray-500 dark:text-slate-400">
                {item.rightLabel}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}