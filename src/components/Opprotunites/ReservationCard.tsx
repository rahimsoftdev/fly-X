import { useState } from "react";
import { Calendar, Clock, DollarSign, Eye, Plane } from "lucide-react";
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

const ReservationCard = ({
  reservation,
  variant,
  onCancelled,
  onViewDetails,
}: ReservationCardProps) => {
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
                onClick={() => onViewDetails?.(_id)}
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
    </>
  );
};

export default ReservationCard;