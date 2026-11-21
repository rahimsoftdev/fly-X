import { Link, useParams } from "react-router";
import { ArrowLeft, MapPin } from "lucide-react";
// import OpportunityStatusBadge from "@/components/opportunities/OpportunityStatusBadge";
import { useFetch } from "@/hooks/useFetch";
import { getManageOpportunity } from "@/services/opportunity-manage.service";
import { formatMediumDate } from "@/utils/calendar.util";
import {
  formatPrice,
  formatRoute,
  getInitials,
  OPPORTUNITIES_PATH,
} from "@/utils/opportunity.util";
import OpportunityStatusBadge from "@/components/Opprotunites/OpportunityStatusBadge";

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-(--card) p-4">
    <p className="text-xs text-(--paragraph-text)">{label}</p>
    <p className="mt-1 text-sm font-medium text-(--heading-text)">{value}</p>
  </div>
);

const RouteBox = ({ route, date }: { route: string; date: string }) => (
  <div className="flex items-center gap-3 rounded-xl bg-(--card) p-4">
    <MapPin size={16} className="shrink-0 text-(--paragraph-text)" />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-(--heading-text)">
        {route}
      </p>
      <p className="text-xs text-(--paragraph-text)">{date}</p>
    </div>
  </div>
);

const OpportunityDetailsPage = () => {
  const { id = "" } = useParams<{ id: string }>();

  const { data, isLoading, error } = useFetch(
    (signal) => getManageOpportunity(id, signal),
    [id]
  );

  return (
    <div className="space-y-6">
      <Link
        to={OPPORTUNITIES_PATH}
        className="inline-flex items-center gap-2 text-sm font-medium text-(--paragraph-text) hover:text-(--heading-text)"
      >
        <ArrowLeft size={16} />
        Back to opportunities
      </Link>

      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-(--paragraph-text)">
          Loading...
        </p>
      )}

      {error && (
        <p className="py-16 text-center text-sm text-red-500">{error}</p>
      )}

      {data && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border-color) pb-4">
            <h1 className="text-2xl font-bold text-(--heading-text)">
              Opportunities Details
            </h1>
            <OpportunityStatusBadge status={data.status} />
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-(--heading-text)">
              Route Information
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <RouteBox
                route={formatRoute(data.origin, data.destination)}
                date={`Departure: ${formatMediumDate(data.preferredDeparture)}`}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-(--heading-text)">
              Aircraft Details
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoBox label="Aircraft Type" value={data.aircraftType} />
              <InfoBox
                label="Total Capacity"
                value={`${data.totalSeats} passengers`}
              />
              <InfoBox
                label="Available Seats"
                value={`${data.availableSeats} remaining`}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-(--heading-text)">
              Pricing
            </h2>
            <div className="rounded-xl bg-(--card) p-5 sm:max-w-sm">
              <p className="text-sm text-(--heading-text)">Pricing</p>
              <p className="mt-1 text-3xl font-bold text-(--heading-text)">
                {formatPrice(data.price)}
              </p>
              <p className="text-xs text-(--paragraph-text)">
                per seat (estimated)
              </p>
              <p className="mt-3 text-[11px] text-(--paragraph-text)">
                Final pricing will be confirmed by our concierge team based on
                final passenger count and requirements.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-(--heading-text)">
              Traveler List ({data.travelers.length})
            </h2>

            {data.travelers.length === 0 && (
              <p className="rounded-xl bg-(--card) p-4 text-sm text-(--paragraph-text)">
                No travelers have reserved yet.
              </p>
            )}

            <div className="space-y-2">
              {data.travelers.map((t) => (
                <div
                  key={t.userId}
                  className="flex items-center gap-3 rounded-xl bg-(--card) px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-primary dark:bg-blue-500/20">
                    {getInitials(t.member?.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--heading-text)">
                      {t.member?.name ?? "Unknown member"}
                    </p>
                    {t.member?.email && (
                      <p className="truncate text-xs text-(--paragraph-text)">
                        {t.member.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default OpportunityDetailsPage;