import type { OpportunityStatus } from "@/types/opportunity.types";

export const OPPORTUNITIES_PATH = "/staff/opportunities";

export const STATUS_LABELS: Record<OpportunityStatus, string> = {
  draft: "Draft",
  open: "Open For Reservation",
  confirmed: "Confirmed",
  completed: "Completed",
};

export const STATUS_STYLES: Record<OpportunityStatus, string> = {
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300",
  open: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  confirmed:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
};

// backend-এর নিয়মের সাথে মিল রাখা (কোন status থেকে কোনটায় যাওয়া যায়)
export const STATUS_TRANSITIONS: Record<OpportunityStatus, OpportunityStatus[]> = {
  draft: ["open"],
  open: ["draft", "confirmed"],
  confirmed: ["completed"],
  completed: [],
};

// "2026-11-27T00:00:00.000Z" -> "2026-11-27"
export const formatIsoDate = (iso?: string) => (iso ? iso.slice(0, 10) : "-");

export const formatRoute = (origin: string, destination: string) =>
  `${origin} → ${destination}`;

export const formatPrice = (value: number) =>
  `$${Number(value).toLocaleString("en-US")}`;

export const getInitials = (name?: string) =>
  (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";