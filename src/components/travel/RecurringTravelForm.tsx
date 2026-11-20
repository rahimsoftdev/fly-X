import { useState, type FormEvent } from "react";
import { ArrowDown, Loader2, Plus } from "lucide-react";
import { createTravel } from "@/services/travel.api";
import { DAY_OPTIONS, TIME_OPTIONS } from "@/utils/travel.util";
import type { DayOfWeek, PreferredTime } from "@/types/travel.type";
import SelectField from "./SelectField";
import {
  addButtonClass,
  errorTextClass,
  inputClass,
  labelClass,
} from "./fieldStyles";

interface Props {
  onCreated: () => void;
}

export default function RecurringTravelForm({ onCreated }: Props) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">("");
  const [preferredTime, setPreferredTime] = useState<PreferredTime | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sob field puron na hole button disabled
  const canSubmit =
    origin.trim() !== "" &&
    destination.trim() !== "" &&
    dayOfWeek !== "" &&
    preferredTime !== "" &&
    !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !dayOfWeek || !preferredTime) return;

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("From and To can't be the same.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createTravel({
        type: "regular",
        origin: origin.trim(),
        destination: destination.trim(),
        dayOfWeek,
        preferredTime,
      });

      // post hoye gele form khali
      setOrigin("");
      setDestination("");
      setDayOfWeek("");
      setPreferredTime("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="font-serif! text-lg font-semibold text-(--heading-text)">
        Recurring Travel
      </h2>
      <p className="mt-1 text-sm text-(--paragraph-text)">
        Set your regular travel patterns. We'll use this to match you with other
        members traveling on similar routes.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="rounded-xl border border-(--border-color) bg-(--card) p-4 sm:p-5">
          <label htmlFor="recurring-origin" className={labelClass}>
            Direction
          </label>

          <input
            id="recurring-origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="From"
            className={inputClass}
          />

          <ArrowDown className="my-2 size-4 text-slate-400" />

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="To"
            aria-label="To"
            className={inputClass}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Day of Week"
              value={dayOfWeek}
              onChange={(v) => setDayOfWeek(v as DayOfWeek)}
              options={DAY_OPTIONS}
              placeholder="Select day"
            />

            <SelectField
              label="Preferred Time"
              value={preferredTime}
              onChange={(v) => setPreferredTime(v as PreferredTime)}
              options={TIME_OPTIONS}
              placeholder="Select time"
            />
          </div>
        </div>

        {error && <p className={errorTextClass}>{error}</p>}

        <button type="submit" disabled={!canSubmit} className={addButtonClass}>
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add Recurring Travel
        </button>
      </form>
    </section>
  );
}