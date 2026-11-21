import { MapPin, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
// import TravelStatusBadge from "@/components/travel/TravelStatusBadge";
import { useFetch } from "@/hooks/useFetch";
import { getManageTravel } from "@/services/travel-manage.service";
import { formatMediumDate } from "@/utils/calendar.util";
import {  capitalize, formatTravelRoute } from "@/utils/travel.util";
import TravelStatusBadge from "@/components/travel/ravelStatusBadge";

interface Props {
  id: string;
  onClose: () => void;
}

const TravelDetailsModal = ({ id, onClose }: Props) => {
  const { data, isLoading, error } = useFetch(
    (signal) => getManageTravel(id, signal),
    [id]
  );

  const isOneTime = data?.type === "one-time";

  return (
    <Modal
      title={isOneTime ? "One-Time Travel Request" : "Recurring Travel"}
      onClose={onClose}
      size="md"
    >
      {isLoading && !data && (
        <p className="py-10 text-center text-sm text-(--paragraph-text)">
          Loading...
        </p>
      )}

      {error && (
        <p className="py-10 text-center text-sm text-red-500">{error}</p>
      )}

      {data && (
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-(--heading-text)">
              Route Information
            </h3>
            <div className="flex items-start justify-between gap-3 rounded-xl bg-(--card) p-4">
              <div className="flex min-w-0 items-start gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-(--paragraph-text)"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--heading-text)">
                    {formatTravelRoute(data.origin, data.destination)}
                  </p>
                  <p className="text-xs text-(--paragraph-text)">
                    {isOneTime
                      ? `Departure: ${formatMediumDate(data.date)}, ${capitalize(data.preferredTime)}`
                      : `Every ${capitalize(data.dayOfWeek)}, ${capitalize(data.preferredTime)}`}
                  </p>
                </div>
              </div>
              <TravelStatusBadge status={data.status} />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-(--heading-text)">
              <Users size={14} />
              Member Details
            </h3>
            <div className="space-y-1 rounded-xl border border-(--border-color) p-4">
              <p className="text-sm font-semibold text-primary">
                {data.member?.name ?? "Unknown member"}
              </p>
              {data.member?.address && (
                <p className="text-xs text-(--paragraph-text)">
                  {data.member.address}
                </p>
              )}
              {data.member?.email && (
                <p className="break-all text-xs text-(--paragraph-text)">
                  {data.member.email}
                </p>
              )}
              {data.member?.phone && (
                <p className="text-xs text-(--paragraph-text)">
                  {data.member.phone}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default TravelDetailsModal;