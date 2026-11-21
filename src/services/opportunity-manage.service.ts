import { api } from "@/lib/axios";
import type { OpportunityStatus } from "@/types/opportunity.types";
import type {
  CreateOpportunityPayload,
  ManageListResponse,
  ManageOpportunity,
  ManageOpportunityDetails,
  OpportunityDirection,
} from "@/types/opportunity-manage.types";

interface ListParams {
  page?: number;
  limit?: number;
  status?: OpportunityStatus;
  origin?: string;
  destination?: string;
}

export const getManageOpportunities = async (
  params: ListParams,
  signal?: AbortSignal
): Promise<ManageListResponse> => {
  const res = await api.get("/opportunities/manage", { params, signal });
  return { items: res.data.data, meta: res.data.meta };
};

export const getManageOpportunity = async (id: string, signal?: AbortSignal) => {
  const res = await api.get(`/opportunities/manage/${id}`, { signal });
  return res.data.data as ManageOpportunityDetails;
};

export const getOpportunityDirections = async (signal?: AbortSignal) => {
  const res = await api.get("/opportunities/directions", { signal });
  return res.data.data as OpportunityDirection[];
};

export const createOpportunity = async (payload: CreateOpportunityPayload) => {
  const res = await api.post("/opportunities", payload);
  return res.data.data as ManageOpportunity;
};

export const updateOpportunityStatus = async (
  id: string,
  status: OpportunityStatus
) => {
  const res = await api.patch(`/opportunities/${id}/status`, { status });
  return res.data.data as ManageOpportunity;
};