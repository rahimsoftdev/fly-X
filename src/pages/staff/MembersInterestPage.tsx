import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";

import { useFetch } from "@/hooks/useFetch";
import {
  deleteCustomTravel,
  getAllCustomTravels,
  updateCustomTravelStatus,
} from "@/services/custom-travel.service";
import type {
  CustomTravelRequest,
  TravelStatus,
  // CustomTravelStatus,
} from "@/types/custom-travel.types";

import StatusBadge from "@/components/staff/StatusBadge";
import DirectionBadge from "@/components/staff/DirectionBadge";
import RowActionMenu from "@/components/staff/RowActionMenu";
import ConfirmModal from "@/components/staff/ConfirmModal";
import type { CustomTravelStatus } from "@/types/custom-travel.type";

const PAGE_SIZE = 10;

type StatusFilter = "all" | CustomTravelStatus;
type ToastState = { type: "success" | "error"; message: string } | null;

/* ==================== Helpers ==================== */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA"); // YYYY-MM-DD

const getMemberName = (item: CustomTravelRequest) => {
  if (item.member?.name) return item.member.name;
  const p = item.passengers[0];
  return p ? `${p.firstName} ${p.lastName}` : "—";
};

const getMemberEmail = (item: CustomTravelRequest) =>
  item.member?.email ?? item.passengers[0]?.email ?? "—";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const tripLabel = (type: CustomTravelRequest["type"]) =>
  type === "one-way" ? "One Way" : "Round Trip";

/* ==================== Small UI pieces ==================== */

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Skeleton = ({ className = "", style }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded-md bg-(--border-color)/70 ${className}`}
    style={style}
  />
);

const Avatar = ({ name }: { name: string }) => (
  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
    {getInitials(name)}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="min-w-0">
    <p className="text-[11px] text-(--paragraph-text)">{label}</p>
    <div className="mt-0.5 text-xs font-medium text-(--foreground)">
      {children}
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
  tone,
  className = "",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
  className?: string;
}) => (
  <div
    className={`flex min-w-0 items-center gap-3 rounded-xl border border-(--border-color) bg-(--background) p-3 shadow-sm sm:p-4 ${className}`}
  >
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-(--paragraph-text) sm:text-xs">{label}</p>
      <p className="text-lg font-bold leading-tight text-(--heading-text) sm:text-xl">
        {value}
      </p>
    </div>
  </div>
);

const Toast = ({ toast }: { toast: ToastState }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-60 flex justify-center px-4">
      <div
        className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${isSuccess ? "bg-green-600" : "bg-red-600"
          }`}
      >
        {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        {toast.message}
      </div>
    </div>
  );
};

/* ---------- Skeletons ---------- */

const StatsSkeleton = () => (
  <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`flex items-center gap-3 rounded-xl border border-(--border-color) bg-(--background) p-3 sm:p-4 ${
          i === 0 ? "col-span-2 sm:col-span-1" : ""
        }`}
      >
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-5 w-8" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="hidden overflow-hidden rounded-xl border border-(--border-color) bg-(--background) xl:block">
    <div className="flex gap-4 border-b border-(--border-color) px-4 py-3">
      {[28, 20, 18, 12, 10, 10, 6].map((w, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${w}%` }} />
      ))}
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 border-b border-(--border-color) px-4 py-4 last:border-b-0"
      >
        <div className="flex w-[28%] items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="h-3 w-[20%]" />
        <Skeleton className="h-6 w-[18%] rounded-full" />
        <Skeleton className="h-3 w-[12%]" />
        <Skeleton className="h-3 w-[10%]" />
        <Skeleton className="h-5 w-[10%]" />
        <Skeleton className="h-5 w-[6%]" />
      </div>
    ))}
  </div>
);

const CardsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl border border-(--border-color) bg-(--background) p-4"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-(--border-color) pt-3">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
        <Skeleton className="mt-4 h-9 w-full rounded-lg" />
      </div>
    ))}
  </div>
);

/* ==================== Page ==================== */

const MembersInterestPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => getAllCustomTravels(signal),
    []
  );

  // Optimistic UI এর জন্য local state (পুরো লিস্ট আর refetch করতে হয় না)
  const [overrides, setOverrides] = useState<Record<string, TravelStatus>>({});
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const [toast, setToast] = useState<ToastState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomTravelRequest | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  /* ---------- Filter / page এখন URL query params থেকে ---------- */
  // ?direction=NYC → DAC&status=confirmed&page=2
  const direction = searchParams.get("direction") ?? "all";

  const rawStatus = searchParams.get("status");
  const statusFilter: StatusFilter =
    rawStatus === "interested" || rawStatus === "confirmed"
      ? rawStatus
      : "all";

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

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // Toast ২.৫ সেকেন্ড পরে নিজে থেকে চলে যাবে
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // শুধু একদম প্রথমবার লোডে skeleton, পরে আর না
  const showSkeleton = isLoading && data === null;

  const items = (data ?? [])
    .filter((i) => !removedIds.includes(i._id))
    .map((i) => (overrides[i._id] ? { ...i, status: overrides[i._id] } : i));

  const counts = {
    total: items.length,
    interested: items.filter((i) => i.status === "interested").length,
    confirmed: items.filter((i) => i.status === "confirmed").length,
  };

  const directionOptions = Array.from(
    new Set(items.map((i) => `${i.origin} → ${i.destination}`))
  );

  const filtered = items.filter((i) => {
    const dirOk =
      direction === "all" || `${i.origin} → ${i.destination}` === direction;
    const statusOk = statusFilter === "all" || i.status === statusFilter;
    return dirOk && statusOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const goToDetails = (id: string) => navigate(`/staff/members-interest/${id}`);

  /* ---------- Status change (optimistic) ---------- */
  const handleStatusChange = async (id: string, status: TravelStatus) => {
    const previous = items.find((i) => i._id === id)?.status;
    if (!previous || previous === status) return;

    // ১) সাথে সাথে UI বদলে দাও
    setOverrides((o) => ({ ...o, [id]: status }));
    setPendingIds((p) => [...p, id]);

    try {
      await updateCustomTravelStatus(id, status);
      setToast({
        type: "success",
        message: `Status "${status}" করা হয়েছে`,
      });
    } catch (err) {
      // ২) fail করলে আগের অবস্থায় ফিরিয়ে দাও
      setOverrides((o) => ({ ...o, [id]: previous }));
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Status update failed",
      });
    } finally {
      setPendingIds((p) => p.filter((x) => x !== id));
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomTravel(deleteTarget._id);
      setRemovedIds((r) => [...r, deleteTarget._id]);
      setToast({ type: "success", message: "Request delete হয়েছে" });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Delete failed",
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const chips: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.total },
    { key: "interested", label: "Interested", count: counts.interested },
    { key: "confirmed", label: "Confirmed", count: counts.confirmed },
  ];

  return (
    <div className="mx-auto w-full  ">
      {/* ---------- Header ---------- */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold text-(--heading-text) sm:text-2xl">
            Member Interest List
          </h1>
          <p className="mt-0.5 text-xs text-(--paragraph-text)">
            Manage member preferences and bookings
          </p>
        </div>

        <div className="flex w-full items-center gap-2 text-sm text-(--paragraph-text) sm:w-auto">
          <Filter size={16} className="shrink-0" />
          <span>Filter:</span>
          <select
            value={direction}
            onChange={(e) =>
              updateParams({
                direction: e.target.value === "all" ? null : e.target.value,
                page: null,
              })
            }
            className="min-w-0 cursor-pointer flex-1 rounded-lg border border-(--border-color) bg-(--background) px-3 py-1.5 text-xs text-(--foreground) outline-none focus:border-primary sm:flex-none"
          >
            <option value="all">All Direction</option>
            {directionOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Summary cards ---------- */}
      {showSkeleton ? (
        <StatsSkeleton />
      ) : (
        !error && (
          // মোবাইলে Total উপরে full width, নিচে Interested ও Confirmed পাশাপাশি; sm থেকে ৩টা এক সারিতে
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard
              className="col-span-2 sm:col-span-1"
              label="Total"
              value={counts.total}
              icon={<Users size={18} className="text-primary" />}
              tone="bg-primary/10"
            />
            <StatCard
              label="Interested"
              value={counts.interested}
              icon={<Clock size={18} className="text-gray-600" />}
              tone="bg-gray-500/10"
            />
            <StatCard
              label="Confirmed"
              value={counts.confirmed}
              icon={<CheckCircle2 size={18} className="text-green-600" />}
              tone="bg-green-500/10"
            />
          </div>
        )
      )}

      {/* ---------- Status chips ---------- */}
      {!showSkeleton && !error && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => {
            const active = statusFilter === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() =>
                  updateParams({
                    status: c.key === "all" ? null : c.key,
                    page: null,
                  })
                }
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${active
                    ? "border-primary bg-primary text-white"
                    : "border-(--border-color) bg-(--background) text-(--paragraph-text) hover:border-primary hover:text-primary"
                  }`}
              >
                {c.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${active ? "bg-white/25" : "bg-(--card)"
                    }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ---------- Loading skeleton ---------- */}
      {showSkeleton && (
        <>
          <TableSkeleton />
          <CardsSkeleton />
        </>
      )}

      {/* ---------- Error ---------- */}
      {!showSkeleton && error && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-(--border-color) bg-(--background) px-4 py-14 text-center">
          <AlertCircle size={36} className="text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:opacity-90"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      )}

      {/* ---------- Empty ---------- */}
      {!showSkeleton && !error && pageItems.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-(--border-color) bg-(--background) px-4 py-14 text-center">
          <Inbox size={36} className="text-(--paragraph-text)" />
          <p className="text-sm font-medium text-(--heading-text)">
            কোনো member interest পাওয়া যায়নি
          </p>
          <p className="text-xs text-(--paragraph-text)">
            Filter বদলে আবার চেষ্টা করুন
          </p>
        </div>
      )}

      {/* ---------- Data ---------- */}
      {!showSkeleton && !error && pageItems.length > 0 && (
        <>
          {/* ===== Laptop / Desktop: Table ===== */}
          <div className="hidden rounded-xl border border-(--border-color) bg-(--background) shadow-sm xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-(--border-color) bg-(--card) text-xs text-(--paragraph-text)">
                    <th className="rounded-tl-xl px-4 py-3 font-medium">
                      Member
                    </th>
                    <th className="px-4 py-3 font-medium">Preferred Departure</th>
                    <th className="px-4 py-3 font-medium">Direction</th>
                    <th className="px-4 py-3 font-medium">Trip Type</th>
                    <th className="px-4 py-3 font-medium">Passenger</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="rounded-tr-xl px-4 py-3 text-center font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.map((item) => {
                    const pending = pendingIds.includes(item._id);
                    const name = getMemberName(item);
                    return (
                      <tr
                        key={item._id}
                        className={`border-b border-(--border-color) transition-all last:border-b-0 hover:bg-(--card)/60 ${pending ? "opacity-60" : ""
                          }`}
                      >
                        <td className="max-w-64 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={name} />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-(--foreground)">
                                {name}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-(--paragraph-text)">
                                {getMemberEmail(item)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-(--foreground)">
                          {formatDate(item.preferredDeparture)}
                        </td>
                        <td className="px-4 py-4">
                          <DirectionBadge
                            origin={item.origin}
                            destination={item.destination}
                          />
                        </td>
                        <td className="px-4 py-4 text-xs text-(--foreground)">
                          {tripLabel(item.type)}
                        </td>
                        <td className="px-4 py-4 text-xs text-(--foreground)">
                          {item.passengers.length}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <RowActionMenu
                            status={item.status}
                            onView={() => goToDetails(item._id)}
                            onChangeStatus={(s) =>
                              handleStatusChange(item._id, s)
                            }
                            onDelete={() => setDeleteTarget(item)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== Mobile / Tablet: Cards ===== */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:hidden">
            {pageItems.map((item) => {
              const pending = pendingIds.includes(item._id);
              const name = getMemberName(item);
              return (
                <div
                  key={item._id}
                  className={`rounded-xl border border-(--border-color) bg-(--background) p-4 shadow-sm transition-all ${pending ? "opacity-60" : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-(--heading-text)">
                          {name}
                        </p>
                        <p className="truncate text-xs text-(--paragraph-text)">
                          {getMemberEmail(item)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <RowActionMenu
                        status={item.status}
                        onView={() => goToDetails(item._id)}
                        onChangeStatus={(s) => handleStatusChange(item._id, s)}
                        onDelete={() => setDeleteTarget(item)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <DirectionBadge
                      origin={item.origin}
                      destination={item.destination}
                    />
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-(--border-color) pt-3">
                    <Field label="Departure">
                      {formatDate(item.preferredDeparture)}
                    </Field>
                    <Field label="Trip Type">{tripLabel(item.type)}</Field>
                    <Field label="Passenger">{item.passengers.length}</Field>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToDetails(item._id)}
                    className="mt-4 w-full rounded-lg border border-primary py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* ===== Pagination ===== */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-(--border-color) bg-(--background) px-4 py-3 text-xs shadow-sm sm:flex-row">
            <p className="text-center text-primary sm:text-left">
              {`Showing ${startIndex + 1} to ${startIndex + pageItems.length} of ${filtered.length} results`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-md border border-primary px-4 py-1.5 text-primary transition-colors hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-1 text-(--paragraph-text)">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-md border border-primary px-4 py-1.5 text-primary transition-colors hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* ---------- Delete modal ---------- */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this request?"
        message={
          deleteTarget
            ? `${getMemberName(deleteTarget)} এর এই travel request টি permanently delete হয়ে যাবে। এটা আর ফেরত আনা যাবে না।`
            : ""
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ---------- Toast ---------- */}
      <Toast toast={toast} />
    </div>
  );
};

export default MembersInterestPage;