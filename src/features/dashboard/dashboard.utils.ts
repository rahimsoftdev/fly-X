const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// "18:00" -> "Evening", "morning" -> "Morning"
export const formatTimeOfDay = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return cap(value);

  const hour = Number(match[1]);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

// "2026-06-15" বা ISO string -> "Jun 15, 2026"
export const formatDate = (value: string) => {
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

// "monday" -> "Monday"
export const formatDay = (day: string | null) => (day ? cap(day) : "");

// "monday" -> "Mondays"
export const formatDayPlural = (day: string | null) =>
  day ? `${cap(day)}s` : "";