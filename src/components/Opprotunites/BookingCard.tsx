import { Calendar, Plane, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { getTimeOfDay } from "@/utils/opportunity";
import type {
  Opportunity,
  OpportunityStatus,
} from "@/types/opportunity.types";

const statusBadge: Record<
  OpportunityStatus,
  { label: string; variant: "primary" | "danger" | "neutral" }
> = {
  draft: { label: "Draft", variant: "neutral" },
  open: { label: "Reserved", variant: "primary" },
  confirmed: { label: "Flight Confirmed", variant: "primary" },
  completed: { label: "Completed", variant: "neutral" },
};

const BookingCard = ({ opportunity }: { opportunity: Opportunity }) => {
  const {
    origin,
    destination,
    aircraftType,
    type,
    preferredDeparture,
    price,
    totalCapacity,
    passengers,
    status,
  } = opportunity;

  const badge = statusBadge[status];

  return (
    <article className="rounded-xl border border-(--border-color) bg-(--background) p-4 shadow-sm sm:p-5">
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

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:pl-13">
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
          <p className="text-xs text-(--paragraph-text)">Members</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-(--heading-text)">
            <Users size={14} className="text-(--paragraph-text)" />
            {passengers.length} of {totalCapacity} joined
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 lg:text-right">
          <p className="text-xs text-(--paragraph-text)">Estimated Cost</p>
          <p className="mt-1 text-xl font-bold text-(--heading-text)">
            {formatCurrency(price)}
          </p>
          <p className="text-xs text-(--paragraph-text)">per Member</p>
        </div>
      </div>
    </article>
  );
};

export default BookingCard;