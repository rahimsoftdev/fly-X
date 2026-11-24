import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Users } from "lucide-react";
import TravelDetailsModal from "@/components/calendar/TravelDetailsModal";
import { useFetch } from "@/hooks/useFetch";
import { getCalendarDay } from "@/services/custom-travel-calendar.service";
import {
  CALENDAR_PATH,
  formatDayTitle,
  formatDirection,
  formatShortDate,
} from "@/utils/calendar.util";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const CustomTravelDayPage = () => {
  const { date = "" } = useParams<{ date: string }>();
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const isValidDate = DATE_REGEX.test(date);

  const { data, isLoading, error } = useFetch(
    (signal) =>
      isValidDate
        ? getCalendarDay(date, signal)
        : Promise.reject(new Error("Invalid date")),
    [date]
  );

  // Back করলে একই মাসের calendar-এ ফিরবে
  const backTo = isValidDate
    ? `${CALENDAR_PATH}?month=${date.slice(0, 7)}`
    : CALENDAR_PATH;

  return (
    <div className=" ">
      <Link
        to={backTo}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--paragraph-text) hover:text-(--heading-text)"
      >
        <ArrowLeft size={16} />
        Back to calendar
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--heading-text)">
          {isValidDate ? formatDayTitle(date) : "Invalid date"}
        </h1>
        {data && (
          <p className="text-sm text-(--paragraph-text)">
            {data.total} interested members
          </p>
        )}
      </div>

      {isLoading && !data && (
        <div role="status" aria-live="polite" className="space-y-6">
          {/* Direction cards skeleton */}
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-(--border-color) p-4"
              >
                <div className="h-3 w-28 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="mt-3 h-7 w-12 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="mt-2 h-3 w-16 rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>

          {/* Members list skeleton */}
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col gap-3 rounded-xl border border-(--border-color) p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-200 dark:bg-slate-700" />
                  <div className="h-3 w-52 rounded bg-gray-200 dark:bg-slate-700" />
                  <div className="h-3 w-64 rounded bg-gray-200 dark:bg-slate-700" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-28 rounded-full bg-gray-200 dark:bg-slate-700" />
                  <div className="h-9 w-24 rounded-full bg-gray-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      )}

      {error && (
        <p className="py-16 text-center text-sm text-red-500">{error}</p>
      )}

      {data && (
        <>
          {/* Direction অনুযায়ী count */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {data.directions.map((d) => (
              <div
                key={`${d.origin}-${d.destination}`}
                className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10"
              >
                <p className="text-xs font-medium text-blue-600">
                  {formatDirection(d.origin, d.destination)}
                </p>
                <p className="text-2xl font-bold text-(--heading-text)">
                  {d.count}
                </p>
                <p className="text-xs text-(--paragraph-text)">members</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-(--heading-text)">
            <Users size={14} />
            Interested Members
          </h2>

          {data.items.length === 0 && (
            <p className="py-10 text-center text-sm text-(--paragraph-text)">
              No interested members for this day.
            </p>
          )}

          <div className="space-y-3">
            {data.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-xl border border-(--border-color) p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-(--heading-text)">
                      {item.member?.name ?? "Unknown member"}
                    </span>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      {item.type === "two-way" ? "Round Trip" : "One Way Trip"}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-600">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-(--paragraph-text)">
                    {formatDirection(item.origin, item.destination)}
                  </p>
                  <p className="text-xs text-(--paragraph-text)">
                    Departure: {formatShortDate(item.preferredDeparture)}
                    {item.type === "two-way" &&
                      ` · Return: ${formatShortDate(item.returnDate)}`}
                    {` · Passengers: ${item.passengerCount}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailsId(item._id)}
                    className="flex-1 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90 sm:flex-none"
                  >
                    View Details
                  </button>
                  {/* Message feature পরে করা হবে */}
                  <button
                    type="button"
                    
                    title="Coming soon"
                    className="flex-1 rounded-full bg-secondary px-5 py-2 text-sm font-medium text-white opacity-60 sm:flex-none"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {detailsId && (
        <TravelDetailsModal
          id={detailsId}
          onClose={() => setDetailsId(null)}
        />
      )}
    </div>
  );
};

export default CustomTravelDayPage;