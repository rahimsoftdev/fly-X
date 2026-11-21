import { useState } from "react";
import { Link } from "react-router";
import { Filter, Plus } from "lucide-react";
// import OpportunityRowActions from "@/components/opportunities/OpportunityRowActions";
// import OpportunityStatusBadge from "@/components/opportunities/OpportunityStatusBadge";
import { useFetch } from "@/hooks/useFetch";
import {
  getManageOpportunities,
  getOpportunityDirections,
  updateOpportunityStatus,
} from "@/services/opportunity-manage.service";
import type { OpportunityStatus } from "@/types/opportunity.types";
import {
  formatIsoDate,
  formatRoute,
  OPPORTUNITIES_PATH,
  STATUS_LABELS,
} from "@/utils/opportunity.util";
import OpportunityStatusBadge from "@/components/Opprotunites/OpportunityStatusBadge";
import OpportunityRowActions from "@/components/Opprotunites/OpportunityRowActions";

const TABS: OpportunityStatus[] = ["open", "confirmed", "completed", "draft"];
const LIMIT = 10;

const OpportunitiesManagementPage = () => {
  const [status, setStatus] = useState<OpportunityStatus>("open");
  const [direction, setDirection] = useState(""); // "origin|destination"
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [origin, destination] = direction ? direction.split("|") : [];

  const { data, isLoading, error, refetch } = useFetch(
    (signal) =>
      getManageOpportunities(
        {
          page,
          limit: LIMIT,
          status,
          ...(origin ? { origin } : {}),
          ...(destination ? { destination } : {}),
        },
        signal
      ),
    [status, direction, page]
  );

  const { data: directions } = useFetch(
    (signal) => getOpportunityDirections(signal),
    []
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const changeTab = (next: OpportunityStatus) => {
    setStatus(next);
    setPage(1);
  };

  const handleChangeStatus = async (id: string, next: OpportunityStatus) => {
    if (!window.confirm(`Move this opportunity to "${STATUS_LABELS[next]}"?`)) {
      return;
    }
    setBusy(true);
    setActionError(null);
    try {
      await updateOpportunityStatus(id, next);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--heading-text) sm:text-3xl">
            Opportunities Management
          </h1>
          <p className="text-sm text-(--paragraph-text)">
            Manage All Opportunities
          </p>
        </div>

        <Link
          to={`${OPPORTUNITIES_PATH}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Create New Opportunities
        </Link>
      </div>

      {/* Tabs + Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1 rounded-xl bg-blue-50 p-1 dark:bg-blue-500/10">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => changeTab(tab)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  status === tab
                    ? "bg-primary text-white shadow"
                    : "text-(--paragraph-text) hover:text-(--heading-text)"
                }`}
              >
                {STATUS_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-(--paragraph-text)">
          <Filter size={16} />
          <span>Filter:</span>
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setPage(1);
            }}
            className="min-w-0 flex-1 rounded-lg border border-(--border-color) bg-(--background) px-3 py-2 text-sm text-(--heading-text) outline-none focus:border-primary lg:flex-none"
          >
            <option value="">All Direction</option>
            {(directions ?? []).map((d) => (
              <option
                key={`${d.origin}|${d.destination}`}
                value={`${d.origin}|${d.destination}`}
              >
                {formatRoute(d.origin, d.destination)}
              </option>
            ))}
          </select>
        </label>
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
              <th className="px-3 py-3">Trip Type</th>
              <th className="px-3 py-3">Preferred Departure</th>
              <th className="px-3 py-3">Total Seat</th>
              <th className="px-3 py-3">Total Booked</th>
              <th className="px-3 py-3">Available Seat</th>
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
                  <span className="inline-block whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white">
                    {formatRoute(item.origin, item.destination)}
                  </span>
                </td>
                <td className="px-3 py-4">
                  {item.type === "one-way" ? "One Way" : "Two Way"}
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  {formatIsoDate(item.preferredDeparture)}
                </td>
                <td className="px-3 py-4">{item.totalSeats}</td>
                <td className="px-3 py-4">{item.bookedSeats}</td>
                <td className="px-3 py-4">{item.availableSeats}</td>
                <td className="px-3 py-4">
                  <OpportunityStatusBadge status={item.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  <OpportunityRowActions
                    opportunity={item}
                    disabled={busy}
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
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white">
                  {formatRoute(item.origin, item.destination)}
                </span>
                <div>
                  <OpportunityStatusBadge status={item.status} />
                </div>
              </div>
              <OpportunityRowActions
                opportunity={item}
                disabled={busy}
                onChangeStatus={handleChangeStatus}
              />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-(--paragraph-text)">Trip Type</dt>
                <dd className="font-medium text-(--heading-text)">
                  {item.type === "one-way" ? "One Way" : "Two Way"}
                </dd>
              </div>
              <div>
                <dt className="text-(--paragraph-text)">Departure</dt>
                <dd className="font-medium text-(--heading-text)">
                  {formatIsoDate(item.preferredDeparture)}
                </dd>
              </div>
              <div>
                <dt className="text-(--paragraph-text)">Seats</dt>
                <dd className="font-medium text-(--heading-text)">
                  {item.bookedSeats}/{item.totalSeats} booked
                </dd>
              </div>
              <div>
                <dt className="text-(--paragraph-text)">Available</dt>
                <dd className="font-medium text-(--heading-text)">
                  {item.availableSeats}
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
          No {STATUS_LABELS[status].toLowerCase()} opportunities found.
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
              disabled={!meta.hasPrevPage || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!meta.hasNextPage || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesManagementPage;