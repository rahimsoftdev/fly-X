import { useFetch } from "./useFetch";
import { getMyOpportunities } from "../services/opportunity.service";
import type { PaginatedResponse } from "../types/common.types";
import type { Opportunity, OpportunityStatus } from "../types/opportunity.types";

export const useMyOpportunities = (params: {
  page?: number | undefined;
  limit?: number | undefined;
  status?: OpportunityStatus | undefined;
}) =>
  useFetch<PaginatedResponse<Opportunity>>(
    (signal) => getMyOpportunities(params, signal),
    [params.page, params.limit, params.status]
  );