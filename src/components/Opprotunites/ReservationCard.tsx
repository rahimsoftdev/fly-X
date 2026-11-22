import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, Clock, DollarSign, Eye, Plane, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cancelReservation } from "@/services/opportunity.service";
import { formatDate } from "@/utils/formatDate";
import { getTimeOfDay } from "@/utils/opportunity";
import type { Opportunity } from "@/types/opportunity.types";
import CancelReservationModal, {
  type CancelView,
} from "./CancelReservationModal";

export type ReservationVariant = "pending" | "confirmed";

interface ReservationCardProps {
  reservation: Opportunity;
  variant: ReservationVariant;
  onCancelled?: (() => void) | undefined; // মোডাল বন্ধ হলে লিস্ট রিফ্রেশ করতে
  onViewDetails?: ((id: string) => void) | undefined;
}


type Phase = "idle" | "submitting" | "success" | "error";

/* ডিটেইলস মোডাল: খোলা থাকলে পেছনের পেজ স্ক্রল হবে না, মোডালে স্ক্রলবার দেখাবে না */
interface DetailsModalProps {
  reservation: Opportunity;
  onClose: () => void;
}

const DetailsModal = ({ reservation, onClose }: DetailsModalProps) => {
  const {
    origin,
    destination,
    aircraftType,
    type,
    preferredDeparture,
    price,
  } = reservation;

  // পেছনের স্ক্রল বন্ধ + Escape দিয়ে বন্ধ
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const rows = [
    {
      label: "Departure Date",
      value: formatDate(preferredDeparture),
      icon: <Calendar size={16} />,
    },
    {
      label: "Time of Day",
      value: getTimeOfDay(preferredDeparture),
      icon: <Clock size={16} />,
    },
    {
      label: "Cost (per Member)",
      value: price.toLocaleString("en-US"),
      icon: <DollarSign size={16} />,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reservation details"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-(--background) p-4 shadow-xl [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-lg sm:rounded-2xl sm:p-6 [&::-webkit-scrollbar]:hidden"
      >
        {/* হেডার */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plane size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="wrap-break-word font-heading text-base font-semibold uppercase text-(--heading-text) sm:text-lg">
                {origin} → {destination}
              </h3>
              <p className="mt-0.5 text-xs text-(--paragraph-text) sm:text-sm">
                {aircraftType} · {type === "one-way" ? "One-way" : "Round trip"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-(--paragraph-text) transition hover:bg-(--card) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* স্ট্যাটাস */}
        <div className="mt-4">
          <Badge variant="success">Confirmed</Badge>
        </div>

        {/* তথ্য */}
        <dl className="mt-4 divide-y divide-(--border-color) rounded-lg border border-(--border-color)">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4"
            >
              <dt className="inline-flex items-center gap-2 text-xs text-(--paragraph-text) sm:text-sm">
                {row.icon}
                {row.label}
              </dt>
              <dd className="text-right text-sm font-medium text-(--heading-text)">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full cursor-pointer rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

const ReservationCard = ({
  reservation,
  variant,
  onCancelled,
  onViewDetails,
}: ReservationCardProps) => {
  console.log(reservation, 'ovd')
  const {
    _id,
    origin,
    destination,
    aircraftType,
    type,
    preferredDeparture,
    price,
  } = reservation;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const isPending = variant === "pending";
  const view: CancelView = phase === "idle" ? "confirm" : phase;

  const openModal = () => {
    setPhase("idle");
    setErrorMessage(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // সফল হলে এখন লিস্ট রিফ্রেশ করো। আগে করলে কার্ড সরে গিয়ে মোডালও মুছে যেত
    const wasSuccess = phase === "success";
    setIsModalOpen(false);
    setPhase("idle");
    setErrorMessage(undefined);
    if (wasSuccess) onCancelled?.();
  };

  const openDetails = () => {
    setIsDetailsOpen(true);
    onViewDetails?.(_id);
  };

  const closeDetails = () => setIsDetailsOpen(false);

  const handleConfirm = async () => {
    setPhase("submitting");
    setErrorMessage(undefined);
    try {
      await cancelReservation(_id);
      setPhase("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setPhase("error");
    }
  };

  return (
    <>
      <article className="rounded-xl border border-(--border-color) bg-(--background) p-4 shadow-sm transition hover:shadow-md sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* বাম পাশ: আইকন + রুট + তথ্য */}
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plane size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-base font-semibold uppercase text-(--heading-text) sm:text-base">
                {origin} → {destination}
              </h3>
              <p className="mt-0.5 text-xs text-(--paragraph-text) sm:text-sm">
                {aircraftType} · {type === "one-way" ? "One-way" : "Round trip"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--paragraph-text) sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(preferredDeparture)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {getTimeOfDay(preferredDeparture)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <DollarSign size={14} />
                  {price.toLocaleString("en-US")} (per Member)
                </span>
              </div>
            </div>
          </div>

          {/* ডান পাশ: ব্যাজ + বাটন (মোবাইলে নিচে, পুরো প্রস্থ) */}
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start">
            <Badge variant={isPending ? "warning" : "success"}>
              {isPending ? "Pending" : "Confirmed"}
            </Badge>

            {isPending ? (
              <button
                type="button"
                onClick={openModal}
                className="h-9 cursor-pointer rounded-md bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm"
              >
                Cancel Reservation
              </button>
            ) : (
              <button
                type="button"
                onClick={openDetails}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm"
              >
                <Eye size={14} />
                View Details
              </button>
            )}
          </div>
        </div>
      </article>

      {isPending && isModalOpen && (
        <CancelReservationModal
          opportunity={reservation}
          view={view}
          errorMessage={errorMessage}
          onConfirm={handleConfirm}
          onClose={closeModal}
        />
      )}

      {!isPending && isDetailsOpen && (
        <DetailsModal reservation={reservation} onClose={closeDetails} />
      )}
    </>
  );
};

export default ReservationCard;