import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ICustomTravel } from "@/types/custom-travel.type";
import { formatTravelDate } from "@/utils/travel.util";
import StatusBadge from "./StatusBadge";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-(--paragraph-text)">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-(--heading-text)">
        {children}
      </dd>
    </div>
  );
}

function RouteText({ from, to }: { from: string; to: string }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {from}
      <ArrowRight className="size-3.5 shrink-0 text-(--paragraph-text)" />
      {to}
    </span>
  );
}

export default function CustomTravelCard({ travel }: { travel: ICustomTravel }) {
  const [showPassengers, setShowPassengers] = useState(false);

  const isRoundTrip = travel.type === "two-way";
  const count = travel.passengers.length;

  return (
    <article className="rounded-xl border border-(--border-color) bg-(--card) p-4 sm:p-5">
      {/* uporer line: route + trip type + status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-(--heading-text)">
          <RouteText from={travel.origin} to={travel.destination} />
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {isRoundTrip ? "Round trip" : "One Way"}
          </span>
          <StatusBadge status={travel.status} />
        </div>
      </div>

      {/* details */}
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Departure">
          {formatTravelDate(travel.preferredDeparture)}
        </Detail>

        {isRoundTrip && (
          <>
            <Detail label="Return route">
              <RouteText
                from={travel.returnOrigin ?? travel.destination}
                to={travel.returnDestination ?? travel.origin}
              />
            </Detail>
            <Detail label="Return date">
              {formatTravelDate(travel.returnDate)}
            </Detail>
          </>
        )}

        <Detail label="Passengers">
          {count} {count === 1 ? "passenger" : "passengers"}
        </Detail>

        <Detail label="Submitted">{formatTravelDate(travel.createdAt)}</Detail>
      </dl>

      {travel.specialRequests && (
        <div className="mt-4">
          <p className="text-xs text-(--paragraph-text)">Special requests</p>
          <p className="mt-0.5 whitespace-pre-line wrap-break-word text-sm text-(--heading-text)">
            {travel.specialRequests}
          </p>
        </div>
      )}

      {/* passenger list: toggle */}
      <button
        type="button"
        onClick={() => setShowPassengers((v) => !v)}
        aria-expanded={showPassengers}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {showPassengers ? "Hide passengers" : "View passengers"}
        <ChevronDown
          className={`size-4 transition-transform ${
            showPassengers ? "rotate-180" : ""
          }`}
        />
      </button>

      {showPassengers && (
        <ul className="mt-3 space-y-2">
          {travel.passengers.map((p, index) => (
            <li
              key={index}
              className="rounded-lg border border-(--border-color) px-3 py-2.5"
            >
              <p className="text-sm font-medium text-(--heading-text)">
                {p.firstName} {p.lastName}
              </p>
              <p className="mt-0.5 wrap-break-word text-xs text-(--paragraph-text)">
                {p.email} · {p.phone}
              </p>
              <p className="wrap-break-word text-xs text-(--paragraph-text)">
                {p.streetAddress}, {p.zipCode}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}