import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CircleAlert, CircleCheck, LoaderCircle, X } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import type { Opportunity } from "@/types/opportunity.types";

export type CancelView = "confirm" | "submitting" | "success" | "error";

interface CancelReservationModalProps {
  opportunity: Opportunity;
  view: CancelView;
  errorMessage?: string | undefined;
  onConfirm: () => void;
  onClose: () => void;
}

const outlineBtn =
  "h-11 w-full cursor-pointer rounded-lg border border-(--border-color) bg-(--background) text-sm font-semibold text-(--foreground) transition hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-50";

const primaryBtn =
  "h-11 w-full cursor-pointer rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";

const CancelReservationModal = ({
  opportunity,
  view,
  errorMessage,
  onConfirm,
  onClose,
}: CancelReservationModalProps) => {
  const isBusy = view === "submitting";
  const { origin, destination, preferredDeparture } = opportunity;

  // বাইরের স্ক্রল বন্ধ (স্ক্রলবার সরলে লেআউট যেন না লাফায়)
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Esc চাপলে বন্ধ (রিকোয়েস্ট চলার সময় না)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isBusy, onClose]);

  const renderBody = () => {
    // ---------- সফল ----------
    if (view === "success") {
      return (
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
            <CircleCheck size={30} />
          </div>
          <h2
            id="cancel-modal-title"
            className="mt-4 text-lg font-semibold text-(--heading-text)"
          >
            Reservation cancelled
          </h2>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            Your reservation on {origin} → {destination} has been removed.
          </p>
          <button type="button" onClick={onClose} className={`${primaryBtn} mt-6`}>
            Done
          </button>
        </div>
      );
    }

    // ---------- এরর ----------
    if (view === "error") {
      return (
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <CircleAlert size={30} />
          </div>
          <h2
            id="cancel-modal-title"
            className="mt-4 text-lg font-semibold text-(--heading-text)"
          >
            Could not cancel
          </h2>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage ?? "Something went wrong"}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className={outlineBtn}>
              Close
            </button>
            <button type="button" onClick={onConfirm} className={primaryBtn}>
              Try again
            </button>
          </div>
        </div>
      );
    }

    // ---------- কনফার্ম (confirm + submitting) ----------
    return (
      <div>
        <h2
          id="cancel-modal-title"
          className="pr-8 text-lg font-semibold text-(--heading-text)"
        >
          Cancel reservation?
        </h2>
        <p className="mt-1 text-sm text-(--paragraph-text)">
          Your seat will be released and this reservation will be removed from
          your list.
        </p>

        <dl className="mt-4 divide-y divide-(--border-color) rounded-lg border border-(--border-color) bg-(--card) text-sm">
          <div className="flex justify-between gap-4 px-3 py-2.5">
            <dt className="text-(--paragraph-text)">Route</dt>
            <dd className="text-right font-medium text-(--heading-text)">
              {origin} → {destination}
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-3 py-2.5">
            <dt className="text-(--paragraph-text)">Departure</dt>
            <dd className="font-medium text-(--heading-text)">
              {formatDate(preferredDeparture)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={outlineBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className={`${primaryBtn} inline-flex items-center justify-center gap-2`}
          >
            {isBusy ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Removing...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* ঝাপসা ব্যাকড্রপ: বাইরে ক্লিক করলে বন্ধ */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => {
          if (!isBusy) onClose();
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-hidden rounded-2xl bg-(--background) p-5 shadow-2xl sm:p-6"
      >
        {!isBusy && view !== "success" && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-8 cursor-pointer items-center justify-center rounded-lg text-(--paragraph-text) transition hover:bg-(--card)"
          >
            <X size={18} />
          </button>
        )}
        {renderBody()}
      </div>
    </div>,
    document.body
  );
};

export default CancelReservationModal;