export type DemandLevel = "low" | "medium" | "high";
export const CALENDAR_PATH = "/staff/calendar-demand";

const pad = (n: number) => String(n).padStart(2, "0");

// month: 0-11
export const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

export const getTodayKey = () => {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
};

export const getMonthRange = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    from: toDateKey(year, month, 1),
    to: toDateKey(year, month, lastDay),
  };
};

// মাসের grid: শুরুতে ফাঁকা ঘর (null), তারপর ১..শেষ দিন, শেষে ফাঁকা
export const buildMonthCells = (year: number, month: number) => {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

export const getDemandLevel = (count: number): DemandLevel => {
  if (count >= 5) return "high";
  if (count >= 3) return "medium";
  return "low";
};

export const formatDirection = (origin: string, destination: string) =>
  `${origin} → ${destination}`;

// "2026-06-12" -> "Friday, June 12"
export const formatDayTitle = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

// ISO string -> "6/15/2026"
export const formatShortDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC" })
    : "-";

// ISO string -> "Jun 15, 2026"
export const formatMediumDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "-";