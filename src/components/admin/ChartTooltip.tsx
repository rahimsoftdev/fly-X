interface Entry {
  name?: string | number;
  value?: string | number;
  color?: string;
}

interface Props {
  active?: boolean;
  label?: string | number;
  payload?: Entry[];
}

export default function ChartTooltip({ active, label, payload }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-600 dark:bg-slate-900">
      <p className="mb-1 text-[10px] text-gray-500 dark:text-slate-400">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            {p.name}
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-50">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}