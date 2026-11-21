import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, MapPin, Send } from "lucide-react";
import { createOpportunity } from "@/services/opportunity-manage.service";
import { OPPORTUNITIES_PATH } from "@/utils/opportunity.util";

type TripType = "one-way" | "two-way";

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "one-way", label: "One Way" },
  { value: "two-way", label: "Two Way" },
];

const inputClass =
  "w-full rounded-lg border border-transparent bg-(--card) px-4 py-3 text-sm text-(--heading-text) outline-none transition placeholder:text-(--paragraph-text) focus:border-primary";

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) => (
  <label className="block space-y-2">
    <span className="flex items-center gap-2 text-sm font-medium text-(--heading-text)">
      {icon}
      {label}
    </span>
    {children}
  </label>
);

const pad = (n: number) => String(n).padStart(2, "0");

const getTodayInputValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const NewOpportunityPage = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<TripType>("one-way");
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    preferredDeparture: "",
    returnDate: "",
    price: "",
    aircraftType: "",
    totalCapacity: "",
  });
  const [submitting, setSubmitting] = useState<"open" | "draft" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isTwoWay = type === "two-way";

  const setField =
    (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const submit = async (status: "open" | "draft") => {
    setError(null);

    if (
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.preferredDeparture ||
      !form.price ||
      !form.aircraftType.trim() ||
      !form.totalCapacity
    ) {
      return setError("Please fill in all the fields");
    }
    if (isTwoWay && !form.returnDate) {
      return setError("Please select a return date");
    }
    if (
      form.origin.trim().toLowerCase() === form.destination.trim().toLowerCase()
    ) {
      return setError("Origin and destination can't be the same");
    }
    // "YYYY-MM-DD" string তুলনা করলেই তারিখের ক্রম ঠিক থাকে
    if (isTwoWay && form.returnDate < form.preferredDeparture) {
      return setError("Return date can't be before the departure date");
    }
    if (
      Number(form.totalCapacity) < 1 ||
      !Number.isInteger(Number(form.totalCapacity))
    ) {
      return setError("Total capacity must be a whole number of at least 1");
    }
    if (Number(form.price) < 0) {
      return setError("Price can't be negative");
    }

    setSubmitting(status);
    try {
      await createOpportunity({
        type,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        preferredDeparture: form.preferredDeparture,
        ...(isTwoWay ? { returnDate: form.returnDate } : {}),
        price: Number(form.price),
        aircraftType: form.aircraftType.trim(),
        totalCapacity: Number(form.totalCapacity),
        status,
      });
      navigate(OPPORTUNITIES_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(null);
    }
  };

  // Enter চাপলে ভুল করে submit না হওয়ার জন্য
  const onFormSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <div className="space-y-6">
      <Link
        to={OPPORTUNITIES_PATH}
        className="inline-flex items-center gap-2 text-sm font-medium text-(--paragraph-text) hover:text-(--heading-text)"
      >
        <ArrowLeft size={16} />
        Back to opportunities
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-(--heading-text) sm:text-3xl">
          New Opportunities
        </h1>
        <p className="text-sm text-(--paragraph-text)">
          Create New Opportunities
        </p>
      </div>

      <form
        onSubmit={onFormSubmit}
        className="space-y-8 rounded-2xl border border-(--border-color) p-4 sm:p-6"
      >
        {/* Route details */}
        <section className="space-y-5">
          <h2 className="border-b border-(--border-color) pb-3 text-base font-semibold text-(--heading-text)">
            Route Details
          </h2>

          <div className="space-y-2">
            <p className="text-sm font-medium text-(--heading-text)">
              Trip Type
            </p>
            <div className="flex flex-wrap gap-2">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  aria-pressed={type === t.value}
                  className={`rounded-full px-5 py-2 text-xs font-medium transition ${
                    type === t.value
                      ? "bg-primary text-white ring-4 ring-blue-100 dark:ring-blue-500/20"
                      : "bg-(--card) text-(--paragraph-text) hover:text-(--heading-text)"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Origin" icon={<MapPin size={14} />}>
              <input
                value={form.origin}
                onChange={setField("origin")}
                placeholder="e.g., New York (TEB)"
                className={inputClass}
              />
            </Field>

            <Field label="Destination" icon={<MapPin size={14} />}>
              <input
                value={form.destination}
                onChange={setField("destination")}
                placeholder="e.g., Tampa (TPA)"
                className={inputClass}
              />
            </Field>

            <Field label="Preferred Departure" icon={<Calendar size={14} />}>
              <input
                type="date"
                min={getTodayInputValue()}
                value={form.preferredDeparture}
                onChange={setField("preferredDeparture")}
                className={inputClass}
              />
            </Field>

            {isTwoWay && (
              <Field label="Return Date" icon={<Calendar size={14} />}>
                <input
                  type="date"
                  min={form.preferredDeparture || getTodayInputValue()}
                  value={form.returnDate}
                  onChange={setField("returnDate")}
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Estimated Price">
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={form.price}
                onChange={setField("price")}
                placeholder="$4200"
                className={inputClass}
              />
            </Field>
          </div>

          {isTwoWay && (
            <p className="text-xs text-(--paragraph-text)">
              Return route will be{" "}
              {form.destination.trim() || "Destination"} →{" "}
              {form.origin.trim() || "Origin"}.
            </p>
          )}
        </section>

        {/* Aircraft details */}
        <section className="space-y-5">
          <h2 className="border-b border-(--border-color) pb-3 text-base font-semibold text-(--heading-text)">
            Aircraft Details
          </h2>

          <Field label="Aircraft Type">
            <input
              value={form.aircraftType}
              onChange={setField("aircraftType")}
              placeholder="Write aircraft name"
              className={inputClass}
            />
          </Field>

          <Field label="Total Capacity">
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={form.totalCapacity}
              onChange={setField("totalCapacity")}
              placeholder="Write total capacity"
              className={inputClass}
            />
          </Field>
        </section>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => submit("open")}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            {submitting === "open" ? "Saving..." : "Open For Reservation"}
          </button>
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => submit("draft")}
            className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting === "draft" ? "Saving..." : "Draft"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOpportunityPage;