import { Plane, Users } from "lucide-react";
// import { useInsights } from "../useInsights";
import StatCard from "../components/StatCard";
import ProgressBarList, {
  type ProgressItem,
} from "../components/ProgressBarList";
import InsightsSkeleton from "../components/InsightsSkeleton";
import { useInsights } from "@/features/analytics/useInsights";

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h2 className="mb-5 text-sm font-semibold text-gray-900 dark:text-gray-50">
      {title}
    </h2>
    {children}
  </div>
);

const capitalizeShort = (day: string) =>
  day.charAt(0).toUpperCase() + day.slice(1, 3);

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useInsights();

  const maxMembers = data
    ? Math.max(...data.weeklyDemand.map((d) => d.members), 1)
    : 1;

  const weeklyItems: ProgressItem[] =
    data?.weeklyDemand.map((d) => ({
      key: d.day,
      label: capitalizeShort(d.day),
      rightLabel: `${d.members} members`,
      percent: (d.members / maxMembers) * 100,
    })) ?? [];

  const routeItems: ProgressItem[] =
    data?.popularRoutes.map((r) => ({
      key: `${r.origin}-${r.destination}`,
      label: `${r.origin} → ${r.destination}`,
      rightLabel: `${r.percentage}%`,
      percent: r.percentage,
    })) ?? [];

  return (
    <div className="space-y-5  mb-10 md:mb-12 xl:mb-section">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Analytics &amp; Insights
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          Track performance and demand trends
        </p>
      </header>

      {loading && <InsightsSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              icon={Users}
              label="Total Interest"
              value={data.totalInterest}
              tone="blue"
            />
            <StatCard
              icon={Plane}
              label="Scheduled Flights"
              value={data.scheduledFlights}
              tone="purple"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Weekly Demand Trend">
              <ProgressBarList items={weeklyItems} />
            </Card>

            <Card title="Popular Routes">
              {routeItems.length ? (
                <ProgressBarList items={routeItems} variant="mixed" />
              ) : (
                <p className="py-10 text-center text-sm text-gray-500 dark:text-slate-400">
                  No route data yet
                </p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}