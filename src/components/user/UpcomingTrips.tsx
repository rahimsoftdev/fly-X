import type { IUpcomingTrip } from "@/features/dashboard/dashboard.types";
import { formatDayPlural, formatTimeOfDay } from "@/features/dashboard/dashboard.utils";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router";
// import type { IUpcomingTrip } from "../../dashboard.types";
// import {
//   formatDate,
//   formatDayPlural,
//   formatTimeOfDay,
// } from "../../dashboard.utils";

interface Props {
  trips: IUpcomingTrip[];
  viewAllPath: string;
}

export default function UpcomingTrips({ trips, viewAllPath }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-medium text-gray-900 dark:text-gray-50">
          Upcoming Trips
        </h2>
        <Link
          to={viewAllPath}
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {trips.length ? (
          trips.map((t) => {
            const isRegular = t.type === "regular";
            const subtitle = isRegular
              ? `${formatDayPlural(t.dayOfWeek)}, ${formatTimeOfDay(t.preferredTime)}`
              : `${t.date ? formatDate(t.date) : ""}, ${formatTimeOfDay(t.preferredTime)}`;

            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-slate-700/50"
              >
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                    {t.origin} → {t.destination}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">
                    {subtitle}
                  </p>
                </div>

                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {isRegular ? "Recurring" : "One-Time"}
                </span>
              </div>
            );
          })
        ) : (
          <p className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:bg-slate-700/50 dark:text-slate-400">
            No upcoming trips yet
          </p>
        )}
      </div>
    </div>
  );
}