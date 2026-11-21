import { useState } from "react";
import { Filter } from "lucide-react";
import TravelDetailsModal from "@/components/travel/TravelDetailsModal";
import TravelRowActions from "@/components/travel/TravelRowActions";
// import TravelStatusBadge from "@/components/travel/TravelStatusBadge";
import { useFetch } from "@/hooks/useFetch";
import {
  getManageTravelDirections,
  getManageTravels,
  updateManageTravelStatus,
} from "@/services/travel-manage.service";
import type { TravelStatus, TravelType } from "@/types/travel.type";
import { formatMediumDate } from "@/utils/calendar.util";
import {
  capitalize,
  formatTravelRoute,
  TRAVEL_STATUSES,
} from "@/utils/travel.util";
import TravelStatusBadge from "@/components/travel/ravelStatusBadge";

const LIMIT = 10;

const TABS: { value: TravelType; label: string }[] = [
  { value: "regular", label: "Recurring Travel" },
  { value: "one-time", label: "One-Time Travel Requests" },
];

const selectClass =
  "min-w-0 flex-1 rounded-lg border border-(--border-color) bg-(--background) px-3 py-2 text-sm text-(--heading-text) outline-none focus:border-primary sm:flex-none";

const RoutePill = ({ route }: { route: string }) => (
  <span className="inline-block rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-white">
    {route}
  </span>
);

const TravelManagementPage = () => {
  const [type, setType] = useState<TravelType>("regular");
  const [direction, setDirection] = useState(""); // "origin|destination"
  const [status, setStatus] = useState<"" | TravelStatus>("");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [origin, destination] = direction ? direction.split("|") : [];
  const isOneTime = type === "one-time";

  const { data, isLoading, error, refetch } = useFetch(
    (signal) =>
      getManageTravels(
        {
          type,
          page,
          limit: LIMIT,
          ...(status ? { status } : {}),
          ...(origin ? { origin } : {}),
          ...(destination ? { destination } : {}),
        },
        signal
      ),
    [type, direction, status, page]
  );

  const { data: directions } = useFetch(
    (signal) => getManageTravelDirections(type, signal),
    [type]
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const changeTab = (next: TravelType) => {
    setType(next);
    setDirection(""); // direction তালিকা tab অনুযায়ী আলাদা
    setPage(1);
  };

  const handleChangeStatus = async (id: string, next: TravelStatus) => {
    if (!window.confirm(`Mark this travel as "${capitalize(next)}"?`)) return;
    setBusy(true);
    setActionError(null);
    try {
      await updateManageTravelStatus(id, next);
      refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setBusy(false);
    }
  };

  const from = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;
  const hasPrev = !!meta && meta.page > 1;
  const hasNext = !!meta && meta.page < meta.totalPages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-(--heading-text) sm:text-3xl">
          Recurring Travel Management
        </h1>
        <p className="text-sm text-(--paragraph-text)">
          Monitor and coordinate recurring member travel preferences to
          identify demand patterns and optimize shared charter opportunities.
        </p>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1 rounded-full bg-blue-50 p-1 dark:bg-blue-500/10">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => changeTab(tab.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  type === tab.value
                    ? "bg-primary text-white shadow"
                    : "text-(--paragraph-text) hover:text-(--heading-text)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-(--paragraph-text)" />
          <span className="text-sm text-(--paragraph-text)">Filter:</span>
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All Direction</option>
            {(directions ?? []).map((d) => (
              <option
                key={`${d.origin}|${d.destination}`}
                value={`${d.origin}|${d.destination}`}
              >
                {formatTravelRoute(d.origin, d.destination)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "" | TravelStatus);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All Status</option>
            {TRAVEL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {capitalize(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(error || actionError) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
          {error ?? actionError}
        </p>
      )}

      {/* Table (md+) */}
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--paragraph-text)">
              <th className="px-3 py-3">Route</th>
              <th className="px-3 py-3">
                {isOneTime ? "Date" : "Day Of Week"}
              </th>
              <th className="px-3 py-3">Preferred Time</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-60" : ""}>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-(--border-color) text-(--heading-text)"
              >
                <td className="px-3 py-4">
                  <RoutePill
                    route={formatTravelRoute(item.origin, item.destination)}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  {isOneTime
                    ? formatMediumDate(item.date)
                    : capitalize(item.dayOfWeek)}
                </td>
                <td className="px-3 py-4">{capitalize(item.preferredTime)}</td>
                <td className="px-3 py-4">
                  <TravelStatusBadge status={item.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  <TravelRowActions
                    travel={item}
                    disabled={busy}
                    onViewDetails={setDetailsId}
                    onChangeStatus={handleChangeStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className={`space-y-3 md:hidden ${isLoading ? "opacity-60" : ""}`}>
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-(--border-color) p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <RoutePill
                  route={formatTravelRoute(item.origin, item.destination)}
                />
                <div>
                  <TravelStatusBadge status={item.status} />
                </div>
              </div>
              <TravelRowActions
                travel={item}
                disabled={busy}
                onViewDetails={setDetailsId}
                onChangeStatus={handleChangeStatus}
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-(--paragraph-text)">
                  {isOneTime ? "Date" : "Day Of Week"}
                </dt>
                <dd className="font-medium text-(--heading-text)">
                  {isOneTime
                    ? formatMediumDate(item.date)
                    : capitalize(item.dayOfWeek)}
                </dd>
              </div>
              <div>
                <dt className="text-(--paragraph-text)">Preferred Time</dt>
                <dd className="font-medium text-(--heading-text)">
                  {capitalize(item.preferredTime)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {isLoading && !data && (
        <p className="py-12 text-center text-sm text-(--paragraph-text)">
          Loading...
        </p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="py-12 text-center text-sm text-(--paragraph-text)">
          No travel preferences found.
        </p>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-primary">
            Showing {from} to {to} of {meta.total} results
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!hasPrev || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!hasNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
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

export default TravelManagementPage;