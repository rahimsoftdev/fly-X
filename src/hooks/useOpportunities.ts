import { useFetch } from "./useFetch";
import { getOpportunities } from "../services/opportunity.service";
// import type { PaginatedResponse } from "../types/common.types";
import type { Opportunity, OpportunityQuery } from "../types/opportunity.types";
import type { PaginatedResponse } from "@/types/common.types";

export const useOpportunities = (params: OpportunityQuery) =>
  useFetch<PaginatedResponse<Opportunity>>(
    (signal) => getOpportunities(params, signal),
    [params.page, params.limit, params.status, params.type]
  );