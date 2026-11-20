import { useState } from "react";
import { Calendar, Plane, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { reserveOpportunity } from "@/services/opportunity.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { getSeatInfo, getTimeOfDay } from "@/utils/opportunity";
import type { Opportunity } from "@/types/opportunity.types";
import ReservationModal, { type ModalView } from "./ReservationModal";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onReserved?: (() => void) | undefined; // সফল হলে লিস্ট রিফ্রেশ করার জন্য
}

type Phase = "idle" | "submitting" | "success" | "error";

const OpportunityCard = ({ opportunity, onReserved }: OpportunityCardProps) => {
  const {
    _id,
    origin,
    destination,
    aircraftType,
    type,
    preferredDeparture,
    price,
    totalCapacity,
    passengers,
  } = opportunity;

  const { user } = useCurrentUser();

  // কার্ডে ক্লিক করলে বাটন খোলে/বন্ধ হয় (মাউস থাকা ডিভাইসে hover-এও খোলে)
  const [isOpen, setIsOpen] = useState(false);

  // মোডালের অবস্থা
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const { available, bookedPercent, isFillingFast } = getSeatInfo(
    totalCapacity,
    passengers.length
  );
  const isFull = available === 0;
  const alreadyReserved = user ? passengers.includes(user.id) : false;

  // মোডালে কোন কনটেন্ট দেখাবে
  const view: ModalView =
    phase !== "idle" ? phase : alreadyReserved ? "already" : "confirm";

  const badge = alreadyReserved
    ? ({ label: "Reserved", variant: "primary" } as const)
    : isFull
      ? ({ label: "Full", variant: "neutral" } as const)
      : isFillingFast
        ? ({ label: "Filling Fast", variant: "danger" } as const)
        : ({ label: "Available", variant: "primary" } as const);

  const toggle = () => setIsOpen((prev) => !prev);

  const openModal = () => {
    setPhase("idle");
    setErrorMessage(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPhase("idle");
    setErrorMessage(undefined);
  };

  const handleConfirm = async () => {
    setPhase("submitting");
    setErrorMessage(undefined);
    try {
      await reserveOpportunity(_id);
      setPhase("success");
      onReserved?.(); // সিট সংখ্যা নতুন করে আনো
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setPhase("error");
    }
  };

  const buttonLabel = alreadyReserved
    ? "Already Reserved"
    : isFull
      ? "Fully Booked"
      : "Place Reservation";

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(e) => {
          // শুধু কার্ড নিজে ফোকাসে থাকলে; ভেতরের বাটনের কীবোর্ড আলাদা থাকবে
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={`group cursor-pointer rounded-xl border bg-(--background) p-4 shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5 ${
          isOpen
            ? "border-primary shadow-md"
            : "border-(--border-color) hover:border-primary"
        }`}
      >
        {/* উপরের অংশ: আইকন + রুট + ব্যাজ */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--card) text-(--heading-text)">
              <Plane size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-(--heading-text) sm:text-lg">
                {origin} → {destination}
              </h3>
              <p className="truncate text-sm text-(--paragraph-text)">
                {aircraftType} · {type === "one-way" ? "One-way" : "Round trip"}
              </p>
            </div>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        {/* মাঝের অংশ: মোবাইলে ১, ট্যাবলেটে ২, ল্যাপটপ+ এ ৩ কলাম */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_auto] lg:items-start lg:pl-13">
          <div>
            <p className="text-xs text-(--paragraph-text)">Departure</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-(--heading-text)">
              <Calendar size={14} className="text-(--paragraph-text)" />
              {formatDate(preferredDeparture)}
            </p>
            <p className="text-xs text-(--paragraph-text)">
              {getTimeOfDay(preferredDeparture)}
            </p>
          </div>

          <div>
            <p className="text-xs text-(--paragraph-text)">Available Seats</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-(--heading-text)">
              <Users size={14} className="text-(--paragraph-text)" />
              {available} of {totalCapacity} available
            </p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={bookedPercent}
              aria-label="Seats booked"
              className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-(--border-color)"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${bookedPercent}%` }}
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
            <p className="text-xs text-(--paragraph-text)">Estimated Cost</p>
            <p className="mt-1 text-2xl font-bold text-(--heading-text)">
              {formatCurrency(price)}
            </p>
            <p className="text-xs text-(--paragraph-text)">per Member</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-red-600 dark:text-red-400">
          Note: You will not be charged until the flight is confirmed by Raven.
          Final aircraft type and operator details will be provided upon
          confirmation.
        </p>

        {/* বাটন: ক্লিকে খোলে; মাউস থাকলে hover-এও খোলে; টাচ ডিভাইসে ক্লিকে */}
        <div
          className={`grid transition-[grid-template-rows] duration-200 ${
            isOpen
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr] pointer-fine:group-hover:grid-rows-[1fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-4 border-t border-(--border-color) pt-4">
              <button
                type="button"
                disabled={isFull && !alreadyReserved}
                onClick={(e) => {
                  e.stopPropagation(); // কার্ড বন্ধ হয়ে যাবে না
                  openModal(); // মোডাল খোলে
                }}
                className="h-11 w-full cursor-pointer rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* মোডাল কার্ডের বাইরে (sibling), নইলে মোডালের ক্লিক কার্ডে ফিরে কার্ড খোলা/বন্ধ করত */}
      {isModalOpen && (
        <ReservationModal
          opportunity={opportunity}
          view={view}
          errorMessage={errorMessage}
          availableSeats={available}
          onConfirm={handleConfirm}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default OpportunityCard;