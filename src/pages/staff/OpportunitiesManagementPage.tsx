import { useEffect, useState } from "react";
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

interface PendingChange {
  id: string;
  next: OpportunityStatus;
}

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-(--border-color) bg-(--background) p-5 shadow-xl sm:p-6"
      >
        <h3 className="text-base font-semibold text-(--heading-text) sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm text-(--paragraph-text)">{message}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-full border border-(--border-color) px-5 py-2 text-sm font-medium text-(--heading-text) transition hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesManagementPage = () => {
  const [status, setStatus] = useState<OpportunityStatus>("open");
  const [direction, setDirection] = useState(""); // "origin|destination"
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);

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

  // Action menu theke call hoy: shudhu confirmation modal khole
  const handleChangeStatus = (id: string, next: OpportunityStatus) => {
    setActionError(null);
    setPending({ id, next });
  };

  // Modal-er Confirm button e asol kaj hoy
  const confirmChange = async () => {
    if (!pending) return;
    setBusy(true);
    setActionError(null);
    try {
      await updateOpportunityStatus(pending.id, pending.next);
      setPending(null);
      refetch();
    } catch (err) {
      setPending(null);
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
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-(--heading-text) sm:text-2xl lg:text-3xl">
            Opportunities Management
          </h1>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            Manage All Opportunities
          </p>
        </div>

        <Link
          to={`${OPPORTUNITIES_PATH}/new`}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-6"
        >
          <Plus size={16} />
          Create New Opportunities
        </Link>
      </div>

      {/* Tabs + Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-blue-50 p-1 dark:bg-blue-500/10 sm:grid-cols-4 lg:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => changeTab(tab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-center text-sm font-medium transition sm:px-5 ${
                status === tab
                  ? "bg-primary text-white shadow"
                  : "text-(--paragraph-text) hover:text-(--heading-text)"
              }`}
            >
              {STATUS_LABELS[tab]}
            </button>
          ))}
        </div>

        <label className="flex w-full items-center gap-2 text-sm text-(--paragraph-text) lg:w-auto">
          <Filter size={16} className="shrink-0" />
          <span className="shrink-0">Filter:</span>
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setPage(1);
            }}
            className="min-w-0 flex-1 truncate rounded-lg border border-(--border-color) bg-(--background) px-3 py-2 text-sm text-(--heading-text) outline-none focus:border-primary lg:w-64 lg:flex-none"
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

      {/* Table (xl+) — overflow nei, tai scroll bar nei & dropdown kete jay na */}
      <div className="hidden rounded-xl border border-(--border-color) xl:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--paragraph-text)">
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Trip Type</th>
              <th className="px-4 py-3">Preferred Departure</th>
              <th className="px-4 py-3 text-center">Total Seat</th>
              <th className="px-4 py-3 text-center">Total Booked</th>
              <th className="px-4 py-3 text-center">Available Seat</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-60" : ""}>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-(--border-color) align-middle text-(--heading-text) last:border-b-0"
              >
                <td className="px-4 py-4">
                  <span className="inline-block whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white">
                    {formatRoute(item.origin, item.destination)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  {item.type === "one-way" ? "One Way" : "Two Way"}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  {formatIsoDate(item.preferredDeparture)}
                </td>
                <td className="px-4 py-4 text-center">{item.totalSeats}</td>
                <td className="px-4 py-4 text-center">{item.bookedSeats}</td>
                <td className="px-4 py-4 text-center">{item.availableSeats}</td>
                <td className="px-4 py-4">
                  <OpportunityStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end">
                    <OpportunityRowActions
                      opportunity={item}
                      disabled={busy}
                      onChangeStatus={handleChangeStatus}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile + tablet + small laptop) */}
      <div
        className={`grid gap-3 sm:grid-cols-2 sm:gap-4 xl:hidden ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-(--border-color) p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <span className="inline-block max-w-full break-words rounded-full bg-secondary px-3 py-1 text-xs font-medium leading-snug text-white">
                  {formatRoute(item.origin, item.destination)}
                </span>
                <div>
                  <OpportunityStatusBadge status={item.status} />
                </div>
              </div>
              <div className="shrink-0">
                <OpportunityRowActions
                  opportunity={item}
                  disabled={busy}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-(--border-color) pt-4 text-xs">
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Trip Type</dt>
                <dd className="mt-0.5 font-medium text-(--heading-text)">
                  {item.type === "one-way" ? "One Way" : "Two Way"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Departure</dt>
                <dd className="mt-0.5 font-medium text-(--heading-text)">
                  {formatIsoDate(item.preferredDeparture)}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Seats</dt>
                <dd className="mt-0.5 font-medium text-(--heading-text)">
                  {item.bookedSeats}/{item.totalSeats} booked
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Available</dt>
                <dd className="mt-0.5 font-medium text-(--heading-text)">
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
        <p className="px-4 py-12 text-center text-sm text-(--paragraph-text)">
          No {STATUS_LABELS[status].toLowerCase()} opportunities found.
        </p>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-primary sm:text-left">
            Showing {from} to {to} of {meta.total} results
          </p>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
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

      {/* Confirmation modal (window.confirm er poriborte) */}
      {pending && (
        <ConfirmModal
          title="Change status?"
          message={`Are you sure you want to move this opportunity to "${STATUS_LABELS[pending.next]}"?`}
          confirmLabel="Yes, move"
          loading={busy}
          onConfirm={confirmChange}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default OpportunitiesManagementPage;