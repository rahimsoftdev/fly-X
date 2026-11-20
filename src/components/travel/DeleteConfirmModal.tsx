import { useEffect } from "react";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";
import type { ITravel } from "@/types/travel.type";
import { dayLabel, formatTravelDate, timeLabel } from "@/utils/travel.util";
import { errorTextClass } from "./fieldStyles";

interface Props {
  travel: ITravel | null; // null hole modal bondho
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  travel,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: Props) {
  const isOpen = travel !== null;

  // modal khola thakle pichoner page scroll bondho
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Esc chaple cancel
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!travel) return null;

  const detail =
    travel.type === "regular"
      ? dayLabel(travel.dayOfWeek)
      : formatTravelDate(travel.date);

  return (
    // backdrop: blur + dim, bahire click korle cancel
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60"
      onClick={() => !isDeleting && onCancel()}
    >
      {/* modal box: choto screen e max-h + vitorei scroll */}
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-(--border-color) bg-white p-5 shadow-xl sm:p-6 dark:bg-(--card)"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <Trash2 className="size-5 text-red-600 dark:text-red-400" />
        </div>

        <h3
          id="delete-modal-title"
          className="mt-4 text-lg font-semibold text-(--heading-text)"
        >
          Delete this preference?
        </h3>
        <p className="mt-1 text-sm text-(--paragraph-text)">
          This action can't be undone. You'll stop being matched for this trip.
        </p>

        <div className="mt-4 rounded-lg bg-primary/10 px-4 py-3">
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-(--heading-text)">
            {travel.origin}
            <ArrowRight className="size-3.5 text-(--paragraph-text)" />
            {travel.destination}
          </p>
          <p className="mt-1 text-xs text-(--paragraph-text)">
            {detail} · {timeLabel(travel.preferredTime)}
          </p>
        </div>

        {error && <p className={`mt-3 ${errorTextClass}`}>{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-(--border-color) px-4 py-2.5 text-sm font-medium text-(--heading-text) transition hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}