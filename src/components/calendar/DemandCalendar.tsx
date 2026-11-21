import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import type { CalendarDay } from "@/types/custom-travel-calendar.types";
import {
  buildMonthCells,
  formatDirection,
  getDemandLevel,
  getTodayKey,
  toDateKey,
  type DemandLevel,
} from "@/utils/calendar.util";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LEVEL_STYLES: Record<DemandLevel, string> = {
  low: "border-gray-300 bg-white hover:shadow-md dark:bg-(--card)",
  medium:
    "border-yellow-400 bg-yellow-50 hover:shadow-md dark:bg-yellow-400/10",
  high: "border-green-500 bg-green-50 hover:shadow-md dark:bg-green-500/10",
};

interface DemandCalendarProps {
  year: number;
  month: number; // 0-11
  daysByDate: Map<string, CalendarDay>;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (dateKey: string) => void;
}

const DemandCalendar = ({
  year,
  month,
  daysByDate,
  isLoading,
  onPrev,
  onNext,
  onSelectDate,
}: DemandCalendarProps) => {
  const cells = buildMonthCells(year, month);
  const todayKey = getTodayKey();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--heading-text)">
            {MONTH_NAMES[month]} {year}
          </h1>
          <p className="text-sm text-(--paragraph-text)">
            Flight demand calendar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous month"
            className="rounded-lg border border-(--border-color) p-2 hover:bg-(--card)"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next month"
            className="rounded-lg border border-(--border-color) p-2 hover:bg-(--card)"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mb-2 grid grid-cols-7 gap-2 sm:gap-3">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-(--paragraph-text)"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-7 gap-2 sm:gap-3 ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const dateKey = toDateKey(year, month, day);
          const info = daysByDate.get(dateKey);
          const isToday = dateKey === todayKey;
          const hasDemand = !!info && info.count > 0;
          const level = hasDemand ? getDemandLevel(info.count) : null;

          const label =
            info && info.directions.length > 1
              ? "Mixed Demand"
              : info?.directions[0]
                ? formatDirection(
                    info.directions[0].origin,
                    info.directions[0].destination
                  )
                : "";

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!hasDemand}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex min-h-20 flex-col rounded-xl border p-2 text-left transition sm:min-h-24 ${
                level
                  ? `${LEVEL_STYLES[level]} cursor-pointer`
                  : "cursor-default border-(--border-color) bg-white dark:bg-(--card)"
              } ${isToday ? "ring-2 ring-gray-900 dark:ring-white" : ""}`}
            >
              <span className="text-sm font-semibold text-(--heading-text)">
                {day}
              </span>

              {level === "high" && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-green-500" />
              )}

              {hasDemand && (
                <div className="mt-auto space-y-0.5 text-[10px] text-(--paragraph-text)">
                  <div className="flex items-center gap-1 font-medium text-(--heading-text)">
                    <Users size={10} />
                    {info.count} Interested
                  </div>
                  <div className="truncate">→ {label}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-5 text-xs text-(--paragraph-text)">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-yellow-400" />
          Medium Demand (3-4)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-green-500" />
          High Demand (5+)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-gray-300" />
          Low Demand (1-2)
        </span>
      </div>
    </div>
  );
};

export default DemandCalendar;