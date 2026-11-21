import { Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useFetch } from "@/hooks/useFetch";
import { getTravelDetails } from "@/services/custom-travel-calendar.service";
import { formatDirection, formatMediumDate } from "@/utils/calendar.util";

interface TravelDetailsModalProps {
  id: string;
  onClose: () => void;
}

const RouteBox = ({
  route,
  dateLabel,
}: {
  route: string;
  dateLabel: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl bg-(--card) p-4">
    <MapPin size={16} className="shrink-0 text-(--paragraph-text)" />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-(--heading-text)">
        {route}
      </p>
      <p className="text-xs text-(--paragraph-text)">{dateLabel}</p>
    </div>
  </div>
);

const TravelDetailsModal = ({ id, onClose }: TravelDetailsModalProps) => {
  const { data, isLoading, error } = useFetch(
    (signal) => getTravelDetails(id, signal),
    [id]
  );

  return (
    <Modal
      title={data?.member?.name ?? "Travel details"}
      subtitle={data?.member?.email}
      onClose={onClose}
      size="md"
      layer="top"
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
          <section>
            <h3 className="mb-3 text-sm font-semibold text-(--heading-text)">
              Route Information
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <RouteBox
                route={formatDirection(data.origin, data.destination)}
                dateLabel={`Departure: ${formatMediumDate(data.preferredDeparture)}`}
              />
              {data.type === "two-way" && (
                <RouteBox
                  route={formatDirection(
                    data.returnOrigin ?? data.destination,
                    data.returnDestination ?? data.origin
                  )}
                  dateLabel={`Return: ${formatMediumDate(data.returnDate)}`}
                />
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-(--heading-text)">
              Passenger Information ({data.passengers.length})
            </h3>
            <div className="space-y-3">
              {data.passengers.map((p, index) => (
                <div
                  key={`${p.email}-${index}`}
                  className="space-y-1 rounded-xl border border-(--border-color) p-4"
                >
                  <p className="text-xs font-semibold text-primary">
                    Passenger {index + 1}
                  </p>
                  <p className="text-sm font-medium text-(--heading-text)">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-(--paragraph-text)">
                    {p.streetAddress}, {p.zipCode}
                  </p>
                  <p className="flex items-center gap-2 break-all text-xs text-(--paragraph-text)">
                    <Mail size={12} className="shrink-0" />
                    {p.email}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-(--paragraph-text)">
                    <Phone size={12} className="shrink-0" />
                    {p.phone}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {data.specialRequests && (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--heading-text)">
                <MessageSquareText size={14} />
                Special Requests
              </h3>
              <p className="whitespace-pre-wrap rounded-xl bg-(--card) p-4 text-sm text-(--paragraph-text)">
                {data.specialRequests}
              </p>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TravelDetailsModal;