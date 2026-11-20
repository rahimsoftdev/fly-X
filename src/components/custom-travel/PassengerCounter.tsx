import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function PassengerCounter({ value, min, max, onChange }: Props) {
  const remaining = max - value;

  return (
    <div className="flex w-full max-w-sm items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Remove a passenger"
        className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>

      <div className="text-center" aria-live="polite">
        <p className="text-2xl font-semibold text-(--heading-text)">{value}</p>
        <p className="text-xs text-(--paragraph-text)">
          {value === 1 ? "seat" : "seats"}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-primary">
          {remaining} {remaining === 1 ? "seat" : "seats"} available
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Add a passenger"
        className="flex size-9 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}