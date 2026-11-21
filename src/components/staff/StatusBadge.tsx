import type { TravelStatus } from "@/types/custom-travel.types";

const styles: Record<TravelStatus, string> = {
  interested: "bg-gray-600 text-white",
  confirmed: "bg-green-400 text-green-950",
};

const StatusBadge = ({ status }: { status: TravelStatus }) => (
  <span
    className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium capitalize ${styles[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;