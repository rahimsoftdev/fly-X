import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  type LucideIcon,
} from "lucide-react";

/* ---------------- Types ---------------- */
type NotificationType = "new" | "pending" | "confirmed";

interface TravelNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  route: string;
  tripDate?: string; // না থাকলে Date দেখাবে না
  createdAt: string; // উপরের ডান কোণের তারিখ
  read: boolean;
}

/* ---------------- Fake Data ---------------- */
const NOTIFICATIONS: TravelNotification[] = [
  {
    id: "1",
    type: "new",
    title: "New Travel Opportunity Available",
    description:
      "A new travel opportunity matching your preferences has been created.",
    route: "Tampa → NYC",
    tripDate: "July 15, 2026",
    createdAt: "July 15, 2026",
    read: false,
  },
  {
    id: "2",
    type: "pending",
    title: "Reservation Successfully Submitted",
    description:
      "Your reservation request has been received and is currently awaiting confirmation from Flyx Concierge.",
    route: "Tampa → NYC",
    createdAt: "July 15, 2026",
    read: false,
  },
  {
    id: "3",
    type: "confirmed",
    title: "Trip Confirmed",
    description:
      "Great news! Your upcoming trip has been confirmed and booked.",
    route: "Tampa → NYC",
    tripDate: "July 15, 2026",
    createdAt: "July 15, 2026",
    read: true,
  },
  {
    id: "4",
    type: "new",
    title: "New Travel Opportunity Available",
    description:
      "A new travel opportunity matching your preferences has been created.",
    route: "NYC → Tampa",
    tripDate: "July 22, 2026",
    createdAt: "July 14, 2026",
    read: true,
  },
  {
    id: "5",
    type: "pending",
    title: "Reservation Successfully Submitted",
    description:
      "Your reservation request has been received and is currently awaiting confirmation from Flyx Concierge.",
    route: "Miami → Los Angeles",
    createdAt: "July 13, 2026",
    read: true,
  },
  {
    id: "6",
    type: "confirmed",
    title: "Trip Confirmed",
    description:
      "Great news! Your upcoming trip has been confirmed and booked.",
    route: "NYC → Tampa",
    tripDate: "August 4, 2026",
    createdAt: "July 12, 2026",
    read: true,
  },
  {
    id: "7",
    type: "new",
    title: "New Travel Opportunity Available",
    description:
      "A new travel opportunity matching your preferences has been created.",
    route: "Tampa → NYC",
    tripDate: "August 10, 2026",
    createdAt: "July 10, 2026",
    read: true,
  },
];

/* ---------------- Config ---------------- */
const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: LucideIcon; badge: string }
> = {
  new: {
    label: "New",
    icon: Plane,
    badge: "bg-blue-600 text-white",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badge:
      "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  },
};

const FILTERS: { key: "all" | NotificationType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
];

/* ---------------- Page ---------------- */
export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  const visible =
    filter === "all" ? items : items.filter((n) => n.type === filter);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-dvh   dark:bg-slate-900">
      <div className="mx-auto ">
        {/* Header */}
        <header>
          <h1 className="font-serif text-2xl font-medium text-gray-900 sm:text-3xl dark:text-gray-50">
            Travel Notifications
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm dark:text-slate-400">
            Never miss an important update about your upcoming trips and travel
            preferences.
          </p>
        </header>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-800 dark:text-slate-200">
            Notification Stream ({visible.length})
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  filter === f.key
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <ul className="mt-4 space-y-4">
          {visible.length === 0 && (
            <li className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-4 py-14 text-center dark:border-slate-700 dark:bg-slate-800">
              <Bell size={28} className="text-gray-300 dark:text-slate-600" />
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
                No notifications to show
              </p>
            </li>
          )}

          {visible.map((n) => {
            const cfg = TYPE_CONFIG[n.type];
            const Icon = cfg.icon;

            return (
              <li key={n.id}>
                <article
                  onClick={() => markRead(n.id)}
                  className="relative cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  {!n.read && (
                    <span
                      aria-label="Unread"
                      className="absolute left-0 top-5 h-8 w-1 rounded-r-full bg-blue-600"
                    />
                  )}

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                        <Icon size={16} />
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1 text-[11px] text-blue-600 dark:border-slate-600 dark:bg-slate-900 dark:text-blue-300">
                      {n.createdAt}
                    </span>
                  </div>

                  {/* Body */}
                  <h2 className="mt-4 text-base font-medium text-gray-900 dark:text-gray-50">
                    {n.title}
                  </h2>
                  <p className="mt-1.5 max-w-md text-sm text-gray-500 dark:text-slate-400">
                    {n.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-gray-400" />
                      Route: {n.route}
                    </span>

                    {n.tripDate && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-gray-400" />
                        Date: {n.tripDate}
                      </span>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}