import { Calendar, MapPin, TrendingUp } from "lucide-react";
// import type { IHighDemandRoute, IPopularDate } from "../../dashboard.types";
// import {
//   formatDate,
//   formatDayPlural,
//   formatTimeOfDay,
// } from "../../dashboard.utils";
import type { IHighDemandRoute, IPopularDate } from "@/features/dashboard/dashboard.types";
import { formatDayPlural, formatTimeOfDay } from "@/features/dashboard/dashboard.utils";
import { formatDate } from "@/utils/formatDate";

interface Props {
  routes: IHighDemandRoute[];
  dates: IPopularDate[];
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-slate-700/50">
    {children}
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <p className="rounded-lg bg-gray-50 px-3 py-6 text-center text-xs text-gray-500 dark:bg-slate-700/50 dark:text-slate-400">
    {text}
  </p>
);

const growthClass = (growth: number) =>
  growth > 0
    ? "text-green-600 dark:text-green-400"
    : growth < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-slate-400";

export default function DemandInsights({ routes, dates }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="flex items-center gap-2 font-serif text-lg font-medium text-gray-900 dark:text-gray-50">
        <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
        Demand Insights
      </h2>
      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
        Members with similar travel intent are being grouped for curated flight
        opportunities
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-medium text-gray-900 dark:text-gray-50">
            <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
            High-Demand Routes
          </h3>

          <div className="space-y-2">
            {routes.length ? (
              routes.map((r) => (
                <Row key={`${r.origin}-${r.destination}-${r.dayOfWeek}-${r.preferredTime}`}>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                      {r.origin} → {r.destination}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                      {formatDayPlural(r.dayOfWeek)}{" "}
                      {formatTimeOfDay(r.preferredTime)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${growthClass(r.growth)}`}
                  >
                    {r.growth > 0 ? "+" : ""}
                    {r.growth}%
                  </span>
                </Row>
              ))
            ) : (
              <Empty text="No demand data yet" />
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-medium text-gray-900 dark:text-gray-50">
            <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
            Popular Travel Dates
          </h3>

          <div className="space-y-2">
            {dates.length ? (
              dates.map((d) => (
                <Row key={d.date}>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                      {formatDate(d.date)}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                      {d.routes} {d.routes === 1 ? "route" : "routes"} ·{" "}
                      {d.members} {d.members === 1 ? "member" : "members"}
                    </p>
                  </div>
                </Row>
              ))
            ) : (
              <Empty text="No upcoming dates yet" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}