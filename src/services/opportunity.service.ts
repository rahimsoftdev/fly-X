import type { PaginatedResponse } from "@/types/common.types";
import { api } from "../lib/axios";
import type {
  Opportunity,
  OpportunityQuery,
  OpportunityStatus,
} from "../types/opportunity.types";

export const getOpportunities = async (
  params: OpportunityQuery,
  signal?: AbortSignal | undefined
) => {
  const { data } = await api.get<PaginatedResponse<Opportunity>>(
    "/opportunities",
    { params, signal }
  );
  return data;
};

export const reserveOpportunity = async (id: string) => {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: Opportunity;
  }>(`/opportunities/${id}/reserve`);
  return data;
};

// Pending পেজ: status=open, Upcoming পেজ: status=confirmed
export const getMyOpportunities = async (
  params: {
    page?: number | undefined;
    limit?: number | undefined;
    status?: OpportunityStatus | undefined;
  },
  signal?: AbortSignal | undefined
) => {
  const { data } = await api.get<PaginatedResponse<Opportunity>>(
    "/opportunities/my",
    { params, signal }
  );
  return data;
};

export const cancelReservation = async (id: string) => {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: Opportunity;
  }>(`/opportunities/${id}/reserve`);
  return data;
};