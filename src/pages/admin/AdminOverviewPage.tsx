import { useState, type ReactNode } from "react";
import { DollarSign, TrendingUp, UserCog, Users } from "lucide-react";
import { useAdminOverview } from "@/features/analytics/useAdminOverview";
import type { ProgressItem } from "@/components/ProgressBarList";
import DailyActivityChart, { ACTIVITY_SERIES } from "@/components/admin/DailyActivityChart";
import AdminOverviewSkeleton from "@/components/admin/AdminOverviewSkeleton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ChartCard from "@/components/admin/ChartCard";
import MembersOverTimeChart from "@/components/admin/MembersOverTimeChart";
import ProgressBarList from "@/components/ProgressBarList";
// import AdminStatCard from "@/features/analytics/components/AdminStatCard";
// import ChartCard from "@/features/analytics/components/ChartCard";
// import MembersOverTimeChart from "@/features/analytics/components/MembersOverTimeChart";
// import DailyActivityChart, {
//   ACTIVITY_SERIES,
// } from "@/features/analytics/components/DailyActivityChart";
// import ProgressBarList, {
//   type ProgressItem,
// } from "@/features/analytics/components/ProgressBarList";
// import AdminOverviewSkeleton from "@/features/analytics/components/AdminOverviewSkeleton";

const Card = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
        {subtitle}
      </p>
    )}
    <div className="mt-5">{children}</div>
  </div>
);

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function AdminOverviewPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, loading, error, refetch } = useAdminOverview(year);

  const maxDemand = data
    ? Math.max(...data.demandOverview.map((d) => d.members), 1)
    : 1;

  const demandItems: ProgressItem[] =
    data?.demandOverview.map((d) => ({
      key: d.month,
      label: d.month,
      rightLabel: `${d.members} members`,
      percent: (d.members / maxDemand) * 100,
    })) ?? [];

  const routeItems: ProgressItem[] =
    data?.popularRoutes.map((r) => ({
      key: `${r.origin}-${r.destination}`,
      label: `${r.origin} → ${r.destination}`,
      rightLabel: `${r.percentage}%`,
      percent: r.percentage,
    })) ?? [];

  const legend = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {ACTIVITY_SERIES.map((s) => (
        <span
          key={s.key}
          className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-slate-300"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          {s.name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-5 p-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Admin Overview
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          Manage members, bookings, payments, and travel operations efficiently.
        </p>
      </header>

      {loading && !data && <AdminOverviewSkeleton />}

      {!loading && error && !data && (
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

      {data && (
        <div
          className={`space-y-5 transition-opacity ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              icon={Users}
              tone="blue"
              label="Total Members"
              value={data.stats.totalMembers.toLocaleString()}
            />
            <AdminStatCard
              icon={UserCog}
              label="Staff"
              value={data.stats.staff.toLocaleString()}
            />
            <AdminStatCard
              icon={TrendingUp}
              label="Total Interest"
              hint="This month"
              value={data.stats.totalInterestThisMonth.toLocaleString()}
            />
            <AdminStatCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatMoney(data.stats.totalRevenue)}
            />
          </div>

          <ChartCard
            title="Members Over Time"
            subtitle={`Total number of registered members — Jan to Dec ${data.year}`}
            year={year}
            onYearChange={setYear}
          >
            <MembersOverTimeChart data={data.membersOverTime} />
          </ChartCard>

          <ChartCard
            title="Daily Activity"
            subtitle={`Opportunities, reservations and bookings — Jan to Dec ${data.year}`}
            year={year}
            onYearChange={setYear}
            legend={legend}
          >
            <DailyActivityChart data={data.dailyActivity} />
          </ChartCard>

          <div className="grid items-start gap-4 md:grid-cols-2">
            <Card
              title="Demand Overview"
              subtitle="Demand volume analysis for the selected year"
            >
              <ProgressBarList items={demandItems} />
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
        </div>
      )}
    </div>
  );
}