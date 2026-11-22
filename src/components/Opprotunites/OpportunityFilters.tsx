import type {
  OpportunityStatus,
  OpportunityType,
} from "@/types/opportunity.types";

interface OpportunityFiltersProps {
  status: OpportunityStatus;
  type: OpportunityType | "";
  onChange: (key: "status" | "type", value: string) => void;
}

const selectClass =
  "h-10 w-full rounded-lg border border-(--border-color) bg-(--background) px-3 text-sm text-(--foreground) outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const OpportunityFilters = ({
  status,
  type,
  onChange,
}: OpportunityFiltersProps) => (
  <div className="grid grid-cols-2 gap-3 sm:flex sm:w-auto sticky top-0">
    <label className="flex flex-col gap-1 sm:w-40">
      <span className="text-xs font-medium text-(--paragraph-text)">Status</span>
      <select
        className={selectClass}
        value={status}
        onChange={(e) => onChange("status", e.target.value)}
      >
        <option value="open">Open</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
      </select>
    </label>

    <label className="flex flex-col gap-1 sm:w-40">
      <span className="text-xs font-medium text-(--paragraph-text)">Trip type</span>
      <select
        className={selectClass}
        value={type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="">All types</option>
        <option value="one-way">One-way</option>
        <option value="two-way">Round trip</option>
      </select>
    </label>
  </div>
);

export default OpportunityFilters;