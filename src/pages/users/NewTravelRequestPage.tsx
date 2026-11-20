import { useState, type FormEvent } from "react";
import { Calendar, Check, Loader2, MapPin, Send } from "lucide-react";
import { createCustomTravel } from "@/services/custom-travel.api";
import type {
  CreateCustomTravelPayload,
  CustomTripType,
  IPassenger,
} from "@/types/custom-travel.type";
import { todayString } from "@/utils/travel.util";
import { errorTextClass } from "@/components/travel/fieldStyles";
import FormField from "@/components/custom-travel/FormField";
import TripTypeToggle from "@/components/custom-travel/TripTypeToggle";
import PassengerCounter from "@/components/custom-travel/PassengerCounter";
import PassengerRow from "@/components/custom-travel/PassengerRow";
import WhatHappensNext from "@/components/custom-travel/WhatHappensNext";

const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyPassenger = (): IPassenger => ({
  firstName: "",
  lastName: "",
  streetAddress: "",
  zipCode: "",
  email: "",
  phone: "",
});

const textareaClass =
  "min-h-28 w-full resize-y rounded-md border border-(--border-color) bg-(--background) px-3 py-2 text-sm text-(--heading-text) outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function NewTravelRequestPage() {
  const [tripType, setTripType] = useState<CustomTripType>("one-way");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [returnOrigin, setReturnOrigin] = useState("");
  const [returnDestination, setReturnDestination] = useState("");
  const [preferredDeparture, setPreferredDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<IPassenger[]>([
    emptyPassenger(),
  ]);
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRoundTrip = tripType === "two-way";

  // ---------- passenger handlers ----------
  const handleCountChange = (next: number) => {
    setPassengers((prev) =>
      next > prev.length
        ? [
            ...prev,
            ...Array.from({ length: next - prev.length }, () =>
              emptyPassenger()
            ),
          ]
        : prev.slice(0, next)
    );
  };

  const handlePassengerChange = (
    index: number,
    field: keyof IPassenger,
    value: string
  ) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  // departure bodle gele, ager return date choto hoye gele muche dai
  const handleDepartureChange = (value: string) => {
    setPreferredDeparture(value);
    if (returnDate && value && returnDate < value) setReturnDate("");
  };

  // ---------- validation ----------
  const filled = (value: string) => value.trim() !== "";

  const passengersValid = passengers.every(
    (p) =>
      filled(p.firstName) &&
      filled(p.lastName) &&
      filled(p.streetAddress) &&
      filled(p.zipCode) &&
      filled(p.phone) &&
      EMAIL_REGEX.test(p.email.trim())
  );

  const routeValid =
    filled(origin) && filled(destination) && preferredDeparture !== "";

  const returnValid =
    !isRoundTrip ||
    (filled(returnOrigin) && filled(returnDestination) && returnDate !== "");

  // sob field puron na hole button disabled
  const canSubmit = routeValid && returnValid && passengersValid && !submitting;

  // ---------- submit ----------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("Origin and Destination can't be the same.");
      return;
    }

    const payload: CreateCustomTravelPayload = {
      type: tripType,
      origin: origin.trim(),
      destination: destination.trim(),
      preferredDeparture,
      passengers,
      ...(specialRequests.trim()
        ? { specialRequests: specialRequests.trim() }
        : {}),
      // return er field gulo shudhu round trip hole jabe
      ...(isRoundTrip
        ? {
            returnOrigin: returnOrigin.trim(),
            returnDestination: returnDestination.trim(),
            returnDate,
          }
        : {}),
    };

    try {
      setSubmitting(true);
      setError(null);

      await createCustomTravel(payload);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTripType("one-way");
    setOrigin("");
    setDestination("");
    setReturnOrigin("");
    setReturnDestination("");
    setPreferredDeparture("");
    setReturnDate("");
    setPassengers([emptyPassenger()]);
    setSpecialRequests("");
    setError(null);
    setSubmitted(false);
  };

  // ---------- success screen ----------
  if (submitted) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-xl rounded-xl border border-(--border-color) bg-(--card) p-6 text-center sm:p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-500/10">
            <Check className="size-6 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-(--heading-text)">
            Request submitted
          </h1>
          <p className="mt-2 text-sm text-(--paragraph-text)">
            Our concierge team will review your request within 24 hours and
            notify you when matching charter opportunities become available.
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Submit another request
          </button>
        </div>
      </main>
    );
  }

  // ---------- form ----------
  return (
    <main className="min-h-screen">
      <div className="mx-auto">
        <header>
          <h1 className="font-serif! text-2xl font-semibold text-(--heading-text) sm:text-3xl">
            New Travel Request
          </h1>
          <p className="mt-2 text-sm text-(--paragraph-text)">
            Submit your travel preferences and our concierge team will
            coordinate charter opportunities
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-(--border-color) bg-(--card) p-4 sm:p-6"
        >
          <h2 className="border-b border-(--border-color) pb-3 text-base font-semibold text-(--heading-text)">
            Route Details
          </h2>

          {/* Trip type */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-(--heading-text)">
              Trip Type
            </p>
            <TripTypeToggle value={tripType} onChange={setTripType} />
          </div>

          {/* Route fields: round trip hole extra field gulo dekhabe */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Origin"
              icon={MapPin}
              placeholder="e.g., New York (TEB)"
              value={origin}
              onChange={setOrigin}
            />
            <FormField
              label="Destination"
              icon={MapPin}
              placeholder="e.g., Tampa (TPA)"
              value={destination}
              onChange={setDestination}
            />

            {isRoundTrip && (
              <>
                <FormField
                  label="Return Origin"
                  icon={MapPin}
                  placeholder="e.g., Tampa (TPA)"
                  value={returnOrigin}
                  onChange={setReturnOrigin}
                />
                <FormField
                  label="Return Destination"
                  icon={MapPin}
                  placeholder="e.g., New York (TEB)"
                  value={returnDestination}
                  onChange={setReturnDestination}
                />
              </>
            )}

            <FormField
              label="Preferred Departure"
              icon={Calendar}
              type="date"
              min={todayString()}
              value={preferredDeparture}
              onChange={handleDepartureChange}
              className={isRoundTrip ? undefined : "md:col-span-2"}
            />

            {isRoundTrip && (
              <FormField
                label="Return Date"
                icon={Calendar}
                type="date"
                min={preferredDeparture || todayString()}
                value={returnDate}
                onChange={setReturnDate}
              />
            )}
          </div>

          {/* Passenger count */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-(--heading-text)">
              Number Of Passenger
            </p>
            <PassengerCounter
              value={passengers.length}
              min={MIN_PASSENGERS}
              max={MAX_PASSENGERS}
              onChange={handleCountChange}
            />
          </div>

          {/* Passenger information: count onujayi row */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-(--heading-text)">
              Passenger Information
            </p>

            <div className="space-y-3">
              {passengers.map((passenger, index) => (
                <PassengerRow
                  key={index}
                  index={index}
                  passenger={passenger}
                  onChange={handlePassengerChange}
                />
              ))}
            </div>
          </div>

          {/* Special requests */}
          <div className="mt-6">
            <label
              htmlFor="special-requests"
              className="mb-2 block text-xs font-medium text-(--heading-text)"
            >
              Special Requests
            </label>
            <textarea
              id="special-requests"
              rows={4}
              maxLength={2000}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Dietary restrictions, accessibility needs, pet travel, or other special requirements..."
              className={textareaClass}
            />
          </div>

          <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
            Note: A concierge will review your request and work to accommodate
            your travel needs.
          </p>

          {error && <p className={`mt-3 ${errorTextClass}`}>{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <WhatHappensNext />
      </div>
    </main>
  );
}