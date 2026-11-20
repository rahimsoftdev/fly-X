import { ArrowRight, X } from "lucide-react";
import type { ITravel } from "@/types/travel.type";
import { dayLabel, formatTravelDate, timeLabel } from "@/utils/travel.util";

interface Props {
  travels: ITravel[];
  onDelete: (travel: ITravel) => void; // x chaple modal khulbe
}

function TravelRow({
  travel,
  onDelete,
}: {
  travel: ITravel;
  onDelete: (travel: ITravel) => void;
}) {
  const detail =
    travel.type === "regular"
      ? dayLabel(travel.dayOfWeek)
      : formatTravelDate(travel.date);

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-primary/10 px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="flex items-center gap-1.5 text-sm font-medium text-(--heading-text)">
          {travel.origin}
          <ArrowRight className="size-3.5 shrink-0 text-(--paragraph-text)" />
          {travel.destination}
        </span>

        <span className="text-xs text-(--paragraph-text)">{detail}</span>
        <span className="text-xs text-(--paragraph-text)">
          {timeLabel(travel.preferredTime)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDelete(travel)}
        aria-label={`Delete ${travel.origin} to ${travel.destination}`}
        className="shrink-0 rounded-md p-1 text-(--paragraph-text) transition hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}

function Group({
  title,
  items,
  onDelete,
}: {
  title: string;
  items: ITravel[];
  onDelete: (travel: ITravel) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-2 font-serif! text-xs text-(--paragraph-text)">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((travel) => (
          <TravelRow key={travel._id} travel={travel} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

export default function SavedTravelList({ travels, onDelete }: Props) {
  const regular = travels.filter((t) => t.type === "regular");
  const oneTime = travels.filter((t) => t.type === "one-time");

  return (
    <section>
      <h2 className="font-serif! text-lg font-semibold text-(--heading-text)">
        Your Saved Preferences
      </h2>
      <p className="mt-1 text-xs text-(--paragraph-text)">
        These are the travel patterns we're using to match you with
        opportunities
      </p>

      {travels.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-(--border-color) px-4 py-6 text-center text-sm text-(--paragraph-text)">
          You haven't saved any travel preferences yet.
        </p>
      ) : (
        <>
          <Group title="Recurring Patterns" items={regular} onDelete={onDelete} />
          <Group title="One-Time Requests" items={oneTime} onDelete={onDelete} />
        </>
      )}
    </section>
  );
}