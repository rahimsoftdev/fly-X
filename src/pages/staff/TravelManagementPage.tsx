import { useEffect, useState } from "react";
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

// Table column width (%) — table-fixed, তাই horizontal scroll আসবে না
const COLS = [30, 20, 18, 16, 16];

const selectClass =
  "w-full min-w-0 truncate rounded-lg border border-(--border-color) bg-(--background) px-3 py-2 text-sm text-(--heading-text) outline-none focus:border-primary sm:w-auto sm:min-w-40 sm:max-w-64 sm:flex-none";

const RoutePill = ({ route }: { route: string }) => (
  <span
    title={route}
    className="inline-block max-w-full break-words rounded-full bg-secondary px-3 py-1.5 text-xs font-medium leading-snug text-white md:truncate"
  >
    {route}
  </span>
);

interface PendingChange {
  id: string;
  next: TravelStatus;
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
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="my-auto max-h-[90vh] w-full max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-(--border-color) bg-(--background) p-4 shadow-xl sm:max-w-sm sm:p-6"
      >
        <h3 className="break-words text-base font-semibold text-(--heading-text) sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 break-words text-sm text-(--paragraph-text)">
          {message}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:justify-end sm:gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-full border border-(--border-color) px-4 py-2 text-sm font-medium text-(--heading-text) transition hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const TravelManagementPage = () => {
  const [type, setType] = useState<TravelType>("regular");
  const [direction, setDirection] = useState(""); // "origin|destination"
  const [status, setStatus] = useState<"" | TravelStatus>("");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);

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

  // Action menu theke call hoy: shudhu confirmation modal khole
  const handleChangeStatus = (id: string, next: TravelStatus) => {
    setActionError(null);
    setPending({ id, next });
  };

  // Modal-er Confirm button e asol kaj hoy
  const confirmChange = async () => {
    if (!pending) return;
    setBusy(true);
    setActionError(null);
    try {
      await updateManageTravelStatus(pending.id, pending.next);
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
  const hasPrev = !!meta && meta.page > 1;
  const hasNext = !!meta && meta.page < meta.totalPages;

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="break-words text-lg font-bold leading-tight text-(--heading-text) min-[400px]:text-xl sm:text-2xl lg:text-3xl">
          Recurring Travel Management
        </h1>
        <p className="mt-1 text-xs text-(--paragraph-text) sm:text-sm">
          Monitor and coordinate recurring member travel preferences to
          identify demand patterns and optimize shared charter opportunities.
        </p>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Tabs: মোবাইলে পুরো width এ 2 কলাম, sm থেকে inline */}
        <div className="w-full sm:w-auto">
          <div className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-blue-50 p-1 sm:inline-flex sm:w-auto sm:rounded-full dark:bg-blue-500/10">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => changeTab(tab.value)}
                className={`rounded-xl px-2 py-2 text-center text-xs font-medium leading-tight transition min-[400px]:text-sm sm:rounded-full sm:whitespace-nowrap sm:px-4 ${
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

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:flex-nowrap">
          <div className="flex shrink-0 items-center gap-2">
            <Filter size={16} className="text-(--paragraph-text)" />
            <span className="text-sm text-(--paragraph-text)">Filter:</span>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[480px]:grid-cols-2 sm:flex sm:w-auto sm:flex-wrap">
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by direction"
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
              aria-label="Filter by status"
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
      </div>

      {(error || actionError) && (
        <p className="break-words rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600 sm:px-4 dark:bg-red-500/10">
          {error ?? actionError}
        </p>
      )}

      {/* Table (md+) */}
      <div className="hidden md:block">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            {COLS.map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--paragraph-text)">
              <th className="px-2 py-3 lg:px-3">Route</th>
              <th className="px-2 py-3 lg:px-3">
                {isOneTime ? "Date" : "Day Of Week"}
              </th>
              <th className="px-2 py-3 lg:px-3">Preferred Time</th>
              <th className="px-2 py-3 lg:px-3">Status</th>
              <th className="px-2 py-3 text-right lg:px-3">Action</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-60" : ""}>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-(--border-color) text-(--heading-text)"
              >
                <td className="px-2 py-4 lg:px-3">
                  <RoutePill
                    route={formatTravelRoute(item.origin, item.destination)}
                  />
                </td>
                <td className="break-words px-2 py-4 lg:px-3">
                  {isOneTime
                    ? formatMediumDate(item.date)
                    : capitalize(item.dayOfWeek)}
                </td>
                <td className="break-words px-2 py-4 lg:px-3">
                  {capitalize(item.preferredTime)}
                </td>
                <td className="px-2 py-4 lg:px-3">
                  <TravelStatusBadge status={item.status} />
                </td>
                <td className="px-2 py-2 text-right lg:px-3">
                  {/* text-left: td এর text-right যেন dropdown menu এর ভেতরে না যায় */}
                  <div className="flex justify-end text-left">
                    <TravelRowActions
                      travel={item}
                      disabled={busy}
                      onViewDetails={setDetailsId}
                      onChangeStatus={handleChangeStatus}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div
        className={`grid gap-3 sm:grid-cols-2 sm:gap-4 md:hidden ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {items.map((item) => (
          <div
            key={item._id}
            className="min-w-0 rounded-xl border border-(--border-color) p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <RoutePill
                  route={formatTravelRoute(item.origin, item.destination)}
                />
                <div>
                  <TravelStatusBadge status={item.status} />
                </div>
              </div>
              <div className="shrink-0 text-left">
                <TravelRowActions
                  travel={item}
                  disabled={busy}
                  onViewDetails={setDetailsId}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">
                  {isOneTime ? "Date" : "Day Of Week"}
                </dt>
                <dd className="break-words font-medium text-(--heading-text)">
                  {isOneTime
                    ? formatMediumDate(item.date)
                    : capitalize(item.dayOfWeek)}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Preferred Time</dt>
                <dd className="break-words font-medium text-(--heading-text)">
                  {capitalize(item.preferredTime)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {isLoading && !data && (
        <p className="py-10 text-center text-sm text-(--paragraph-text) sm:py-12">
          Loading...
        </p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="py-10 text-center text-sm text-(--paragraph-text) sm:py-12">
          No travel preferences found.
        </p>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-primary sm:text-left sm:text-sm">
            Showing {from} to {to} of {meta.total} results
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button
              type="button"
              disabled={!hasPrev || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="flex-1 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!hasNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5"
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

      {/* Confirmation modal (window.confirm er poriborte) */}
      {pending && (
        <ConfirmModal
          title="Change status?"
          message={`Are you sure you want to mark this travel as "${capitalize(pending.next)}"?`}
          confirmLabel="Yes, confirm"
          loading={busy}
          onConfirm={confirmChange}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default TravelManagementPage;