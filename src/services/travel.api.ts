// import { api } from "@/lib/apai"; // apnar axios instance-er asol path boshan
import { api } from "@/lib/axios";
import type { CreateTravelPayload, ITravel } from "@/types/travel.type";

const BASE = "/travel";

export const createTravel = async (payload: CreateTravelPayload) => {
  const res = await api.post<{ success: boolean; data: ITravel }>(
    BASE,
    payload
  );
  return res.data.data;
};

export const getMyTravels = async (signal?: AbortSignal) => {
  const res = await api.get<{ success: boolean; data: ITravel[] }>(
    `${BASE}/me`,
    { signal }
  );
  return res.data.data;
};

export const deleteTravel = async (postId: string) => {
  await api.delete(`${BASE}/${postId}`);
};