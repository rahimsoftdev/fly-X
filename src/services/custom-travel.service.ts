// import { api } from "@/lib/api"; // <-- আপনার api instance এর path
import { api } from "@/lib/axios";
import type {
  CustomTravelRequest,
  TravelStatus,
} from "@/types/custom-travel.types";

export const getAllCustomTravels = async (signal?: AbortSignal) => {
  const res = await api.get("/custom-travel", { signal });
  return res.data.data as CustomTravelRequest[];
};

export const getCustomTravelById = async (id: string, signal?: AbortSignal) => {
  const res = await api.get(`/custom-travel/${id}`, { signal });
  return res.data.data as CustomTravelRequest;
};

export const updateCustomTravelStatus = async (
  id: string,
  status: TravelStatus
) => {
  const res = await api.patch(`/custom-travel/${id}/status`, { status });
  return res.data.data as CustomTravelRequest;
};

export const deleteCustomTravel = async (id: string) => {
  const res = await api.delete(`/custom-travel/${id}`);
  return res.data;
};