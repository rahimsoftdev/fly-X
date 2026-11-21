import { api } from "@/lib/axios";
import type {
  ManageTravel,
  ManageTravelListResponse,
  TravelDirection,
} from "@/types/travel-manage.types";
import type { TravelStatus, TravelType } from "@/types/travel.type";

const BASE = "/travel/manage";

interface ListParams {
  type: TravelType;
  page?: number;
  limit?: number;
  status?: TravelStatus;
  origin?: string;
  destination?: string;
}

export const getManageTravels = async (
  params: ListParams,
  signal?: AbortSignal
): Promise<ManageTravelListResponse> => {
  const res = await api.get(BASE, { params, signal });
  return { items: res.data.data, meta: res.data.meta };
};

export const getManageTravel = async (id: string, signal?: AbortSignal) => {
  const res = await api.get(`${BASE}/${id}`, { signal });
  return res.data.data as ManageTravel;
};

export const getManageTravelDirections = async (
  type: TravelType,
  signal?: AbortSignal
) => {
  const res = await api.get(`${BASE}/directions`, {
    params: { type },
    signal,
  });
  return res.data.data as TravelDirection[];
};

export const updateManageTravelStatus = async (
  id: string,
  status: TravelStatus
) => {
  const res = await api.patch(`${BASE}/${id}/status`, { status });
  return res.data.data as ManageTravel;
};