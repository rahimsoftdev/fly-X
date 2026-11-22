import { Calendar, MapPin, Plane } from "lucide-react";
import { useDashboard } from "@/features/dashboard/useDashboard";
import DashboardSkeleton from "@/components/user/DashboardSkeleton";
import SummaryCard from "@/components/user/SummaryCard";
import QuickActions from "@/components/user/QuickActions";
import DemandInsights from "@/components/user/DemandInsights";
import UpcomingTrips from "@/components/user/UpcomingTrips";
// import SummaryCard from "@/features/dashboard/components/user/SummaryCard";
// import QuickActions from "@/features/dashboard/components/user/QuickActions";
// import DemandInsights from "@/features/dashboard/components/user/DemandInsights";
// import UpcomingTrips from "@/features/dashboard/components/user/UpcomingTrips";
// import DashboardSkeleton from "@/features/dashboard/components/user/DashboardSkeleton";

// আপনার আসল route path অনুযায়ী বদলান
const PREFERENCES_PATH = "/user/travel-preferences";
const CUSTOM_REQUEST_PATH = "/user/custom-travel";
const ALL_TRIPS_PATH = "/user/upcoming-trips";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  const firstName = data?.user.name?.trim().split(" ")[0] || "there";

  return (
    <div className="space-y-5 ">
      <header>
        <h1 className="font-serif text-3xl font-medium text-gray-900 dark:text-gray-50">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Here&apos;s what&apos;s happening with your private travel
        </p>
      </header>

      {loading && <DashboardSkeleton />}

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
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              icon={Calendar}
              label="Travel Opportunities"
              value={data.stats.travelOpportunities}
            />
            <SummaryCard
              icon={Plane}
              label="Pending Reservations"
              value={data.stats.pendingReservations}
            />
            <SummaryCard
              icon={MapPin}
              label="Upcoming Trips"
              value={data.stats.upcomingTrips}
            />
          </div>

          <QuickActions
            preferencesPath={PREFERENCES_PATH}
            customRequestPath={CUSTOM_REQUEST_PATH}
          />

          <DemandInsights
            routes={data.highDemandRoutes}
            dates={data.popularDates}
          />

          <UpcomingTrips trips={data.upcomingTrips} viewAllPath={ALL_TRIPS_PATH} />

        </>
      )}
    </div>
  );
}