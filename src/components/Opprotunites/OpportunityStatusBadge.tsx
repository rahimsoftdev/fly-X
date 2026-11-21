import type { OpportunityStatus } from "@/types/opportunity.types";
import { STATUS_LABELS, STATUS_STYLES } from "@/utils/opportunity.util";

const OpportunityStatusBadge = ({ status }: { status: OpportunityStatus }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);

export default OpportunityStatusBadge;