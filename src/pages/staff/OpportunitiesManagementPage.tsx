import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Filter, PackageOpen, Plus, X } from "lucide-react";
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

// Table column width (%) — table-fixed ব্যবহার করা হয়েছে, তাই কখনো horizontal scroll আসবে না
const COLS = [26, 10, 14, 8, 9, 9, 14, 10];

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

/* ==================== Small UI pieces ==================== */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-(--border-color)/70 ${className}`}
  />
);

const ColGroup = () => (
  <colgroup>
    {COLS.map((w, i) => (
      <col key={i} style={{ width: `${w}%` }} />
    ))}
  </colgroup>
);

const TypeLabel = ({ type }: { type: string }) => (
  <>{type === "one-way" ? "One Way" : "Two Way"}</>
);

const SeatBar = ({ booked, total }: { booked: number; total: number }) => {
  const percent =
    total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-(--border-color)/70"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Seats booked"
    >
      <div
        className={`h-full rounded-full transition-all ${
          percent >= 100 ? "bg-red-500" : "bg-primary"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

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

/* ==================== Page ==================== */

const OpportunitiesManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);

  /* ---------- Tab / filter / page এখন URL query params থেকে ----------
     ?status=confirmed&direction=Dhaka|Chattogram&page=2 */
  const rawStatus = searchParams.get("status");
  const status: OpportunityStatus = TABS.includes(rawStatus as OpportunityStatus)
    ? (rawStatus as OpportunityStatus)
    : "open";

  const direction = searchParams.get("direction") ?? ""; // "origin|destination"

  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);

  // null দিলে ওই param URL থেকে মুছে যায় (default মান URL এ রাখা হয় না)
  const updateParams = (updates: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null) next.delete(key);
          else next.set(key, value);
        });
        return next;
      },
      { replace: true }
    );
  };

  const changeTab = (next: OpportunityStatus) =>
    updateParams({ status: next === "open" ? null : next, page: null });

  const changeDirection = (value: string) =>
    updateParams({ direction: value || null, page: null });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

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

  // Direction এর তালিকা backend থেকে আসে, তাই dropdown সম্পূর্ণ dynamic
  const {
    data: directions,
    isLoading: directionsLoading,
    error: directionsError,
  } = useFetch((signal) => getOpportunityDirections(signal), []);

  const items = data?.items ?? [];
  const meta = data?.meta;

  // Dropdown option: backend এর directions + এখন যে লিস্ট দেখাচ্ছে সেখান থেকেও
  // (API খালি/fail করলেও dropdown এ অন্তত বর্তমান direction গুলো আসবে)
  const directionOptions = (() => {
    const map = new Map<string, { origin: string; destination: string }>();
    (directions ?? []).forEach((d) =>
      map.set(`${d.origin}|${d.destination}`, d)
    );
    items.forEach((i) => {
      const key = `${i.origin}|${i.destination}`;
      if (!map.has(key)) {
        map.set(key, { origin: i.origin, destination: i.destination });
      }
    });
    // select করা direction (যেমন URL থেকে এলে) যেন option থেকে হারিয়ে না যায়
    if (direction && !map.has(direction)) {
      const [o, d] = direction.split("|");
      map.set(direction, { origin: o, destination: d });
    }
    return Array.from(map.entries());
  })();

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
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;

  // শুধু প্রথমবার লোডে skeleton, পরে শুধু opacity কমবে
  const showSkeleton = isLoading && !data;

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-lg font-bold leading-tight text-(--heading-text) min-[400px]:text-xl sm:text-2xl lg:text-3xl">
            Opportunities Management
          </h1>
          <p className="mt-1 text-xs text-(--paragraph-text) sm:text-sm">
            Manage All Opportunities
          </p>
        </div>

        <Link
          to={`${OPPORTUNITIES_PATH}/new`}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold leading-tight text-white transition hover:opacity-90 sm:w-auto sm:whitespace-nowrap sm:px-6"
        >
          <Plus size={16} className="shrink-0" />
          Create New Opportunities
        </Link>
      </div>

      {/* ---------- Tabs + Filter ---------- */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Tabs: মোবাইলে 2x2, sm থেকে এক সারিতে ৪টা */}
        <div
          role="tablist"
          aria-label="Opportunity status"
          className="grid w-full grid-cols-2 gap-1 rounded-xl bg-blue-50 p-1 sm:flex lg:w-auto dark:bg-blue-500/10"
        >
          {TABS.map((tab) => {
            const active = status === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeTab(tab)}
                className={`rounded-lg px-2 py-2.5 text-center text-xs font-medium leading-tight outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60 min-[400px]:text-sm sm:flex-1 sm:whitespace-nowrap sm:px-4 lg:flex-auto lg:px-6 ${
                  active
                    ? "bg-primary text-white shadow"
                    : "text-(--paragraph-text) hover:bg-white/70 hover:text-(--heading-text) dark:hover:bg-white/10"
                }`}
              >
                {STATUS_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* Direction filter */}
        <div className="flex w-full min-w-0 items-center gap-2 text-sm text-(--paragraph-text) lg:w-auto">
          <Filter size={16} className="shrink-0" />
          <span className="shrink-0">Filter:</span>
          <select
            value={direction}
            disabled={directionsLoading}
            onChange={(e) => changeDirection(e.target.value)}
            aria-label="Filter by direction"
            className="min-w-0 flex-1 cursor-pointer truncate rounded-lg border border-(--border-color) bg-(--background) px-2.5 py-2 text-sm text-(--heading-text) outline-none focus:border-primary disabled:cursor-wait disabled:opacity-60 sm:px-3 lg:w-64 lg:flex-none"
          >
            <option value="">
              {directionsLoading ? "Loading directions..." : "All Direction"}
            </option>
            {directionOptions.map(([key, d]) => (
              <option key={key} value={key}>
                {formatRoute(d.origin, d.destination)}
              </option>
            ))}
          </select>

          {direction && (
            <button
              type="button"
              onClick={() => changeDirection("")}
              aria-label="Clear direction filter"
              title="Clear filter"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-(--border-color) text-(--paragraph-text) transition hover:border-primary hover:text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* {directionsError && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:bg-amber-500/10">
          Directions load hoyni: {directionsError}
        </p>
      )} */}

      {(error || actionError) && (
        <p className="break-words rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600 sm:px-4 dark:bg-red-500/10">
          {error ?? actionError}
        </p>
      )}

      {/* ---------- Loading skeleton (প্রথমবার) ---------- */}
      {showSkeleton && (
        <div role="status" aria-live="polite">
          {/* Table skeleton (xl+) */}
          <div className="hidden rounded-xl border border-(--border-color) xl:block">
            <table className="w-full table-fixed text-left text-sm">
              <ColGroup />
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-(--border-color) last:border-b-0"
                  >
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="h-6 w-4/5 rounded-full" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="h-3 w-4/5" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="h-3 w-4/5" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="mx-auto h-3 w-6" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="mx-auto h-3 w-6" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="mx-auto h-3 w-6" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="h-6 w-4/5 rounded-full" />
                    </td>
                    <td className="px-3 py-4 2xl:px-4">
                      <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card skeleton (xl এর নিচে) */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-0 rounded-xl border border-(--border-color) p-3 sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-6 w-40 max-w-full rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="size-8 shrink-0 rounded-lg" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-(--border-color) pt-4">
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>
              </div>
            ))}
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      )}

      {/* ---------- Table (xl+) ----------
          table-fixed + overflow নেই => scroll bar আসবে না, dropdown ও কাটা যাবে না */}
      {!showSkeleton && items.length > 0 && (
        <div className="hidden rounded-xl border border-(--border-color) xl:block">
          <table className="w-full table-fixed text-left text-sm">
            <ColGroup />
            <thead>
              <tr className="bg-(--card) text-xs font-semibold text-(--paragraph-text)">
                <th className="rounded-tl-xl px-3 py-3.5 2xl:px-4">Route</th>
                <th className="px-3 py-3.5 2xl:px-4">Trip Type</th>
                <th className="px-3 py-3.5 2xl:px-4">Preferred Departure</th>
                <th className="px-3 py-3.5 text-center 2xl:px-4">Total Seat</th>
                <th className="px-3 py-3.5 text-center 2xl:px-4">
                  Total Booked
                </th>
                <th className="px-3 py-3.5 text-center 2xl:px-4">
                  Available Seat
                </th>
                <th className="px-3 py-3.5 2xl:px-4">Status</th>
                <th className="rounded-tr-xl px-3 py-3.5 text-right 2xl:px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={isLoading ? "opacity-60 transition-opacity" : ""}>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-(--border-color) align-middle text-(--heading-text) transition-colors hover:bg-(--card)/60 [&:last-child>td:first-child]:rounded-bl-xl [&:last-child>td:last-child]:rounded-br-xl"
                >
                  <td className="px-3 py-4 2xl:px-4">
                    <span
                      title={formatRoute(item.origin, item.destination)}
                      className="inline-block max-w-full truncate rounded-full bg-secondary px-3 py-1 align-middle text-xs font-medium text-white"
                    >
                      {formatRoute(item.origin, item.destination)}
                    </span>
                  </td>
                  <td className="px-3 py-4 2xl:px-4">
                    <TypeLabel type={item.type} />
                  </td>
                  <td className="px-3 py-4 2xl:px-4">
                    {formatIsoDate(item.preferredDeparture)}
                  </td>
                  <td className="px-3 py-4 text-center font-medium 2xl:px-4">
                    {item.totalSeats}
                  </td>
                  <td className="px-3 py-4 text-center font-medium 2xl:px-4">
                    {item.bookedSeats}
                  </td>
                  <td className="px-3 py-4 text-center font-medium 2xl:px-4">
                    {item.availableSeats}
                  </td>
                  <td className="px-3 py-4 2xl:px-4">
                    <OpportunityStatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2 text-right 2xl:px-4">
                    {/* text-left: td এর text-right যেন dropdown menu এর ভেতরে না যায় */}
                    <div className="flex justify-end text-left">
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
      )}

      {/* ---------- Cards (mobile + tablet + small laptop) ---------- */}
      {!showSkeleton && items.length > 0 && (
        <div
          className={`grid gap-3 transition-opacity sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:hidden ${
            isLoading ? "opacity-60" : ""
          }`}
        >
          {items.map((item) => (
            <div
              key={item._id}
              className="min-w-0 rounded-xl border border-(--border-color) p-3 transition-shadow hover:shadow-sm sm:p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <span className="inline-block max-w-full break-words rounded-full bg-secondary px-3 py-1 text-xs font-medium leading-snug text-white">
                    {formatRoute(item.origin, item.destination)}
                  </span>
                  <div>
                    <OpportunityStatusBadge status={item.status} />
                  </div>
                </div>
                <div className="shrink-0 text-left">
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
                  <dd className="mt-0.5 break-words font-medium text-(--heading-text)">
                    <TypeLabel type={item.type} />
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-(--paragraph-text)">Departure</dt>
                  <dd className="mt-0.5 break-words font-medium text-(--heading-text)">
                    {formatIsoDate(item.preferredDeparture)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-(--paragraph-text)">Seats</dt>
                  <dd className="mt-0.5 break-words font-medium text-(--heading-text)">
                    {item.bookedSeats}/{item.totalSeats} booked
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-(--paragraph-text)">Available</dt>
                  <dd className="mt-0.5 break-words font-medium text-(--heading-text)">
                    {item.availableSeats}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <SeatBar booked={item.bookedSeats} total={item.totalSeats} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Empty ---------- */}
      {!isLoading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-(--border-color) px-4 py-10 text-center sm:py-14">
          <PackageOpen size={36} className="text-(--paragraph-text)" />
          <p className="break-words text-sm font-medium text-(--heading-text)">
            No {STATUS_LABELS[status].toLowerCase()} opportunities found.
          </p>
          {direction && (
            <button
              type="button"
              onClick={() => changeDirection("")}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              Clear direction filter
            </button>
          )}
        </div>
      )}

      {/* ---------- Pagination ---------- */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-primary sm:text-left sm:text-sm">
            Showing {from} to {to} of {meta.total} results
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              disabled={!meta.hasPrevPage || isLoading}
              onClick={() => setPage(page - 1)}
              className="flex-1 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5 dark:hover:bg-blue-500/10"
            >
              Previous
            </button>
            <span className="shrink-0 px-1 text-xs text-(--paragraph-text)">
              {meta.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={!meta.hasNextPage || isLoading}
              onClick={() => setPage(page + 1)}
              className="flex-1 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5 dark:hover:bg-blue-500/10"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ---------- Confirmation modal ---------- */}
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