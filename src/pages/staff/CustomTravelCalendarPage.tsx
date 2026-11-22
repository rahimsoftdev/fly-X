import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import DemandCalendar from "@/components/calendar/DemandCalendar";
import { useFetch } from "@/hooks/useFetch";
import { getCalendarSummary } from "@/services/custom-travel-calendar.service";
import { CALENDAR_PATH, getMonthRange } from "@/utils/calendar.util";

// "2026-11" -> { year: 2026, month: 10 }, ভুল হলে চলতি মাস
const parseMonthParam = (value: string | null) => {
  const match = value?.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const month = Number(match[2]) - 1;
    if (month >= 0 && month <= 11) {
      return { year: Number(match[1]), month };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};

const CustomTravelCalendarPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { year, month } = parseMonthParam(searchParams.get("month"));
  const { from, to } = getMonthRange(year, month);

  const { data, isLoading, error } = useFetch(
    (signal) => getCalendarSummary(from, to, signal),
    [from, to]
  );

  const daysByDate = useMemo(
    () => new Map((data?.items ?? []).map((item) => [item.date, item])),
    [data]
  );

  const changeMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    const value = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    setSearchParams({ month: value }, { replace: true });
  };

  return (
    <div className="">
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <div className="">
        <DemandCalendar

          year={year}
          month={month}
          daysByDate={daysByDate}
          isLoading={isLoading}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          onSelectDate={(dateKey) => navigate(`${CALENDAR_PATH}/${dateKey}`)}
        />
      </div>
    </div>
  );
};

export default CustomTravelCalendarPage;