import type { CustomTripType } from "@/types/custom-travel.type";

interface Props {
  value: CustomTripType;
  onChange: (value: CustomTripType) => void;
}

const OPTIONS: { value: CustomTripType; label: string }[] = [
  { value: "one-way", label: "One Way" },
  { value: "two-way", label: "Round trip" },
];

export default function TripTypeToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Trip type"
      className="inline-flex rounded-full bg-primary/10 p-1"
    >
      {OPTIONS.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-primary text-white shadow-sm"
                : "text-(--heading-text) hover:bg-primary/10"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}