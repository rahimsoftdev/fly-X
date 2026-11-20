import type { DayOfWeek, PreferredTime } from "@/types/travel.type";

export const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];

export const TIME_OPTIONS: { value: PreferredTime; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// "morning" -> "Morning"
export const timeLabel = (value: string) => capitalize(value);

// "monday" -> "Mondays"
export const dayLabel = (value?: string) =>
  value ? `${capitalize(value)}s` : "";

const ordinal = (n: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
};

// "2026-07-15T00:00:00.000Z" -> "July 15th, 2026"
export const formatTravelDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${month} ${ordinal(d.getUTCDate())}, ${d.getUTCFullYear()}`;
};

// date input-er min value (ajker tarikh, "YYYY-MM-DD")
export const todayString = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};