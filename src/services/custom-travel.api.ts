// import { api } from "@/lib/api"; // apnar axios instance (travel.api.ts e ja ache seta)
import { api } from "@/lib/axios";
import type {
  CreateCustomTravelPayload,
  ICustomTravel,
} from "@/types/custom-travel.type";

// VITE_API_URI te already /api ache, tai ekhane shudhu /custom-travel
const BASE = "/custom-travel";

export const createCustomTravel = async (payload: CreateCustomTravelPayload) => {
  const res = await api.post<{ success: boolean; data: ICustomTravel }>(
    BASE,
    payload
  );
  return res.data.data;
};

// nijer kora sob custom travel request (notun age)
export const getMyCustomTravels = async (signal?: AbortSignal) => {
  const res = await api.get<{ success: boolean; data: ICustomTravel[] }>(
    `${BASE}/me`,
    { signal }
  );
  return res.data.data;
};
