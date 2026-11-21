import type { TravelStatus } from "@/types/travel.type";
import { capitalize, TRAVEL_STATUS_STYLES } from "@/utils/travel.util";

const TravelStatusBadge = ({ status }: { status: TravelStatus }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-medium ${TRAVEL_STATUS_STYLES[status]}`}
  >
    {capitalize(status)}
  </span>
);

export default TravelStatusBadge;