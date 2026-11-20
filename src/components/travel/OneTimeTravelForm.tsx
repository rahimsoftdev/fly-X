import { useId, useState, type FormEvent } from "react";
import { ArrowDown, Loader2, Plus } from "lucide-react";
import { createTravel } from "@/services/travel.api";
import { TIME_OPTIONS, todayString } from "@/utils/travel.util";
import type { PreferredTime } from "@/types/travel.type";
import SelectField from "./SelectField";
import {
  addButtonClass,
  errorTextClass,
  inputBase,
  inputClass,
  labelClass,
} from "./fieldStyles";

interface Props {
  onCreated: () => void;
}

export default function OneTimeTravelForm({ onCreated }: Props) {
  const dateId = useId();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [preferredTime, setPreferredTime] = useState<PreferredTime | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sob field puron na hole button disabled
  const canSubmit =
    origin.trim() !== "" &&
    destination.trim() !== "" &&
    date !== "" &&
    preferredTime !== "" &&
    !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !preferredTime) return;

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("From and To can't be the same.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createTravel({
        type: "one-time",
        origin: origin.trim(),
        destination: destination.trim(),
        date,
        preferredTime,
      });

      // post hoye gele form khali
      setOrigin("");
      setDestination("");
      setDate("");
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
        One-Time Travel Requests
      </h2>
      <p className="mt-1 text-sm text-(--paragraph-text)">
        Add specific trips you're planning. These help us identify demand spikes
        for curated flights.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="rounded-xl border border-(--border-color) bg-(--card) p-4 sm:p-5">
          <label htmlFor="onetime-origin" className={labelClass}>
            Direction
          </label>

          <input
            id="onetime-origin"
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
            <div>
              <label htmlFor={dateId} className={labelClass}>
                Date
              </label>
              <input
                id={dateId}
                type="date"
                value={date}
                min={todayString()}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputBase} ${
                  date ? "text-(--heading-text)" : "text-slate-400"
                }`}
              />
            </div>

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
          Add One-Time Travel
        </button>
      </form>
    </section>
  );
}